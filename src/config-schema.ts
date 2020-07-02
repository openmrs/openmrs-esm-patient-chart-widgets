import { validators } from "@openmrs/esm-module-config";
import vitalsConfigSchema, {
  VitalsConfigObject
} from "./widgets/vitals/vitals-config-schema";
import immunizationWidgetSchema, {
  ImmunizationWidgetConfigSchema
} from "./widgets/immunizations/immunization-widget-config-schema";

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
  vitals: vitalsConfigSchema,
  immunizationsConfig: immunizationWidgetSchema.immunizationsConfig
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
  immunizationsConfig: ImmunizationWidgetConfigSchema;
};

export default schema;
