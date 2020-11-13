import { validators, Type } from "@openmrs/esm-config";
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
      _default: "5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    },
    weightUuid: {
      _type: Type.ConceptUuid,
      _default: "5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    }
  },
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
  };
  vitals: VitalsConfigObject;
  immunizationsConfig: ImmunizationWidgetConfigObject;
};

export default schema;
