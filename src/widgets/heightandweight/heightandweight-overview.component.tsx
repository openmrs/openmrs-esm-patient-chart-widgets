import React from "react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { useCurrentPatient } from "@openmrs/esm-api";
import { ConfigObject } from "../../config-schema";
import SummaryCardFooter from "../../ui-components/cards/summary-card-footer.component";
import SummaryCardRowContent from "../../ui-components/cards/summary-card-row-content.component";
import SummaryCardRow from "../../ui-components/cards/summary-card-row.component";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import useChartBasePath from "../../utils/use-chart-base";
import { openWorkspaceTab } from "../shared-utils";
import VitalsForm from "../vitals/vitals-form.component";
import withConfig from "../../with-config";
import styles from "./heightandweight-overview.css";
import { getDimensions } from "./heightandweight.resource";

function HeightAndWeightOverview(props: HeightAndWeightOverviewProps) {
  const [dimensions, setDimensions] = React.useState([]);
  const [showMore, setShowMore] = React.useState(false);
  const [, , patientUuid] = useCurrentPatient();
  const chartBasePath = useChartBasePath();
  const heightweightPath = chartBasePath + "/" + props.basePath;
  const { t } = useTranslation();

  React.useEffect(() => {
    if (patientUuid) {
      const sub = getDimensions(
        props.config.concepts.weightUuid,
        props.config.concepts.heightUuid,
        patientUuid
      ).subscribe(dimensions => {
        setDimensions(dimensions);
      });

      return () => sub.unsubscribe();
    }
  }, [
    patientUuid,
    props.config.concepts.weightUuid,
    props.config.concepts.heightUuid
  ]);

  return (
    <>
      {dimensions.length > 0 ? (
        <SummaryCard
          name={t("heightAndWeight", "Height & Weight")}
          link={`${heightweightPath}`}
          showComponent={() =>
            openWorkspaceTab(VitalsForm, `${t("vitalsForm", "Vitals Form")}`)
          }
          addComponent={VitalsForm}
        >
          <SummaryCardRow>
            <SummaryCardRowContent>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.tableRow}>
                    <th
                      className={`${styles.tableHeader} ${styles.tableDates}`}
                      style={{ textAlign: "start" }}
                    ></th>
                    <th className={styles.tableHeader}>
                      <Trans i18nKey="weight">Weight</Trans>
                    </th>
                    <th className={styles.tableHeader}>
                      <Trans i18nKey="height">Height</Trans>
                    </th>
                    <th className={styles.tableHeader}>
                      <Trans i18nKey="bmi">BMI</Trans>
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {dimensions
                    .slice(0, showMore ? 6 : 3)
                    .map((dimension, index) => (
                      <tr key={index} className={styles.tableRow}>
                        <td
                          className={styles.tableData}
                          style={{ textAlign: "start" }}
                        >
                          {dimension.date}
                        </td>
                        <td className={styles.tableData}>
                          {dimension.weight || "\u2014"}
                          <span className={styles.unit}>
                            {index === 0 && " kg"}
                          </span>
                        </td>
                        <td className={styles.tableData}>
                          {dimension.height || "\u2014"}
                          <span className={styles.unit}>
                            {index === 0 && " cm"}
                          </span>
                        </td>
                        <td className={styles.tableData}>
                          {dimension.bmi || "\u2014"}
                          {}
                          <span className={styles.unit}>
                            {index === 0 && " kg/m"}
                            {index === 0 && <sup>2</sup>}
                          </span>
                        </td>
                        <td style={{ textAlign: "end" }}>
                          <Link to={`${heightweightPath}/${dimension.id}`}>
                            <svg
                              className="omrs-icon"
                              fill="rgba(0, 0, 0, 0.54)"
                            >
                              <use xlinkHref="#omrs-icon-chevron-right" />
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </SummaryCardRowContent>
          </SummaryCardRow>
          <SummaryCardFooter linkTo={`${heightweightPath}`} />
        </SummaryCard>
      ) : (
        <EmptyState
          name={t("heightAndWeight", "Height & Weight")}
          displayText={t("dimensions", "dimensions")}
          showAddComponent={() =>
            openWorkspaceTab(VitalsForm, `${t("vitalsForm", "Vitals Form")}`)
          }
        />
      )}
    </>
  );
}

type HeightAndWeightOverviewProps = {
  basePath: string;
  config: ConfigObject;
};

export default withConfig(HeightAndWeightOverview);
