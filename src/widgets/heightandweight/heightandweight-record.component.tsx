import React, { useState, useEffect } from "react";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import styles from "./heightandweight-record.css";
import dayjs from "dayjs";
import { getDimensions } from "./heightandweight.resource";
import { useCurrentPatient } from "@openmrs/esm-api";
import { isEmpty } from "lodash-es";
import {
  convertToPounds,
  convertToFeet,
  convertoToInches,
  customDateFormat
} from "./heightandweight-helper";
import { useRouteMatch } from "react-router-dom";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import { openWorkspaceTab } from "../shared-utils";
import VitalsForm from "../vitals/vitals-form.component";
import { useTranslation } from "react-i18next";

export default function HeightAndWeightRecord(
  props: HeightAndWeightRecordProps
) {
  const { t } = useTranslation();
  const [dimensions, setDimensions] = useState<any>({});
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();

  let heightWeightParams = useRouteMatch();

  useEffect(() => {
    if (patientUuid) {
      const sub = getDimensions(patientUuid).subscribe(response => {
        setDimensions(
          response.find(
            dimension =>
              dimension.obsData.weight.uuid === heightWeightParams.params[0]
          )
        );
      });
      return () => sub && sub.unsubscribe();
    }
  }, [heightWeightParams.params, patientUuid, isLoadingPatient]);

  function displayNoHeightAndWeight() {
    return (
      <EmptyState
        showComponent={() => openWorkspaceTab(VitalsForm, "Vitals Form")}
        addComponent={VitalsForm}
        name={t("Height & Weight", "Height & Weight")}
        displayText={t(
          "The patient's Height and Weight is not documented.",
          "The patient's Height and Weight is not documented."
        )}
      />
    );
  }

  function displayHeightAndWeight() {
    return (
      <div className={styles.heightAndWeightDetailedSummary}>
        <SummaryCard
          name={t("Height & Weight", "Height & Weight")}
          styles={{ width: "100%" }}
        >
          <div className={styles.heightAndWeightContainer}>
            {!isEmpty(dimensions) && (
              <table className={styles.summaryTable}>
                <tbody>
                  <tr>
                    <td>Measured at </td>
                    <td>
                      {[
                        customDateFormat(
                          dimensions?.obsData?.weight?.effectiveDatetime,
                          "DD-MMM-YYYY"
                        ),
                        customDateFormat(
                          dimensions?.obsData?.weight?.effectiveDatetime,
                          "HH:mm A"
                        )
                      ].join(" ")}
                    </td>
                  </tr>
                  <tr>
                    <td>Weight</td>
                    <td>
                      {dimensions.weight} <span>kg</span>
                    </td>
                    <td>
                      {convertToPounds(dimensions.weight)} <span>lbs</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Height</td>
                    <td>
                      {dimensions.height} <span>cm</span>
                    </td>
                    <td>
                      {convertToFeet(dimensions.height)} <span>feet</span>{" "}
                      {convertoToInches(dimensions.height)} <span>inches</span>
                    </td>
                  </tr>
                  <tr>
                    <td>BMI</td>
                    <td>
                      {dimensions.bmi} <span>Kg/m2</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </SummaryCard>

        <SummaryCard
          name={t("Details", "Details")}
          styles={{
            width: "100%",
            backgroundColor: "var(--omrs-color-bg-medium-contrast)",
            marginTop: "0.625rem"
          }}
        >
          <div className={`omrs-type-body-regular ${styles.summaryCard}`}>
            <table className={styles.heightAndWeightDetailsTable}>
              <thead>
                <tr>
                  <td>Last updated</td>
                  <td>Last updated by</td>
                  <td>Last updated location</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SummaryCard>
      </div>
    );
  }

  return !isEmpty(dimensions)
    ? displayHeightAndWeight()
    : displayNoHeightAndWeight();
}

type HeightAndWeightRecordProps = {};
