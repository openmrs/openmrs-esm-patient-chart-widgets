import React from "react";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import { getDimensionsObservationsRestAPI } from "./heightandweight.resource";
import SummaryCardRow from "../../ui-components/cards/summary-card-row.component";
import SummaryCardRowContent from "../../ui-components/cards/summary-card-row-content.component";
import styles from "./heightandweight-overview.css";
import { useCurrentPatient } from "@openmrs/esm-api";
import SummaryCardFooter from "../../ui-components/cards/summary-card-footer.component";

export default function HeightAndWeightOverview(
  props: HeightAndWeightOverviewProps
) {
  const [dimensions, setDimensions] = React.useState([]);
  const [showMore, setShowMore] = React.useState(false);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();

  React.useEffect(() => {
    if (patientUuid) {
      const sub = getDimensionsObservationsRestAPI(patientUuid).subscribe(
        dimensions => {
          setDimensions(dimensions);
        }
      );

      return () => sub.unsubscribe();
    }
  }, [patientUuid]);

  function displayDimensions() {
    return (
      <SummaryCard
        name="Height & Weight"
        link={`/patient/${patientUuid}/chart/dimensions`}
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
                  <th className={styles.tableHeader}>Weight</th>
                  <th className={styles.tableHeader}>Height</th>
                  <th className={styles.tableHeader}>BMI</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {dimensions
                  .slice(0, showMore ? 6 : 3)
                  .map((dimension, index) => (
                    <tr key={dimension.id} className={styles.tableRow}>
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
                        <svg
                          className="omrs-icon"
                          fill="var(--omrs-color-ink-low-contrast)"
                        >
                          <use xlinkHref="#omrs-icon-chevron-right" />
                        </svg>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </SummaryCardRowContent>
        </SummaryCardRow>
        <SummaryCardFooter
          linkTo={`/patient/${patientUuid}/chart/dimensions`}
        />
      </SummaryCard>
    );
  }

  return (
    <>
      {dimensions && dimensions.length ? (
        displayDimensions()
      ) : (
        <SummaryCard name="Height & Weight">
          <div className={styles.emptyDimensions}>
            <p className="omrs-type-body-regular">No Dimensions recorded.</p>
          </div>
        </SummaryCard>
      )}
    </>
  );
}

type HeightAndWeightOverviewProps = {};
