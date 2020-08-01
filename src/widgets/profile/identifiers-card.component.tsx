import React from "react";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import SummaryCardRow from "../../ui-components/cards/summary-card-row.component";
import SummaryCardRowContent from "../../ui-components/cards/summary-card-row-content.component";
import VerticalLabelValue from "../../ui-components/cards/vertical-label-value.component";
import { useTranslation } from "react-i18next";

export default function IdentifiersCard(props: IdentifiersCardProps) {
  const { t } = useTranslation();

  const valueStyles = {
    color: "var(--omrs-color-ink-high-contrast)",
    fontWeight: 500
  };

  return (
    <SummaryCard name={t("Identifiers", "Identifiers")}>
      {props.patient &&
        props.patient.identifier.sort(preferredIdFirst).map(id => (
          <SummaryCardRow key={id.system}>
            <SummaryCardRowContent justifyContent="space-between">
              <VerticalLabelValue
                label={id.system}
                value={id.value}
                valueStyles={valueStyles}
              ></VerticalLabelValue>
              {isPreferred(id) && (
                <span
                  style={{ color: "var(--omrs-color-ink-medium-contrast)" }}
                  className="omrs-type-body-regular"
                >
                  {t("Preferred ID", "Preferred ID")}
                </span>
              )}
            </SummaryCardRowContent>
          </SummaryCardRow>
        ))}
    </SummaryCard>
  );

  function isPreferred(identifier) {
    return identifier.use === "usual";
  }

  function preferredIdFirst(identifier1, identifier2) {
    if (isPreferred(identifier1)) {
      return -1;
    } else if (isPreferred(identifier2)) {
      return 1;
    } else {
      return 0;
    }
  }
}

type IdentifiersCardProps = {
  patient: fhir.Patient;
};
