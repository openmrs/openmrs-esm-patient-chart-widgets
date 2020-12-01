import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Button,
  DataTable,
  DataTableSkeleton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow
} from "carbon-components-react";
import { Add24, ChartLineSmooth24, Table24 } from "@carbon/icons-react";
import dayjs from "dayjs";

import { useCurrentPatient, useConfig } from "@openmrs/esm-react-utils";
import { getDimensions } from "../heightandweight/heightandweight.resource";

import { compare } from "../../utils/compare";
import { openWorkspaceTab } from "../shared-utils";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import styles from "./biometric-overview.component.scss";

interface PatientBiometrics {
  id: string;
  date: any;
  weight: number;
  height: number;
  bmi: number;
}

const BiometricOverview: React.FC = () => {
  const config = useConfig();
  const { t } = useTranslation();
  const [, , patientUuid] = useCurrentPatient();
  const initialResultsDisplayed = 3;
  const [biometrics, setBiometrics] = React.useState<Array<any>>();
  const [displayAllResults, setDisplayAllResults] = useState(false);

  const tableHeaders = [
    { key: "date", header: "Date", isSortable: true },
    { key: "weight", header: "Weight (kg)" },
    { key: "height", header: "Height (cm)" },
    {
      key: "bmi",
      header: (
        <>
          BMI (kg/m<sup>2</sup>)
        </>
      )
    }
  ];

  const tableRows: Array<PatientBiometrics> = biometrics
    ?.slice(0, displayAllResults ? biometrics.length : 3)
    ?.map((biometric: PatientBiometrics, index) => {
      return {
        id: `${index}`,
        date: {
          content: dayjs(biometric.date).format(`DD - MMM - YYYY`),
          sortKey: dayjs(biometric.date).toDate()
        },
        weight: biometric.weight,
        height: biometric.height,
        bmi: biometric.bmi
      };
    });

  React.useEffect(() => {
    if (patientUuid) {
      const sub = getDimensions(
        config.concepts.weightUuid,
        config.concepts.heightUuid,
        patientUuid
      ).subscribe(data => {
        setBiometrics(data);
      });
      return () => sub.unsubscribe();
    }
  }, [patientUuid, config.concepts.heightUuid, config.concepts.weightUuid]);

  const sortRow = (cellA, cellB, { sortDirection, sortStates }) => {
    return sortDirection === sortStates.DESC
      ? compare(cellB.sortKey, cellA.sortKey)
      : compare(cellA.sortKey, cellB.sortKey);
  };

  const toggleAllResults = () => {
    setDisplayAllResults(prevState => !prevState);
  };

  const RenderBiometrics = () => {
    if (tableRows.length) {
      return (
        <>
          <div className={styles.biometricHeaderContainer}>
            <h4>Biometrics</h4>
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
          {tableRows ? (
            <TableContainer>
              <DataTable
                rows={tableRows}
                headers={tableHeaders}
                isSortable={true}
                sortRow={sortRow}
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
                      {biometrics.length > initialResultsDisplayed && (
                        <TableRow>
                          {!displayAllResults && (
                            <TableCell colSpan={4}>
                              {`${initialResultsDisplayed} / ${biometrics.length}`}{" "}
                              <Link onClick={toggleAllResults}>See all</Link>
                            </TableCell>
                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </DataTable>
            </TableContainer>
          ) : (
            <DataTableSkeleton rowCount={2} />
          )}
        </>
      );
    }
    return (
      <EmptyState
        displayText={t("biometrics", "biometrics")}
        headerTitle={t("biometrics", "Biometrics")}
        // showComponent={() =>
        //   openWorkspaceTab(VitalsForm, `${t("vitalsForm", "Vitals form")}`)
        // }
        // addComponent={VitalsForm}
      />
    );
  };

  return (
    <>{tableRows ? <RenderBiometrics /> : <DataTableSkeleton rowCount={2} />}</>
  );
};

export default BiometricOverview;
