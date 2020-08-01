import React from "react";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import SummaryCardRow from "../../ui-components/cards/summary-card-row.component";
import VerticalLabelValue from "../../ui-components/cards/vertical-label-value.component";
import SummaryCardRowContent from "../../ui-components/cards/summary-card-row-content.component";
import dayjs from "dayjs";
import { age } from "./age-helpers";
import { useTranslation } from "react-i18next";

export default function DemographicsCard(props: DemographicsCardProps) {
  const { t } = useTranslation();
  return (
    <SummaryCard
      name={t("Demographics", "Demographics")}
      styles={props.cardStyles}
    >
      <SummaryCardRow>
        <SummaryCardRowContent>
          <VerticalLabelValue
            label={t("Family", "Family")}
            value={props.patient && props.patient.name[0].family + ","}
            valueStyles={{
              textTransform: "uppercase"
            }}
            className="omrs-type-title-1"
          />
          <VerticalLabelValue
            label={t("Given", "Given")}
            value={props.patient && props.patient.name[0].given.join(" ")}
            className="omrs-type-title-1"
            valueStyles={{ whiteSpace: "nowrap" }}
          />
        </SummaryCardRowContent>
      </SummaryCardRow>
      <SummaryCardRow>
        <SummaryCardRowContent justifyContent="space-between">
          <VerticalLabelValue
            label={t("Birth Date", "Birth Date")}
            value={
              props.patient &&
              dayjs(props.patient.birthDate).format("DD-MMM-YYYY")
            }
          />
          <VerticalLabelValue
            label={t("Age", "Age")}
            value={props.patient && age(props.patient.birthDate)}
          />
          <VerticalLabelValue
            label={t("Gender", "Gender")}
            value={props.patient && props.patient.gender}
            valueStyles={{ textTransform: "capitalize" }}
          />
        </SummaryCardRowContent>
      </SummaryCardRow>
    </SummaryCard>
  );
}

type DemographicsCardProps = {
  patient: fhir.Patient;
  cardStyles?: React.CSSProperties;
};
