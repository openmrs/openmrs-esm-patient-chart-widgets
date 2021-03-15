import React from "react";
import dayjs from "dayjs";
import Add16 from "@carbon/icons-react/es/add/16";
import ChartLineSmooth16 from "@carbon/icons-react/es/chart--line-smooth/16";
import Table16 from "@carbon/icons-react/es/table/16";
import Button from "carbon-components-react/es/components/Button";
import Pagination from "carbon-components-react/es/components/Pagination";
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
import styles from "./vitals-overview.scss";
import VitalsChart from "./vitals-chart.component";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import ErrorState from "../../ui-components/error-state/error-state.component";
import { useTranslation } from "react-i18next";
import {
  useCurrentPatient,
  useConfig,
  createErrorHandler,
  switchTo
} from "@openmrs/esm-framework";
import { useVitalsSignsConceptMetaData } from "./vitals-biometrics-form/use-vitalsigns";
import {
  performPatientsVitalsSearch,
  PatientVitals
} from "./vitals-biometrics.resource";

interface VitalsOverviewProps {}

const VitalsOverview: React.FC<VitalsOverviewProps> = () => {
  const config = useConfig();
  const vitalsToShowCount = 5;
  const { t } = useTranslation();
  const { conceptsUnits } = useVitalsSignsConceptMetaData();

  const [
    bloodPressureUnit,
    ,
    temperatureUnit,
    ,
    ,
    pulseUnit,
    oxygenationUnit,
    ,
    respiratoryRateUnit
  ] = conceptsUnits;

  const [isLoadingPatient, , patientUuid] = useCurrentPatient();
  const [chartView, setChartView] = React.useState<boolean>();
  const [vitals, setVitals] = React.useState<Array<PatientVitals>>(null);
  const [error, setError] = React.useState(null);
  const [firstRowIndex, setFirstRowIndex] = React.useState(0);
  const [currentPageSize, setCurrentPageSize] = React.useState(5);

  const displayText = t("vitalSigns", "vital signs");
  const headerTitle = t("vitals", "Vitals");
  const previousPage = t("previousPage", "Previous page");
  const nextPage = t("nextPage", "Next Page");
  const itemPerPage = t("itemPerPage", "Item per page");

  React.useEffect(() => {
    if (patientUuid) {
      const subscription = performPatientsVitalsSearch(
        config.concepts,
        patientUuid,
        100
      ).subscribe(
        vitals => {
          setVitals(vitals);
        },
        error => {
          setError(error);
          createErrorHandler();
        }
      );
      return () => subscription.unsubscribe();
    }
  }, [patientUuid]);

  const tableHeaders = [
    { key: "date", header: "Date", isSortable: true },
    { key: "bloodPressure", header: `BP (${bloodPressureUnit})` },
    { key: "rrate", header: `Rate (${respiratoryRateUnit})` },
    { key: "pulse", header: `Pulse (${pulseUnit})` },
    { key: "spo2", header: `SPO2 (${oxygenationUnit})` },
    {
      key: "temperature",
      header: `Temp (${temperatureUnit})`
    }
  ];

  const tableRows = vitals
    ?.slice(firstRowIndex, firstRowIndex + currentPageSize)
    .map((vital, index) => {
      return {
        id: `${index}`,
        date: dayjs(vital.date).format(`DD - MMM - YYYY`),
        bloodPressure: `${vital.systolic ?? "-"} / ${vital.diastolic ?? "-"}`,
        pulse: vital.pulse,
        spo2: vital.oxygenSaturation,
        temperature: vital.temperature,
        rrate: vital.respiratoryRate
      };
    });

  const launchVitalsBiometricsForm = () => {
    const url = `/patient/${patientUuid}/vitalsbiometrics/form`;
    switchTo("workspace", url, {
      title: t("recordVitalsAndBiometrics", "Record Vitals and Biometrics")
    });
  };

  const RenderVitals: React.FC = () => {
    if (tableRows.length) {
      const totalRows = vitals.length;
      return (
        <div className={styles.vitalsWidgetContainer}>
          <div className={styles.vitalsHeaderContainer}>
            <h4 className={`${styles.productiveHeading03} ${styles.text02}`}>
              {headerTitle}
            </h4>
            <div className={styles.toggleButtons}>
              <Button
                className={styles.toggle}
                size="field"
                kind={chartView ? "ghost" : "secondary"}
                hasIconOnly
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
              iconDescription="Add vitals"
              onClick={launchVitalsBiometricsForm}
            >
              {t("add", "Add")}
            </Button>
          </div>
          {chartView ? (
            <VitalsChart patientVitals={vitals} conceptsUnits={conceptsUnits} />
          ) : (
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
                        {headers.map(header => (
                          <TableHeader
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
          )}
          {totalRows > vitalsToShowCount && (
            <Pagination
              totalItems={vitals.length}
              backwardText={previousPage}
              forwardText={nextPage}
              pageSize={currentPageSize}
              pageSizes={[5, 10, 15, 25]}
              itemsPerPageText={itemPerPage}
              onChange={({ page, pageSize }) => {
                if (pageSize !== currentPageSize) {
                  setCurrentPageSize(pageSize);
                }
                setFirstRowIndex(pageSize * (page - 1));
              }}
            />
          )}
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
        <DataTableSkeleton rowCount={vitalsToShowCount} />
      )}
    </>
  );
};

export default VitalsOverview;
