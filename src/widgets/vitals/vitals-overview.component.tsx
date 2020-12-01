import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useCurrentPatient, useConfig } from "@openmrs/esm-react-utils";
import { createErrorHandler } from "@openmrs/esm-error-handling";

import {
  TableContainer,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Button,
  Link,
  DataTableSkeleton
} from "carbon-components-react";
import { Add24, ChartLineSmooth24, Table24 } from "@carbon/icons-react";
import dayjs from "dayjs";

import { openWorkspaceTab } from "../shared-utils";
import {
  performPatientsVitalsSearch,
  PatientVitals
} from "./vitals-card.resource";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import VitalsForm from "./vitals-form.component";
import styles from "./vitals-overview.scss";

function VitalsOverview() {
  const config = useConfig();
  const { t } = useTranslation();
  const initialResultsDisplayed = 3;
  const [currentVitals, setCurrentVitals] = useState<PatientVitals[]>(null);
  const [displayAllResults, setDisplayAllResults] = useState(false);
  const [isLoadingPatient, , patientUuid] = useCurrentPatient();

  useEffect(() => {
    if (!isLoadingPatient && patientUuid) {
      const subscription = performPatientsVitalsSearch(
        config.concepts,
        patientUuid
      ).subscribe(vitals => {
        setCurrentVitals(vitals);
      }, createErrorHandler());

      return () => subscription.unsubscribe();
    }
  }, [isLoadingPatient, patientUuid]);

  const tableHeaders = [
    { key: "date", header: "Date", isSortable: true },
    { key: "bloodPressure", header: "BP (mmHg)" },
    { key: "pulse", header: "SPO2 (%)" },
    {
      key: "temperature",
      header: <>Temp (&#8451;)</>
    }
  ];

  const tableRows = currentVitals
    ?.slice(0, displayAllResults ? currentVitals.length : 3)
    .map((vital, index) => {
      return {
        id: `${index}`,
        date: dayjs(vital.date).format(`DD - MMM - YYYY`),
        bloodPressure: `${vital.systolic} / ${vital.diastolic}`,
        pulse: vital.pulse,
        temperature: vital.temperature
      };
    });

  const toggleAllResults = () => {
    setDisplayAllResults(prevState => !prevState);
  };

  const RenderVitals = () => {
    if (tableRows.length) {
      return (
        <div>
          <div className={styles.biometricHeaderContainer}>
            <h4>Vitals</h4>
            <Link className={styles.iconContainer}>
              Add <Add24 />
            </Link>
          </div>
          <div className={styles.toggleButtons}>
            <Button
              hasIconOnly
              kind="secondary"
              renderIcon={Table24}
              iconDescription="Table View"
            />
            <Button
              kind="ghost"
              hasIconOnly
              renderIcon={ChartLineSmooth24}
              iconDescription="Chart View"
            />
          </div>
          <TableContainer>
            <DataTable
              rows={tableRows}
              headers={tableHeaders}
              isSortable={true}
            >
              {({ rows, headers, getHeaderProps, getTableProps }) => (
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {headers.map(header => (
                        <TableHeader
                          {...getHeaderProps({
                            header,
                            isSortable: header.isSortable
                          })}
                        >
                          {header.header?.content ?? header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map(row => (
                      <TableRow key={row.id}>
                        {row.cells.map(cell => (
                          <TableCell key={cell.id}>
                            {cell.value?.content ?? cell.value}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                    {!displayAllResults &&
                      currentVitals?.length > initialResultsDisplayed && (
                        <TableRow>
                          <TableCell colSpan={4}>
                            {`${initialResultsDisplayed} / ${currentVitals.length}`}{" "}
                            <Link onClick={toggleAllResults}>See all</Link>
                          </TableCell>
                        </TableRow>
                      )}
                  </TableBody>
                </Table>
              )}
            </DataTable>
          </TableContainer>
        </div>
      );
    }
    return (
      <EmptyState
        displayText={t("vitalSigns", "vital signs")}
        headerTitle={t("vitals", "Vitals")}
        launchForm={() =>
          openWorkspaceTab(VitalsForm, `${t("vitalsForm", "Vitals form")}`)
        }
      />
    );
  };

  return (
    <>{tableRows ? <RenderVitals /> : <DataTableSkeleton rowCount={2} />}</>
  );
}

export default VitalsOverview;
