import "./set-public-path";
import React from "react";
import ReactDOM from "react-dom";

export { backendDependencies } from "./openmrs-backend-dependencies";
export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);
