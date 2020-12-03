import React from "react";
import { match, Route } from "react-router-dom";
import AllergiesDetailedSummary from "./allergies/allergies-detailed-summary.component";
import ProgramsDetailedSummary from "./programs/programs-detailed-summary.component";
import ProgramRecord from "./programs/program-record.component";
import AllergyForm from "../widgets/allergies/allergy-form.component";
import ConditionsDetailedSummary from "./conditions/conditions-detailed-summary.component";
import AllergyRecord from "./allergies/allergy-record.component";
import ConditionRecord from "./conditions/condition-record.component";

export const levelTwoRoutes: PatientChartRoute[] = [
  {
    url: "/patient/:patientUuid/chart/allergies",
    component: AllergiesDetailedSummary,
    name: "Allergies"
  },
  {
    url: "/patient/:patientUuid/chart/allergies/:allergyUuid",
    component: AllergyRecord,
    name: "Allergies"
  },
  {
    url: "/patient/:patientUuid/chart/allergies/form/:allergyUuid?",
    component: AllergyForm,
    name: "Allergy Form"
  },
  {
    url: "/patient/:patientUuid/chart/conditions",
    component: ConditionsDetailedSummary,
    name: "Conditions"
  },
  {
    url: "/patient/:patientUuid/chart/conditions/:conditionUuid",
    component: ConditionRecord,
    name: "Conditions"
  },
  {
    url: "/patient/:patientUuid/chart/programs",
    component: ProgramsDetailedSummary,
    name: "Programs"
  },
  {
    url: "/patient/:patientUuid/chart/programs/:programUuid",
    component: ProgramRecord,
    name: "Program"
  }
];

export default function LevelTwoRoutes(props: LevelTwoRoutesProps) {
  return (
    <>
      {levelTwoRoutes.map(route => {
        const Component = route.component;
        return (
          <Route exact key={route.url} path={route.url} component={Component} />
        );
      })}
    </>
  );
}

type LevelTwoRoutesProps = {
  match: match;
};

export type PatientChartRoute = {
  name: string;
  url: string;
  component?: any;
};
