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
    pulseUuid: {
      _type: Type.ConceptUuid,
      _default: "5087AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    },
    temperatureUuid: {
      _type: Type.ConceptUuid,
      _default: "5088AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    },
    oxygenSaturationUuid: {
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
    respiratoryRate: {
      _type: Type.ConceptUuid,
      _default: "5242AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
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
    pulseUuid: string;
    temperatureUuid: string;
    oxygenSaturationUuid: string;
    heightUuid: string;
    weightUuid: string;
    respiratoryRate: string;
  };
  biometrics: BiometricsConfigObject;
  vitals: VitalsConfigObject;
  immunizationsConfig: ImmunizationWidgetConfigObject;
};

export default schema;
