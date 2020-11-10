import React, { useState, useEffect } from "react";
import { capitalize } from "lodash-es";
import { useTranslation } from "react-i18next";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import { openWorkspaceTab } from "../shared-utils";
import useChartBasePath from "../../utils/use-chart-base";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import {
  performPatientAllergySearch,
  Allergy
} from "./allergy-intolerance.resource";
import AllergyForm from "./allergy-form.component";
import WidgetDataTable from "../../ui-components/datatable/datatable.component";
import { DataTableSkeleton } from "carbon-components-react";

export default function AllergiesOverview(props: AllergiesOverviewProps) {
  const initialAllergiesCount = 5;
  const { t } = useTranslation();
  const chartBasePath = useChartBasePath();
  const [, patient] = useCurrentPatient();
  const [patientAllergies, setPatientAllergies] = useState<Allergy[]>(null);
  const allergiesPath = chartBasePath + "/" + props.basePath;
  const title = `${t("allergies", "Allergies")}`;

  const headers = [
    {
      key: "display",
      header: `${t("name", "Name")}`
    },
    {
      key: "reactions",
      header: `${t("reactions", "Reactions")}`
    }
  ];

  useEffect(() => {
    if (patient) {
      const sub = performPatientAllergySearch(
        patient.identifier[0].value
      ).subscribe(allergies => {
        setPatientAllergies(allergies.slice(0, initialAllergiesCount));
      }, createErrorHandler());

      return () => sub.unsubscribe();
    }
  }, [patient]);

  const getRowItems = rows =>
    rows.map(row => ({
      ...row,
      display: row.display,
      reactions: `${row.reactionManifestations?.join(", ") || ""} ${
        row.reactionSeverity ? `(${capitalize(row.reactionSeverity)})` : ""
      }`
    }));

  const RenderAllergies = () => {
    if (patientAllergies.length) {
      const rows = getRowItems(patientAllergies);
      return (
        <WidgetDataTable
          title={title}
          headers={headers}
          rows={rows}
          linkTo={allergiesPath}
          showComponent={() =>
            openWorkspaceTab(
              AllergyForm,
              `${t("allergiesForm", "Allergies Form")}`
            )
          }
          addComponent={AllergyForm}
        />
      );
    }
    return (
      <EmptyState
        showComponent={() =>
          openWorkspaceTab(
            AllergyForm,
            `${t("allergiesForm", "Allergies Form")}`
          )
        }
        addComponent={AllergyForm}
        name={t("allergies", "Allergies")}
        displayText={t("allergyIntolerances", "allergy intolerances")}
      />
    );
  };

  return <>{patientAllergies ? <RenderAllergies /> : <DataTableSkeleton />}</>;
}

type AllergiesOverviewProps = { basePath: string };
