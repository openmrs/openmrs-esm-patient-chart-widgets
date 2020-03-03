import "./set-public-path";

export { backendDependencies } from "./openmrs-backend-dependencies";
export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

export { default as SummaryCard } from "./ui-components/cards/summary-card-footer.component";
export { default as AllergyiesOverview } from "./widgets/allergies/allergy-overview.component";
