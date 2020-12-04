import { getAsyncLifecycle } from "@openmrs/esm-react-utils";
import { defineConfigSchema } from "@openmrs/esm-config";
import { backendDependencies } from "./openmrs-backend-dependencies";
import configSchema from "./config-schema";

const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

function setupOpenMRS() {
  const moduleName = "@openmrs/esm-patient-chart-widgets";

  defineConfigSchema(moduleName, configSchema);

  return {
    extensions: [
      {
        id: "vitals-widget",
        slot: "vitals-widget",
        load: getAsyncLifecycle(
          () => import("./widgets/vitals/vitals-overview.component"),
          {
            featureName: "vitalsWidget",
            moduleName
          }
        )
      },
      {
        id: "biometric",
        slot: "biometric-widget",
        load: getAsyncLifecycle(
          () => import("./widgets/biometrics/biometric-overview.component"),
          {
            featureName: "biometrics",
            moduleName
          }
        )
      },
      {
        id: "patient-vital-header-ext",
        slot: "patient-vital-header-status-bar",
        load: getAsyncLifecycle(
          () =>
            import(
              "./widgets/vitals/vitals-header/vital-header-state.component"
            ),
          {
            featureName: "vitalHeaderStates",
            moduleName
          }
        )
      },
      {
        id: "patient-banner-ext",
        slot: "patient-banner",
        load: getAsyncLifecycle(
          () => import("./widgets/banner/patient-banner.component"),
          {
            featureName: "patientBanner",
            moduleName
          }
        )
      },
      {
        id: "attachments-overview-widget",
        slot: "attachments-overview-tab",
        load: getAsyncLifecycle(
          () => import("./widgets/attachments/attachments-overview.component"),
          {
            featureName: "attachments",
            moduleName
          }
        )
      },
      {
        id: "immunizations-widget",
        slot: "immunizations-tab",
        load: getAsyncLifecycle(
          () => import("./widgets/immunizations/immunizations.component"),
          {
            featureName: "immunizations",
            moduleName
          }
        )
      },
      {
        id: "appointments",
        slot: "appointments-tab",
        load: getAsyncLifecycle(
          () => import("./widgets/appointments/appointments.component"),
          {
            featureName: "appointments",
            moduleName
          }
        )
      },
      {
        id: "allergies",
        slot: "allergies-tab",
        load: getAsyncLifecycle(
          () => import("./widgets/allergies/allergies.component"),
          {
            featureName: "allergies",
            moduleName
          }
        )
      }
    ]
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };

export { default as SummaryCard } from "./ui-components/cards/summary-card.component";
export { default as SummaryCardRow } from "./ui-components/cards/summary-card-row.component";
export { default as SummaryCardFooter } from "./ui-components/cards/summary-card-footer.component";
export { default as SummaryCardRowContent } from "./ui-components/cards/summary-card-row-content.component";
export { default as HorizontalLabelValue } from "./ui-components/cards/horizontal-label-value.component";
export { default as VerticalLabelValue } from "./ui-components/cards/vertical-label-value.component";

export { Tabs, Panel } from "./ui-components/tabs/tabs.component";

export { default as Breadcrumbs } from "./ui-components/breadcrumbs/breadcrumbs.component";

export { default as AllergiesOverview } from "./widgets/allergies/allergies-overview.component";
export { default as AllergyDetailedSummary } from "./widgets/allergies/allergies-detailed-summary.component";
export { default as AllergyForm } from "./widgets/allergies/allergy-form.component";

export { default as AppointmentsOverview } from "./widgets/appointments/appointments-overview.component";
export { default as AppointmentsDetailedSummary } from "./widgets/appointments/appointments-detailed-summary.component";
export { default as AppointmentsForm } from "./widgets/appointments/appointments-form.component";

export { default as PatientBanner } from "./widgets/banner/patient-banner.component";

export { default as ConditionsOverview } from "./widgets/conditions/conditions-overview.component";
export { default as Conditions } from "./widgets/conditions/conditions.component";

export { default as ImmunizationsOverview } from "./widgets/immunizations/immunizations-overview.component";

export { default as HeightAndWeightOverview } from "./widgets/heightandweight/heightandweight-overview.component";
export { default as HeightAndWeightSummary } from "./widgets/heightandweight/heightweight.component";

export { default as NotesOverview } from "./widgets/notes/notes-overview.component";
export { default as Notes } from "./widgets/notes/notes.component";

export { default as ProgramsOverview } from "./widgets/programs/programs-overview.component";
export { default as ProgramsSummary } from "./widgets/programs/programs.component";

export { default as VitalsOverview } from "./widgets/vitals/vitals-overview.component";
export { default as VitalsSummary } from "./widgets/vitals/vitals.component";
export { default as VitalsForm } from "./widgets/vitals/vitals-form.component";

export { default as VisitButton } from "./widgets/visit/visit-button.component";
export { default as VisitDialog } from "./widgets/visit/visit-dialog.component";

export * from "./widgets/shared-utils";
export * from "./widgets/visit/visit-utils";
export * from "./utils/omrs-dates";
export * from "./utils/use-session-user";
export * from "./types/openmrs-resource";
export * from "./widgets/location/location-select.component";
export * from "./widgets/location/location.resource";
export * from "./widgets/location/use-locations";
export * from "./widgets/visit/start-visit-prompt.component";
