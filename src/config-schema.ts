import { Type } from "@openmrs/esm-config";
import biometricsConfigSchema, {
  BiometricsConfigObject
} from "./widgets/biometrics/biometrics-config-schema";
import vitalsConfigSchema, {
  VitalsConfigObject
} from "./widgets/vitals/vitals-config-schema";
import immunizationWidgetSchema from "./widgets/immunizations/immunization-widget-config-schema";
import { ImmunizationWidgetConfigObject } from "./widgets/immunizations/immunization-domain";

const schema = {
  concepts: {
    systolicBloodPressureUuid: {
      _type: Type.ConceptUuid,
      _default: "5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    },
    diastolicBloodPressureUuid: {
      _type: Type.ConceptUuid,
      _default: "5086AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    },
    heartRateUuid: {
      _type: Type.ConceptUuid,
      _default: "5087AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    },
    temperatureUuid: {
      _type: Type.ConceptUuid,
      _default: "5088AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    },
    spo2Uuid: {
      _type: Type.ConceptUuid,
      _default: "5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    },
    heightUuid: {
      _type: Type.ConceptUuid,
      _default: "5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    },
    weightUuid: {
      _type: Type.ConceptUuid,
      _default: "5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    },
    respiratoryRateUuid: {
      _type: Type.ConceptUuid,
      _default: "5242AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    },
    generalPatientNoteUuid: {
      _type: Type.ConceptUuid,
      _default: "165095AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    },
    midUpperArmCircumference: {
      _type: Type.ConceptUuid,
      _default: "1343AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    }
  },
  biometrics: biometricsConfigSchema,
  vitals: vitalsConfigSchema,
  immunizationsConfig: immunizationWidgetSchema
};

export type ConfigObject = {
  concepts: {
    systolicBloodPressureUuid: string;
    diastolicBloodPressureUuid: string;
    heartRateUuid: string;
    temperatureUuid: string;
    spo2Uuid: string;
    heightUuid: string;
    weightUuid: string;
    respiratoryRateUuid: string;
    generalPatientNoteUuid: string;
    midUpperArmCircumference: string;
  };
  biometrics: BiometricsConfigObject;
  vitals: VitalsConfigObject;
  immunizationsConfig: ImmunizationWidgetConfigObject;
};

export default schema;
