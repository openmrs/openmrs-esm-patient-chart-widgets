import { Type } from "@openmrs/esm-config";

export default {
  bmiUnit: {
    _type: Type.String,
    _default: "kg / m²"
  }
};

export type BiometricsConfigObject = {
  bmiUnit: string;
  heightUnit: string;
  weightUnit: string;
};
