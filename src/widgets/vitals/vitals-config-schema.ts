import { Type } from "@openmrs/esm-config";

export default {
  formUuid: {
    _type: Type.UUID,
    _default: "a000cb34-9ec1-4344-a1c8-f692232f6edd"
  },
  encounterTypeUuid: {
    _type: Type.UUID,
    _default: "67a71486-1a54-468f-ac3e-7091a9a79584"
  },
  bloodPressureUnit: {
    _type: Type.String,
    _default: "mmHg"
  },
  oxygenSaturationUnit: {
    _type: Type.String,
    _default: "SP02"
  },
  pulseUnit: {
    _type: Type.String,
    _default: "bpm"
  },
  respiratoryRateUnit: {
    _type: Type.String,
    _default: "/min"
  },
  temperatureUnit: {
    _type: Type.String,
    _default: "°C"
  }
};

export type VitalsConfigObject = {
  formUuid: string;
  encounterTypeUuid: string;
  bloodPressureUnit: string;
  oxygenSaturationUnit: string;
  pulseUnit: string;
  respiratoryRateUnit: string;
  temperatureUnit: string;
};
