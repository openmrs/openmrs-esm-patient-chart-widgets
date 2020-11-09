import { validators } from "@openmrs/esm-config";
import vitalsConfigSchema, {
  VitalsConfigObject
} from "./widgets/vitals/vitals-config-schema";
import heightAndWeightConfigSchema, {
  HeightAndWeightConfigObject
} from "./widgets/heightandweight/heightandweight-config-schema";
import immunizationWidgetSchema from "./widgets/immunizations/immunization-widget-config-schema";
import { ImmunizationWidgetConfigObject } from "./widgets/immunizations/immunization-domain";

const schema = {
  concepts: {
    systolicBloodPressureUuid: {
      validators: [validators.isUuid],
      default: "5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    },
    diastolicBloodPressureUuid: {
      validators: [validators.isUuid],
      default: "5086AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    },
    pulseUuid: {
      validators: [validators.isUuid],
      default: "5087AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    },
    temperatureUuid: {
      validators: [validators.isUuid],
      default: "5088AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    },
    oxygenSaturationUuid: {
      validators: [validators.isUuid],
      default: "5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    },
    heightUuid: {
      validators: [validators.isUuid],
      default: "5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    },
    weightUuid: {
      validators: [validators.isUuid],
      default: "5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    }
  },
  heightAndWeightConfig: heightAndWeightConfigSchema,
  immunizationsConfig: immunizationWidgetSchema,
  vitals: vitalsConfigSchema
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
  immunizationsConfig: ImmunizationWidgetConfigObject;
  heightAndWeightConfig: HeightAndWeightConfigObject;
  vitals: VitalsConfigObject;
};

export default schema;
