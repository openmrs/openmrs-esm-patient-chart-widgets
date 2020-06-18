import React, { useState, useEffect } from "react";
import { performPatientImmunizationsSearch } from "./immunizations.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import VaccinationRow from "./vaccinationRow";
import { openWorkspaceTab } from "../shared-utils";
import { ImmunizationsForm } from "./immunizations-form.component";
import { match, useRouteMatch, Link } from "react-router-dom";
import styles from "./immunizations-detailed-summary.css";
import dayjs from "dayjs";

export default function ImmunizationsDetailedSummary(
  props: ImmunizationsDetailedSummaryProps
) {
  const [patientImmunizations, setPatientImmunizations] = useState(null);
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();
  const match = useRouteMatch();
  useEffect(() => {
    if (!isLoadingPatient && patient) {
      const abortController = new AbortController();

      performPatientImmunizationsSearch(
        patient.identifier[0].value,
        abortController
      )
        .then(immunizations => setPatientImmunizations(immunizations))
        .catch(createErrorHandler());

      return () => abortController.abort();
    }
  }, [isLoadingPatient, patient]);

  function displayImmunizations() {
    return (
      <SummaryCard name="Immunizations" styles={{ width: "100%" }}>
        <table className={`omrs-type-body-regular ${styles.immunizationTable}`}>
          <thead>
            <tr>
              <td>Vaccine</td>
              <td>Recent vaccination</td>
            </tr>
          </thead>
          <tbody>
            {patientImmunizations &&
              patientImmunizations.entry.map(immunizations => {
                // return displayVaccinationRow(immunization);
                return (
                  <VaccinationRow immunization={immunizations}></VaccinationRow>
                );
              })}
          </tbody>
        </table>
      </SummaryCard>
    );
  }

  // function displayVaccinationRow<T>(immunization: T) {
  //   return (
  //     <React.Fragment key={immunization.resource.uuid}>
  //       <tr>
  //         <td className="omrs-medium">
  //           {immunization.resource.vaccineCode.text}
  //         </td>
  //         <td>
  //           <div className={`${styles.alignRight}`}>
  //             {dayjs(immunization.resource.occurrenceDateTime).format(
  //               "DD-MMM-YYYY"
  //             )}
  //           </div>
  //         </td>
  //         <td>
  //           <div className={styles.headerAdd}>
  //             <button
  //               className={`omrs-unstyled ${styles.addBtn}`}
  //               onClick={() =>
  //                 openWorkspaceTab(ImmunizationsForm, "Immunizations Form", [
  //                   {
  //                     immunizationUuid: immunization.resource.uuid,
  //                     immunizationName: immunization.resource.vaccineCode.text,
  //                     manufacturer:
  //                       immunization.resource.manufacturer.reference,
  //                     expirationDate: immunization.resource.expirationDate,
  //                     isSeries: immunization.resource.isSeries
  //                   }
  //                 ])
  //               }
  //             >
  //               Add{" "}
  //             </button>{" "}
  //           </div>
  //         </td>
  //       </tr>
  //       <tr id={immunization.resource.uuid} className="seriesRow">
  //         <td colSpan={4}>
  //           <table
  //             className={`omrs-type-body-regular ${styles.patientImmunizationSeriesTable}`}
  //           >
  //             <thead>
  //               <tr>
  //                 {immunization.resource.isSeries && <td>Series</td>}
  //                 <td>Vaccination Date</td>
  //                 <td>Expiration</td>
  //                 <td></td>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               {renderSeriesTable(
  //                 immunization.resource.protocolApplied,
  //                 immunization,
  //                 immunization.resource.isSeries
  //               )}
  //             </tbody>
  //           </table>
  //         </td>
  //       </tr>
  //     </React.Fragment>
  //   );
  // }

  function displayNoImmunizations() {
    return (
      <SummaryCard
        name="Immunizations"
        styles={{
          width: "100%",
          background: "var(--omrs-color-bg-low-contrast)",
          border: "none",
          boxShadow: "none"
        }}
      >
        <div className={styles.immunizationMargin}>
          <p className="omrs-medium">No Immunizations are documented.</p>
          <p className="omrs-medium">
            Please <a href="/">add patient Immunizations.</a>
          </p>
        </div>
      </SummaryCard>
    );
  }

  // function renderSeriesTable(protocols, immunization, isSeries) {
  //   return protocols?.map(protocolApplied => {
  //     return (
  //       <tr>
  //         {isSeries && (
  //           <td className="omrs-medium">{protocolApplied.protocol.series}</td>
  //         )}
  //         <td>
  //           <div className={`${styles.alignRight}`}>
  //             {dayjs(protocolApplied.protocol.occurrenceDateTime).format(
  //               "DD-MMM-YYYY"
  //             )}
  //           </div>
  //         </td>
  //         <td>
  //           <div className={`${styles.alignRight}`}>
  //             {dayjs(protocolApplied.protocol.expirationDate).format(
  //               "DD-MMM-YYYY"
  //             )}
  //           </div>
  //         </td>
  //         <td>
  //           {
  //             <Link to={`${match.path}/${immunization.resource.uuid}`}>
  //               <svg
  //                 className="omrs-icon"
  //                 fill="var(--omrs-color-ink-low-contrast)"
  //                 onClick={() =>
  //                   openWorkspaceTab(ImmunizationsForm, "Immunizations Form", [
  //                     {
  //                       immunizationUuid: immunization.resource.uuid,
  //                       immunizationName:
  //                         immunization.resource.vaccineCode.text,
  //                       manufacturer:
  //                         immunization.resource.manufacturer.reference,
  //                       expirationDate: protocolApplied.protocol.expirationDate,
  //                       isSeries: immunization.resource.isSeries,
  //                       series: protocolApplied.protocol.series,
  //                       vaccinationDate:
  //                         protocolApplied.protocol.occurrenceDateTime
  //                     }
  //                   ])
  //                 }
  //               >
  //                 <use xlinkHref="#omrs-icon-chevron-right" />
  //               </svg>
  //             </Link>
  //           }
  //         </td>
  //       </tr>
  //     );
  //   });
  // }

  return (
    <>
      {patientImmunizations && (
        <div className={styles.immunizationSummary}>
          {patientImmunizations.total > 0
            ? displayImmunizations()
            : displayNoImmunizations()}
        </div>
      )}
    </>
  );
}

type ImmunizationsDetailedSummaryProps = {};
