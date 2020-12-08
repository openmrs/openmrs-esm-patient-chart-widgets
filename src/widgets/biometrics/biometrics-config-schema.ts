import { Type } from "@openmrs/esm-config";

export default {
  bmiUnit: {
    _type: Type.String,
    _default: "kg / m²"
  },
  heightUnit: {
    _type: Type.String,
    _default: "cm"
  },
  weightUnit: {
    _type: Type.String,
    _default: "kg"
  }
};

export type BiometricsConfigObject = {
  bmiUnit: string;
  heightUnit: string;
  weightUnit: string;
};
