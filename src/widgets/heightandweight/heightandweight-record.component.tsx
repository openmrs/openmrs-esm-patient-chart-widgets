import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import { ConfigObject } from "../../config-schema";
import withConfig from "../../with-config";
import RecordDetails from "../../ui-components/cards/record-details-card.component";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import { openWorkspaceTab } from "../shared-utils";
import VitalsForm from "../vitals/vitals-form.component";
import {
  convertToPounds,
  convertToFeet,
  convertoToInches,
  customDateFormat
} from "./heightandweight-helper";
import { getDimensions } from "./heightandweight.resource";
import styles from "./heightandweight-record.css";

function HeightAndWeightRecord(props: HeightAndWeightRecordProps) {
  const [dimensions, setDimensions] = useState<any>({});
  const [isLoadingPatient, , patientUuid] = useCurrentPatient();
  const match = useRouteMatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoadingPatient && patientUuid && match.params) {
      const sub = getDimensions(
        props.config.concepts.weightUuid,
        props.config.concepts.heightUuid,
        patientUuid
      ).subscribe(dimensions => {
        setDimensions(
          dimensions.find(
            dimension => dimension.id === match.params["heightWeightUuid"]
          )
        );
        createErrorHandler();
      });
      return () => sub && sub.unsubscribe();
    }
  }, [
    match.params,
    patientUuid,
    isLoadingPatient,
    props.config.concepts.weightUuid,
    props.config.concepts.heightUuid
  ]);

  return (
    <>
      {!!(dimensions && Object.entries(dimensions).length) && (
        <div className={styles.dimensionsContainer}>
          <SummaryCard
            name={t("Height & Weight", "Height & Weight")}
            showComponent={() =>
              openWorkspaceTab(VitalsForm, "Edit vitals", {
                vitalUuid: match.params["heightWeightUuid"]
              })
            }
            editComponent={VitalsForm}
            styles={{ width: "100%" }}
          >
            <div className={styles.dimensionsCard}>
              {Object.entries(dimensions).length && (
                <table className={styles.summaryTable}>
                  <tbody>
                    <tr>
                      <td>
                        <Trans i18nKey="measuredAt">Measured at</Trans>
                      </td>
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
                      <td>
                        <Trans i18nKey="weight">Weight</Trans>
                      </td>
                      <td>
                        {dimensions.weight}{" "}
                        <span>
                          <Trans i18nKey="kg">kg</Trans>
                        </span>
                      </td>
                      <td>
                        {convertToPounds(dimensions.weight)} <span>lbs</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Trans i18nKey="height">Height</Trans>
                      </td>
                      <td>
                        {dimensions.height} <span>cm</span>
                      </td>
                      <td>
                        {convertToFeet(dimensions.height)}{" "}
                        <span>
                          <Trans i18nKey="feet">feet</Trans>
                        </span>{" "}
                        {convertoToInches(dimensions.height)}{" "}
                        <span>
                          <Trans i18nKey="inches">inches</Trans>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Trans i18nKey="bmi">BMI</Trans>
                      </td>
                      <td>
                        {dimensions.bmi}{" "}
                        <span>
                          kg/m<sup>2</sup>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </SummaryCard>
          <RecordDetails>
            <table className={styles.heightAndWeightDetailsTable}>
              <thead>
                <tr>
                  <td>
                    <Trans i18nKey="lastUpdated">Last updated</Trans>
                  </td>
                  <td>
                    <Trans i18nKey="lastUpdatedBy">Last updated by</Trans>
                  </td>
                  <td>
                    <Trans i18nKey="lastUpdatedLocation">
                      Last updated location
                    </Trans>
                  </td>
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
          </RecordDetails>
        </div>
      )}
    </>
  );
}

type HeightAndWeightRecordProps = {
  config: ConfigObject;
};

export default withConfig(HeightAndWeightRecord);
