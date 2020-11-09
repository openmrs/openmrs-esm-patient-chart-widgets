import { validators } from "@openmrs/esm-config";

export default {
  bmiUnit: {
    validators: [validators.isString],
    default: "kg / m²"
  },
  heightUnit: {
    validators: [validators.isString],
    default: "cm"
  },
  weightUnit: {
    validators: [validators.isString],
    default: "kg"
  }
};

export type HeightAndWeightConfigObject = {
  bmiUnit: string;
  heightUnit: string;
  weightUnit: string;
};
