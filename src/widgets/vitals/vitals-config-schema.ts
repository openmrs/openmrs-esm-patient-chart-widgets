import { validators } from "@openmrs/esm-config";

export default {
  formUuid: {
    validators: [validators.isUuid],
    default: "a000cb34-9ec1-4344-a1c8-f692232f6edd"
  },
  encounterTypeUuid: {
    validators: [validators.isUuid],
    default: "67a71486-1a54-468f-ac3e-7091a9a79584"
  },
  bloodPressureUnit: {
    validators: [validators.isString],
    default: "mmHg"
  },
  oxygenSaturationUnit: {
    validators: [validators.isString],
    default: "%"
  },
  pulseUnit: {
    validators: [validators.isString],
    default: "bpm"
  },
  temperatureUnit: {
    validators: [validators.isString],
    default: "°C"
  }
};

export type VitalsConfigObject = {
  formUuid: string;
  encounterTypeUuid: string;
  bloodPressureUnit: string;
  oxygenSaturationUnit: string;
  pulseUnit: string;
  temperatureUnit: string;
};
