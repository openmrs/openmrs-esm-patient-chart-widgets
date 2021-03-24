import React from "react";
import dayjs from "dayjs";
import Add16 from "@carbon/icons-react/es/add/16";
import ChartLineSmooth16 from "@carbon/icons-react/es/chart--line-smooth/16";
import Table16 from "@carbon/icons-react/es/table/16";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import ErrorState from "../../ui-components/error-state/error-state.component";
import styles from "./biometrics-overview.scss";
import BiometricsChart from "./biometrics-chart.component";
import Button from "carbon-components-react/es/components/Button";
import DataTableSkeleton from "carbon-components-react/es/components/DataTableSkeleton";
import DataTable, {
  Table,
  TableCell,
  TableContainer,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "carbon-components-react/es/components/DataTable";
import { useTranslation } from "react-i18next";
import {
  useCurrentPatient,
  createErrorHandler,
  switchTo,
  useConfig
} from "@openmrs/esm-framework";
import { getPatientBiometrics } from "./biometric.resource";
import { useVitalsSignsConceptMetaData } from "../vitals/vitals-biometrics-form/use-vitalsigns";
import PatientChartPagination from "../../ui-components/pagination/pagination.component";
import { usePaginate } from "../../utils/use-paginate";

export interface PatientBiometrics {
  id: string;
  date: string;
  weight: number;
  height: number;
  bmi: number;
}

interface BiometricsOverviewProps {}

const BiometricsOverview: React.FC<BiometricsOverviewProps> = () => {
  const config = useConfig();
  const { t } = useTranslation();
  const [, , patientUuid] = useCurrentPatient();
  const { conceptsUnits } = useVitalsSignsConceptMetaData();
  const [biometrics, setBiometrics] = React.useState<Array<any>>();
  const [error, setError] = React.useState(null);
  const { bmiUnit } = config.biometrics;
  const [, , , heightUnit, weightUnit] = conceptsUnits;
  const [chartView, setChartView] = React.useState<boolean>();
  const [pageNumber, setPageNumber] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (patientUuid) {
      const sub = getPatientBiometrics(
        config.concepts.weightUuid,
        config.concepts.heightUuid,
        patientUuid
      ).subscribe(
        biometrics => {
          setBiometrics(biometrics);
          setIsLoading(false);
        },
        error => {
          setError(error);
          createErrorHandler();
          setIsLoading(false);
        }
      );
      return () => sub.unsubscribe();
    }
  }, [patientUuid, config.concepts.weightUuid, config.concepts.heightUuid]);

  const handlePageChange = ({ page }) => {
    setPageNumber(page);
  };

  const [page] = usePaginate(biometrics, pageNumber);

  const tableHeaders = [
    { key: "date", header: "Date" },
    { key: "weight", header: `Weight (${weightUnit})` },
    { key: "height", header: `Height (${heightUnit})` },
    { key: "bmi", header: `BMI (${bmiUnit})` }
  ];

  const tableRows = page?.map((biometric: PatientBiometrics, index) => {
    return {
      id: `${index}`,
      date: dayjs(biometric.date).format(`DD - MMM - YYYY`),
      weight: biometric.weight,
      height: biometric.height,
      bmi: biometric.bmi
    };
  });

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
          <div className={styles.biometricsHeaderContainer}>
            <h4 className={`${styles.productiveHeading03} ${styles.text02}`}>
              {t("biometrics", "Biometrics")}
            </h4>
            <div className={styles.toggleButtons}>
              <Button
                className={styles.toggle}
                size="field"
                hasIconOnly
                kind={chartView ? "ghost" : "secondary"}
                renderIcon={Table16}
                iconDescription={t("tableView", "Table View")}
                onClick={() => setChartView(false)}
              />
              <Button
                className={styles.toggle}
                size="field"
                kind={chartView ? "secondary" : "ghost"}
                hasIconOnly
                renderIcon={ChartLineSmooth16}
                iconDescription={t("chartView", "Chart View")}
                onClick={() => setChartView(true)}
              />
            </div>
            <Button
              kind="ghost"
              renderIcon={Add16}
              iconDescription="Add biometrics"
              onClick={launchBiometricsForm}
            >
              {t("add", "Add")}
            </Button>
          </div>
          {chartView ? (
            <BiometricsChart
              patientBiometrics={biometrics}
              conceptsUnits={conceptsUnits}
            />
          ) : (
            <>
              <TableContainer>
                <DataTable
                  rows={tableRows}
                  headers={tableHeaders}
                  isSortable={true}
                  size="short"
                >
                  {({ rows, headers, getHeaderProps, getTableProps }) => (
                    <Table {...getTableProps()}>
                      <TableHead>
                        <TableRow>
                          {headers.map((header, index) => (
                            <TableHeader
                              key={index}
                              className={`${styles.productiveHeading01} ${styles.text02}`}
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
                      </TableBody>
                    </Table>
                  )}
                </DataTable>
              </TableContainer>
              <PatientChartPagination
                items={biometrics}
                onPageNumberChange={handlePageChange}
                pageNumber={pageNumber}
                pageUrl="results/biometrics"
                currentPage={page}
              />
            </>
          )}
        </div>
      );
    }
    return (
      <EmptyState
        displayText={t("biometrics", "biometrics")}
        headerTitle={t("biometrics", "Biometrics")}
        launchForm={launchBiometricsForm}
      />
    );
  };

  return (
    <>
      {isLoading ? <DataTableSkeleton rowCount={5} /> : <RenderBiometrics />}
      {error && (
        <ErrorState error={error} headerTitle={t("biometrics", "biometrics")} />
      )}
    </>
  );
};

export default BiometricsOverview;
