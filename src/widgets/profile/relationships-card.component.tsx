import React from "react";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { fetchPatientRelationships } from "./relationships.resource";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import SummaryCardRow from "../../ui-components/cards/summary-card-row.component";
import SummaryCardRowContent from "../../ui-components/cards/summary-card-row-content.component";
import VerticalLabelValue from "../../ui-components/cards/vertical-label-value.component";
import { useTranslation } from "react-i18next";

export default function RelationshipsCard(props: RelationshipsCardProps) {
  const { t } = useTranslation();
  const [relationships, setRelationships] = React.useState(null);
  React.useEffect(() => {
    fetchPatientRelationships(props.patient.id)
      .then(({ data }) => {
        if (data.results) {
          setRelationships(data.results);
        }
      })
      .catch(createErrorHandler());
  }, [props.patient.id]);

  return (
    <SummaryCard name={t("relationships", "Relationships")}>
      {relationships && relationships.length ? (
        relationships.map((relation: any) => (
          <SummaryCardRow key={relation.uuid}>
            <SummaryCardRowContent>
              <VerticalLabelValue label={""} value={relation.display} />
            </SummaryCardRowContent>
          </SummaryCardRow>
        ))
      ) : (
        <SummaryCardRow>
          <SummaryCardRowContent>{"\u2014"}</SummaryCardRowContent>
        </SummaryCardRow>
      )}
    </SummaryCard>
  );
}

function getRelationships(relations) {
  return relations.map(relation => relation.resource);
}

function getRelativeName(name) {
  return `${name[0].given.join(" ")} ${name[0].family}`;
}
type RelationshipsCardProps = {
  patient: fhir.Patient;
};
