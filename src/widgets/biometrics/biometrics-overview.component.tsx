import React from "react";

import { useTranslation } from "react-i18next";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-react-utils";
import { switchTo } from "@openmrs/esm-extensions";

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
import { Add16, ChartLineSmooth16, Table16 } from "@carbon/icons-react";
import dayjs from "dayjs";

import withConfig from "../../with-config";
import { ConfigObject } from "../../config-schema";
import { compare } from "../../utils/compare";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import ErrorState from "../../ui-components/error-state/error-state.component";
import styles from "./biometrics-overview.scss";
import { getPatientBiometrics } from "./biometric.resource";
import { useVitalsSignsConceptMetaData } from "../vitals/vitals-biometrics-form/use-vitalsigns";
import BiometricsChart from "./biometrics-chart.component";
import FloatingButton from "../../ui-components/floating-button/floating-button.component";

export interface PatientBiometrics {
  id: string;
  date: string;
  weight: number;
  height: number;
  bmi: number;
}

const BiometricsOverview: React.FC<BiometricsOverviewProps> = ({ config }) => {
  const initialResultsDisplayed = 3;
  const { t } = useTranslation();
  const [, , patientUuid] = useCurrentPatient();
  const { conceptsUnits } = useVitalsSignsConceptMetaData();
  const [biometrics, setBiometrics] = React.useState<Array<any>>();
  const [error, setError] = React.useState(null);
  const [displayAllResults, setDisplayAllResults] = React.useState(false);
  const { bmiUnit } = config.biometrics;
  const displayText = t("biometrics", "biometrics");
  const headerTitle = t("biometrics", "Biometrics");
  const [, , , heightUnit, weightUnit] = conceptsUnits;
  const [chartView, setChartView] = React.useState<boolean>();

  const tableHeaders = [
    { key: "date", header: "Date", isSortable: true },
    { key: "weight", header: `Weight (${weightUnit})` },
    { key: "height", header: `Height (${heightUnit})` },
    { key: "bmi", header: `BMI (${bmiUnit})` }
  ];

  const tableRows = biometrics
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
      const sub = getPatientBiometrics(
        config.concepts.weightUuid,
        config.concepts.heightUuid,
        patientUuid
      ).subscribe(
        biometrics => {
          setBiometrics(biometrics);
        },
        error => {
          setError(error);
          createErrorHandler();
        }
      );
      return () => sub.unsubscribe();
    }
  }, [patientUuid, config.concepts.weightUuid, config.concepts.heightUuid]);

  const sortRow = (cellA, cellB, { sortDirection, sortStates }) => {
    return sortDirection === sortStates.DESC
      ? compare(cellB.sortKey, cellA.sortKey)
      : compare(cellA.sortKey, cellB.sortKey);
  };

  const toggleAllResults = () => {
    setDisplayAllResults(prevState => !prevState);
  };

  const launchBiometricsForm = () => {
    const url = `/patient/${patientUuid}/vitalsbiometrics/form`;
    switchTo("workspace", url, {
      title: t("recordVitalsAndBiometrics", "Record Vitals and Biometrics")
    });
  };

  const RenderBiometrics: React.FC = () => {
    if (tableRows.length) {
      return (
        <div className={styles.biometricsWidgetContainer}>
          <div className={styles.biometricHeaderContainer}>
            <h4 className={`${styles.productiveHeading03} ${styles.text02}`}>
              Biometrics
            </h4>
            <Button
              kind="ghost"
              renderIcon={Add16}
              iconDescription="Add biometrics"
              onClick={launchBiometricsForm}
            >
              Add
            </Button>
          </div>
          <div className={styles.toggleButtons}>
            <Button
              className={styles.toggle}
              size="field"
              hasIconOnly
              kind={chartView ? "ghost" : "secondary"}
              renderIcon={Table16}
              iconDescription="Table View"
              onClick={() => setChartView(false)}
            />
            <Button
              className={styles.toggle}
              size="field"
              kind={chartView ? "secondary" : "ghost"}
              hasIconOnly
              renderIcon={ChartLineSmooth16}
              iconDescription="Chart View"
              onClick={() => setChartView(true)}
            />
          </div>
          {chartView ? (
            <>
              <BiometricsChart
                patientBiometrics={biometrics}
                conceptsUnits={conceptsUnits}
              />
              <FloatingButton onButtonClick={launchBiometricsForm} />
            </>
          ) : (
            <TableContainer>
              <DataTable
                rows={tableRows}
                headers={tableHeaders}
                isSortable={true}
                sortRow={sortRow}
                size="short"
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
          )}
        </div>
      );
    }
    return (
      <EmptyState
        displayText={displayText}
        headerTitle={headerTitle}
        launchForm={launchBiometricsForm}
      />
    );
  };

  return (
    <>
      {tableRows ? (
        <RenderBiometrics />
      ) : error ? (
        <ErrorState error={error} headerTitle={headerTitle} />
      ) : (
        <DataTableSkeleton rowCount={2} />
      )}
    </>
  );
};

export default withConfig(BiometricsOverview);

type BiometricsOverviewProps = {
  config?: ConfigObject;
};
