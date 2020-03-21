import React from "react";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import { performPatientsVitalsSearch } from "./vitals-card.resource";
import styles from "./vitals-overview.css";
import { formatDate } from "../heightandweight/heightandweight-helper";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import { useRouteMatch, Link } from "react-router-dom";
import SummaryCardFooter from "../../ui-components/cards/summary-card-footer.component";

export default function VitalsOverview(props: VitalsOverviewProps) {
  const [patientVitals, setPatientVitals] = React.useState([]);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();
  const match = useRouteMatch();
  const chartBasePath =
    match.url.substr(0, match.url.search("/chart/")) + "/chart";
  const vitalsPath = chartBasePath + "/" + props.basePath;

  React.useEffect(() => {
    const subscription = performPatientsVitalsSearch(patientUuid).subscribe(
      vitals => setPatientVitals(vitals),
      createErrorHandler()
    );

    return () => subscription.unsubscribe();
  }, [patientUuid]);

  return (
    <SummaryCard
      name="Vitals"
      styles={{ width: "100%" }}
      link={`${props.basePath}`}
    >
      <table className={styles.vitalsTable}>
        <thead>
          <tr className="omrs-bold">
            <td></td>
            <td>BP</td>
            <td>Rate</td>
            <td>Oxygen</td>
            <td colSpan={2}>Temp</td>
          </tr>
        </thead>
        <tbody>
          {patientVitals &&
            patientVitals.map((vital, index) => {
              return (
                <React.Fragment key={vital.id}>
                  <tr>
                    <td>{formatDate(vital.date)}</td>
                    <td>
                      {`${vital.systolic} / ${vital.diastolic}`}
                      {index === 0 && <span> mmHg</span>}
                    </td>
                    <td>
                      {vital.pulse} {index === 0 && <span>bpm</span>}
                    </td>
                    <td>
                      {vital.oxygenation} {index === 0 && <span>%</span>}
                    </td>
                    <td>
                      {vital.temperature}
                      {index === 0 && <span> &#8451;</span>}
                    </td>
                    <td>
                      <Link to={`${match.path}/${vital.id}`}>
                        <svg
                          className="omrs-icon"
                          fill="var(--omrs-color-ink-low-contrast)"
                        >
                          <use xlinkHref="#omrs-icon-chevron-right" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
        </tbody>
      </table>
      <SummaryCardFooter linkTo={`${vitalsPath}`} />
    </SummaryCard>
  );
}

type VitalsOverviewProps = {
  basePath: string;
};
