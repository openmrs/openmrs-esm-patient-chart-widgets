import "./set-public-path";
import React from "react";
import ReactDOM from "react-dom";
import Root from "./root.component";

export { backendDependencies } from "./openmrs-backend-dependencies";
export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

export { default as AllergyOverview } from "../src/widgets/allergies/allergy-overview.component";
