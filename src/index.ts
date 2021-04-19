import {
  registerBreadcrumbs,
  defineConfigSchema,
  getAsyncLifecycle
} from "@openmrs/esm-framework";
import { backendDependencies } from "./openmrs-backend-dependencies";
import { configSchema } from "./config-schema";

const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

function setupOpenMRS() {
  const moduleName = "@openmrs/esm-patient-chart-widgets";
  const parent = `${window.spaBase}/patient/:patient/chart`;

  defineConfigSchema(moduleName, configSchema);

  registerBreadcrumbs([
    {
      path: `${parent}/encounters`,
      title: "Encounters",
      parent
    },
    {
      path: `${parent}/summary`,
      title: "Summary",
      parent
    },
    {
      path: `${parent}/attachments`,
      title: "Attachments",
      parent
    },
    {
      path: `${parent}/results`,
      title: "Results",
      parent
    },
    {
      path: `${parent}/conditions`,
      title: "Conditions",
      parent
    },
    {
      path: `${parent}/immunizations`,
      title: "Immunizations",
      parent
    },
    {
      path: `${parent}/programs`,
      title: "Programs",
      parent
    },
    {
      path: `${parent}/allergies`,
      title: "Allergies",
      parent
    },
    {
      path: `${parent}/appointments`,
      title: "Appointments",
      parent
    }
  ]);

  return {
    pages: [
      {
        load: getAsyncLifecycle(
          () =>
            import(
              "./widgets/vitals/vitals-biometrics-form/vitals-biometrics-form.component"
            ),
          { featureName: "vitals-biometric-form", moduleName }
        ),
        route: /^patient\/.+\/vitalsbiometrics\/form/
      }
    ],
    extensions: [
      {
        id: "test-results-timeline-workspace",
        slot: "/patient/:patientUuid/testresults/timeline/:panelUuid",
        load: getAsyncLifecycle(
          () => import("./widgets/test-results/timeline/timeline.component"),
          {
            featureName: "test-results-timeline",
            moduleName: "@openmrs/esm-test-results"
          }
        )
      },
      {
        id: "test-results-overview-workspace",
        slot: "/patient/:patientUuid/testresults/overview",
        load: getAsyncLifecycle(
          () => import("./widgets/test-results/desktopView"),
          {
            featureName: "test-results-overview",
            moduleName: "@openmrs/esm-test-results"
          }
        )
      },
      {
        id: "test-results-widget",
        slot: "patient-chart-dashboard-medications",
        load: getAsyncLifecycle(
          () =>
            import("./widgets/test-results/overview/recent-overview.component"),
          {
            featureName: "testResultsWidget",
            moduleName
          }
        )
      },
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
        id: "biometrics-widgets",
        slot: "biometrics-widget",
        load: getAsyncLifecycle(
          () => import("./widgets/biometrics/biometrics-overview.component"),
          {
            featureName: "biometrics",
            moduleName
          }
        )
      },
      {
        id: "patient-vital-status-ext",
        slot: "patient-vital-status",
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
        id: "patient-chart-header-ext",
        slot: "patient-chart-header",
        load: getAsyncLifecycle(
          () => import("./widgets/banner/patient-banner.component"),
          {
            featureName: "patientBanner",
            moduleName
          }
        )
      },
      {
        id: "visit-notes-form-ext",
        slot: "/patient/:patientUuid/visitnotes/form",
        load: getAsyncLifecycle(
          () => import("./widgets/notes/visit-notes-form.component"),
          {
            featureName: "visit-notes-form",
            moduleName
          }
        )
      },
      {
        id: "vitals-biometric-form-widget",
        slot: "/patient/:patientUuid/vitalsbiometrics/form",
        load: getAsyncLifecycle(
          () =>
            import(
              "./widgets/vitals/vitals-biometrics-form/vitals-biometrics-form.component"
            ),
          { featureName: "vitals-biometric-form", moduleName }
        )
      },
      {
        id: "vitals-biometric-form-widget",
        slot: "vitals-biometric-form-widget-ext",
        load: getAsyncLifecycle(
          () =>
            import(
              "./widgets/vitals/vitals-biometrics-form/vitals-biometrics-form.component"
            ),
          { featureName: "vitals-biometric-form", moduleName }
        )
      },
      {
        id: "programs-overview-widget",
        slot: "programs-overview-widget-ext",
        load: getAsyncLifecycle(
          () => import("./widgets/programs/programs-overview.component"),
          { featureName: "programs-overview", moduleName }
        )
      },
      {
        id: "programs-summary-widget",
        slot: "programs-summary-widget-ext",
        load: getAsyncLifecycle(
          () => import("./widgets/programs/programs.component"),
          { featureName: "programs-summary", moduleName }
        )
      },
      {
        id: "conditions-widget",
        slot: "conditions-widget-ext",
        load: getAsyncLifecycle(
          () => import("./widgets/conditions/conditions.component"),
          { featureName: "conditions", moduleName }
        )
      },
      {
        id: "conditions-overview-widget",
        slot: "conditions-overview-widget-ext",
        load: getAsyncLifecycle(
          () => import("./widgets/conditions/conditions-overview.component"),
          { featureName: "conditions-overview", moduleName }
        )
      },
      {
        id: "immunizations-widget",
        slot: "immunizations-widget-ext",
        load: getAsyncLifecycle(
          () => import("./widgets/immunizations/immunizations.component"),
          { featureName: "immunizations", moduleName }
        )
      },
      {
        id: "immunizations-overview-widget",
        slot: "immunizations-overview-widget-ext",
        load: getAsyncLifecycle(
          () =>
            import("./widgets/immunizations/immunizations-overview.component"),
          { featureName: "immunizations-overview", moduleName }
        )
      },
      {
        id: "allergies-overview-widget",
        slot: "allergies-overview-widget-ext",
        load: getAsyncLifecycle(
          () => import("./widgets/allergies/allergies-overview.component"),
          { featureName: "allergies-overview", moduleName }
        )
      },
      {
        id: "allergies-summary-widget",
        slot: "allergies-summary-widget-ext",
        load: getAsyncLifecycle(
          () => import("./widgets/allergies/allergies.component"),
          { featureName: "allergies-summary", moduleName }
        )
      },
      {
        id: "notes-overview-widget",
        slot: "notes-overview-widget-ext",
        load: getAsyncLifecycle(
          () => import("./widgets/notes/notes-overview.component"),
          { featureName: "notes-overview", moduleName }
        )
      },
      {
        id: "notes-widget",
        slot: "notes-widget-ext",
        load: getAsyncLifecycle(
          () => import("./widgets/notes/notes.component"),
          { featureName: "notes", moduleName }
        )
      },
      {
        id: "appointments-overview-widget",
        slot: "appointments-overview-widget-ext",
        load: getAsyncLifecycle(
          () =>
            import("./widgets/appointments/appointments-overview.component"),
          { featureName: "appointments-overview", moduleName }
        )
      },
      {
        id: "appointments-summary-widget",
        slot: "appointments-summary-widget-ext",
        load: getAsyncLifecycle(
          () => import("./widgets/appointments/appointments.component"),
          { featureName: "appointments-summary", moduleName }
        )
      },
      {
        id: "attachments-overview-widget",
        slot: "attachments-overview-widget-ext",
        load: getAsyncLifecycle(
          () => import("./widgets/attachments/attachments-overview.component"),
          {
            featureName: "attachments-overview",
            moduleName
          }
        )
      },
      {
        id: "summary-menu-item",
        slot: "patient-chart-nav-menu",
        load: getAsyncLifecycle(() => import("./menu-items/summary-link"), {
          featureName: "summary-menu-item",
          moduleName
        })
      },
      {
        id: "attachments-menu-item",
        slot: "patient-chart-nav-menu",
        load: getAsyncLifecycle(() => import("./menu-items/attachments-link"), {
          featureName: "attachments-menu-item",
          moduleName
        })
      },
      {
        id: "results-menu-item",
        slot: "patient-chart-nav-menu",
        load: getAsyncLifecycle(() => import("./menu-items/results-link"), {
          featureName: "results-menu-item",
          moduleName
        })
      },
      {
        id: "orders-menu-item",
        slot: "patient-chart-nav-menu",
        load: getAsyncLifecycle(() => import("./menu-items/orders-link"), {
          featureName: "orders-menu-item",
          moduleName
        })
      },
      {
        id: "encounters-menu-item",
        slot: "patient-chart-nav-menu",
        load: getAsyncLifecycle(() => import("./menu-items/encounters-link"), {
          featureName: "encounters-menu-item",
          moduleName
        })
      },
      {
        id: "conditions-menu-item",
        slot: "patient-chart-nav-menu",
        load: getAsyncLifecycle(() => import("./menu-items/conditions-link"), {
          featureName: "conditions-menu-item",
          moduleName
        })
      },
      {
        id: "immunizations-menu-item",
        slot: "patient-chart-nav-menu",
        load: getAsyncLifecycle(
          () => import("./menu-items/immunizations-link"),
          {
            featureName: "immunizations-menu-item",
            moduleName
          }
        )
      },
      {
        id: "programs-menu-item",
        slot: "patient-chart-nav-menu",
        load: getAsyncLifecycle(() => import("./menu-items/programs-link"), {
          featureName: "programs-menu-item",
          moduleName
        })
      },
      {
        id: "allergies-menu-item",
        slot: "patient-chart-nav-menu",
        load: getAsyncLifecycle(() => import("./menu-items/allergies-link"), {
          featureName: "allergies-menu-item",
          moduleName
        })
      },
      {
        id: "appointments-menu-item",
        slot: "patient-chart-nav-menu",
        load: getAsyncLifecycle(
          () => import("./menu-items/appointments-link"),
          {
            featureName: "appointments-menu-item",
            moduleName
          }
        )
      },
      {
        id: "capture-photo",
        slot: "capture-patient-photo",
        load: getAsyncLifecycle(
          () => import("./widgets/attachments/capture-photo.component"),
          {
            featureName: "capture-photo-widget",
            moduleName
          }
        )
      },
      {
        id: "forms",
        slot: "forms",
        load: getAsyncLifecycle(
          () => import("./widgets/forms/forms.component"),
          { featureName: "forms", moduleName }
        )
      },
      {
        id: "form-entry",
        slot: "/patient/:patientUuid/formentry",
        load: getAsyncLifecycle(
          () => import("./widgets/forms/form-entry.component"),
          { featureName: "form-entry", moduleName }
        )
      },
      {
        id: "add-past-visit-button",
        slot: "patient-actions-slot",
        load: getAsyncLifecycle(
          () =>
            import(
              "./ui-components/custom-overflow-menu/custom-items/add-past-visit"
            ),
          {
            featureName: "add-past-visit-button",
            moduleName
          }
        )
      },
      {
        id: "start-visit-button",
        slot: "patient-actions-slot",
        load: getAsyncLifecycle(
          () =>
            import(
              "./ui-components/custom-overflow-menu/custom-items/start-visit"
            ),
          {
            featureName: "start-visit-button",
            moduleName
          }
        )
      }
    ]
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };
