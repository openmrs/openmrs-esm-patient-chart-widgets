import { registerBreadcrumbs } from "@openmrs/esm-api";
import { defineConfigSchema } from "@openmrs/esm-config";
import {
  getAsyncLifecycle,
  getAsyncExtensionLifecycle
} from "@openmrs/esm-react-utils";
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
        id: "vitals-widget",
        slot: "vitals-widget",
        load: getAsyncExtensionLifecycle(
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
        load: getAsyncExtensionLifecycle(
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
        load: getAsyncExtensionLifecycle(
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
        load: getAsyncExtensionLifecycle(
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
        load: getAsyncExtensionLifecycle(
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
        load: getAsyncExtensionLifecycle(
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
        load: getAsyncExtensionLifecycle(
          () =>
            import(
              "./widgets/vitals/vitals-biometrics-form/vitals-biometrics-form.component"
            ),
          { featureName: "vitals-biometric-form", moduleName }
        )
      },
      {
        id: "summary-menu-item",
        slot: "patient-chart-nav-menu",
        load: getAsyncExtensionLifecycle(
          () => import("./menu-items/summary-link"),
          {
            featureName: "summary-menu-item",
            moduleName
          }
        )
      },
      {
        id: "attachments-menu-item",
        slot: "patient-chart-nav-menu",
        load: getAsyncExtensionLifecycle(
          () => import("./menu-items/attachments-link"),
          {
            featureName: "attachments-menu-item",
            moduleName
          }
        )
      },
      {
        id: "results-menu-item",
        slot: "patient-chart-nav-menu",
        load: getAsyncExtensionLifecycle(
          () => import("./menu-items/results-link"),
          {
            featureName: "results-menu-item",
            moduleName
          }
        )
      },
      {
        id: "orders-menu-item",
        slot: "patient-chart-nav-menu",
        load: getAsyncExtensionLifecycle(
          () => import("./menu-items/orders-link"),
          {
            featureName: "orders-menu-item",
            moduleName
          }
        )
      },
      {
        id: "encounters-menu-item",
        slot: "patient-chart-nav-menu",
        load: getAsyncExtensionLifecycle(
          () => import("./menu-items/encounters-link"),
          {
            featureName: "encounters-menu-item",
            moduleName
          }
        )
      },
      {
        id: "conditions-menu-item",
        slot: "patient-chart-nav-menu",
        load: getAsyncExtensionLifecycle(
          () => import("./menu-items/conditions-link"),
          {
            featureName: "conditions-menu-item",
            moduleName
          }
        )
      },
      {
        id: "immunizations-menu-item",
        slot: "patient-chart-nav-menu",
        load: getAsyncExtensionLifecycle(
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
        load: getAsyncExtensionLifecycle(
          () => import("./menu-items/programs-link"),
          {
            featureName: "programs-menu-item",
            moduleName
          }
        )
      },
      {
        id: "allergies-menu-item",
        slot: "patient-chart-nav-menu",
        load: getAsyncExtensionLifecycle(
          () => import("./menu-items/allergies-link"),
          {
            featureName: "allergies-menu-item",
            moduleName
          }
        )
      },
      {
        id: "appointments-menu-item",
        slot: "patient-chart-nav-menu",
        load: getAsyncExtensionLifecycle(
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
        load: getAsyncExtensionLifecycle(
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
        load: getAsyncExtensionLifecycle(
          () => import("./widgets/forms/forms.component"),
          { featureName: "forms", moduleName }
        )
      },
      {
        id: "form-entry",
        slot: "/patient/:patientUuid/formentry",
        load: getAsyncExtensionLifecycle(
          () => import("./widgets/forms/form-entry.component"),
          { featureName: "form-entry", moduleName }
        )
      }
    ]
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };

export * from "./legacy-exports";
