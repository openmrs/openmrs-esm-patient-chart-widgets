import React from "react";

import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import { useCurrentPatient } from "@openmrs/esm-react-utils";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { switchTo } from "@openmrs/esm-extensions";

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
import { Add16, ChartLineSmooth16, Table16 } from "@carbon/icons-react";

import withConfig from "../../with-config";
import { ConfigObject } from "../../config-schema";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import ErrorState from "../../ui-components/error-state/error-state.component";
import { useVitalsSignsConceptMetaData } from "./vitals-biometrics-form/use-vitalsigns";
import {
  performPatientsVitalsSearch,
  PatientVitals
} from "./vitals-biometrics.resource";
import styles from "./vitals-overview.scss";

const VitalsOverview: React.FC<VitalsOverviewProps> = ({ config }) => {
  const { t } = useTranslation();
  const {
    vitalsSignsConceptMetadata,
    conceptsUnits
  } = useVitalsSignsConceptMetaData();

  const [bloodPressureUnit, , temperatureUnit, , , pulseUnit] = conceptsUnits;
  const initialResultsDisplayed = 3;
  const [isLoadingPatient, , patientUuid] = useCurrentPatient();
  const [currentVitals, setCurrentVitals] = React.useState<
    Array<PatientVitals>
  >(null);
  const [error, setError] = React.useState(null);
  const [displayAllResults, setDisplayAllResults] = React.useState(false);
  const displayText = t("vitalSigns", "vital signs");
  const headerTitle = t("vitals", "Vitals");

  React.useEffect(() => {
    if (!isLoadingPatient && patientUuid) {
      const subscription = performPatientsVitalsSearch(
        config.concepts,
        patientUuid
      ).subscribe(
        vitals => {
          setCurrentVitals(vitals);
        },
        error => {
          setError(error);
          createErrorHandler();
        }
      );

      return () => subscription.unsubscribe();
    }
  }, [isLoadingPatient, patientUuid, config.concepts]);

  const tableHeaders = [
    { key: "date", header: "Date", isSortable: true },
    { key: "bloodPressure", header: `BP (${bloodPressureUnit})` },
    { key: "pulse", header: `Pulse (${pulseUnit})` },
    {
      key: "temperature",
      header: `Temp (${temperatureUnit})`
    }
  ];

  const tableRows = currentVitals
    ?.slice(0, displayAllResults ? currentVitals.length : 3)
    .map((vital, index) => {
      return {
        id: `${index}`,
        date: dayjs(vital.date).format(`DD - MMM - YYYY`),
        bloodPressure: `${vital.systolic ?? "-"} / ${vital.diastolic ?? "-"}`,
        pulse: vital.pulse,
        temperature: vital.temperature
      };
    });

  const toggleAllResults = () => {
    setDisplayAllResults(prevState => !prevState);
  };
  const launchVitalsBiometricsForm = () => {
    const url = `/patient/${patientUuid}/vitalsbiometrics/form`;
    switchTo("workspace", url, {
      title: t("recordVitalsAndBiometrics", "Record Vitals and Biometrics")
    });
  };

  const RenderVitals: React.FC = () => {
    if (tableRows.length) {
      return (
        <div>
          <div className={styles.biometricHeaderContainer}>
            <h4>Vitals</h4>
            <Button
              kind="ghost"
              renderIcon={Add16}
              iconDescription="Add vitals"
              onClick={launchVitalsBiometricsForm}
            >
              Add
            </Button>
          </div>
          <div className={styles.toggleButtons}>
            <Button
              className={styles.toggle}
              size="field"
              kind="secondary"
              hasIconOnly
              renderIcon={Table16}
              iconDescription="Table View"
            />
            <Button
              className={styles.toggle}
              size="field"
              kind="ghost"
              hasIconOnly
              renderIcon={ChartLineSmooth16}
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
        displayText={displayText}
        headerTitle={headerTitle}
        launchForm={launchVitalsBiometricsForm}
      />
    );
  };

  return (
    <>
      {tableRows ? (
        <RenderVitals />
      ) : error ? (
        <ErrorState error={error} headerTitle={headerTitle} />
      ) : (
        <DataTableSkeleton rowCount={2} />
      )}
    </>
  );
};

export default withConfig(VitalsOverview);

type VitalsOverviewProps = {
  config?: ConfigObject;
};
