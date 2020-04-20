import React, { FunctionComponent } from "react";
import { match, Route } from "react-router";
import AllergiesDetailedSummary from "./allergies/allergies-detailed-summary.component";
import HeightAndWeightSummary from "../widgets/heightandweight/heightandweight-summary.component";
import VitalsDetailedSummary from "../widgets/vitals/vitals-detailed-summary.component";
import ProgramsDetailedSummary from "./programs/programs-detailed-summary.component";
import ProgramRecord from "./programs/program-record.component";
import AllergyForm from "../widgets/allergies/allergy-form.component";
import VitalsForm from "../widgets/vitals/vitals-form.component";
import ConditionsDetailedSummary from "./conditions/conditions-detailed-summary.component";
import MedicationsDetailedSummary from "./medications/medications-detailed-summary.component";
import MedicationRecord from "./medications/medication-record.component";
import AllergyRecord from "./allergies/allergy-record.component";
import ConditionRecord from "./conditions/condition-record.component";
import MedicationOrderBasket from "./medications/medication-order-basket.component";
import MedicationOrder from "./medications/medication-order.component";
import HeightAndWeightRecord from "./heightandweight/heightandweight-record.component";

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
    url: "/patient/:patientUuid/chart/dimensions",
    component: HeightAndWeightSummary,
    name: "Dimensions"
  },
  {
    url: "/patient/:patientUuid/chart/dimensions/details/:uuid?",
    component: HeightAndWeightRecord,
    name: "Detailed Dimensions"
  },
  {
    url: "/patient/:patientUuid/chart/vitals",
    component: VitalsDetailedSummary,
    name: "Vitals"
  },
  {
    url: "/patient/:patientUuid/chart/vitals/form/:vitalsUuid?",
    component: VitalsForm,
    name: "Vitals Form"
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
  },
  {
    url: "/patient/:patientUuid/chart/medications",
    component: MedicationsDetailedSummary,
    name: "Medications"
  },
  {
    url: "/patient/:patientUuid/chart/medications/:medicationUuid",
    component: MedicationRecord,
    name: "medication"
  },
  {
    url:
      "/patient/:patientUuid/chart/medications/order/:orderUuid?/:drugUuid?/:action?",
    component: MedicationOrderBasket,
    name: "Order Medications"
  },
  {
    url: "/patient/:patientUuid/chart/medications/orderTest",
    component: MedicationOrder,
    name: "Order Medications"
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
