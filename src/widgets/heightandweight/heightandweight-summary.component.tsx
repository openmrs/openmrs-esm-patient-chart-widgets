import React, { useEffect, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { Link, useRouteMatch } from "react-router-dom";
import styles from "./heightandweight-summary.css";
import { useCurrentPatient } from "@openmrs/esm-api";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import VitalsForm from "../vitals/vitals-form.component";
import { getDimensions } from "./heightandweight.resource";
import { openWorkspaceTab } from "../shared-utils";
import { ConfigObject } from "../../config-schema";
import withConfig from "../../with-config";

function HeightAndWeightSummary(props: HeightAndWeightSummaryProps) {
  const match = useRouteMatch();
  const { t } = useTranslation();
  const [dimensions, setDimensions] = useState([]);
  const [, , patientUuid] = useCurrentPatient();

  useEffect(() => {
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
  }, [patientUuid, props.config]);

  return (
    <div className="styles.dimensionsSummary">
      {dimensions && dimensions.length ? (
        <SummaryCard
          name={t("Height & Weight")}
          addComponent={VitalsForm}
          showComponent={() =>
            openWorkspaceTab(VitalsForm, `${t("Vitals Form")}`)
          }
        >
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableRow}>
                <th
                  className={`${styles.tableHeader} ${styles.tableDates}`}
                ></th>
                <th className={styles.tableHeader}>
                  <Trans i18nKey="weight">
                    Weight (<Trans i18nKey="kg">kg</Trans>)
                  </Trans>
                </th>
                <th className={styles.tableHeader}>
                  <Trans i18nKey="height">
                    Height (<Trans i18nKey="cm">cm</Trans>)
                  </Trans>
                </th>
                <th className={styles.tableHeader}>
                  <Trans i18nKey="bmi">BMI</Trans> (kg/m<sup>2</sup>)
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dimensions.map(dimension => (
                <tr key={dimension.id} className={styles.tableRow}>
                  <td
                    className={styles.tableData}
                    style={{ textAlign: "start" }}
                  >
                    <span style={{ fontWeight: 500 }}>
                      {dimension.date.split(" ")[0]}
                    </span>{" "}
                    {dimension.date.slice(
                      dimension.date.indexOf(" ") + 1,
                      dimension.date.length
                    )}
                  </td>
                  <td className={styles.tableData}>
                    {dimension.weight || "\u2014"}
                  </td>
                  <td className={styles.tableData}>
                    {dimension.height || "\u2014"}
                  </td>
                  <td className={styles.tableData}>
                    {dimension.bmi || "\u2014"}
                  </td>
                  <td style={{ textAlign: "end" }}>
                    <Link to={`${match.path}/${dimension.id}`}>
                      <svg className="omrs-icon" fill="rgba(0, 0, 0, 0.54)">
                        <use xlinkHref="#omrs-icon-chevron-right" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SummaryCard>
      ) : (
        <EmptyState
          name={t("Height & Weight")}
          showComponent={() =>
            openWorkspaceTab(VitalsForm, `${t("Vitals Form")}`)
          }
          addComponent={VitalsForm}
          displayText={t("dimensions", "dimensions")}
        />
      )}
    </div>
  );
}

type HeightAndWeightSummaryProps = {
  config: ConfigObject;
};

export default withConfig(HeightAndWeightSummary);
