import { validators } from "@openmrs/esm-module-config";

export default {
  immunizationsConfig: {
    vaccinesConceptSet: { validators: [validators.isString] },
    sequencesDefinition: {
      arrayElements: {
        vaccineConceptUuid: { validators: [validators.isString] },
        sequences: {
          arrayElements: {
            sequenceLabel: { validators: [validators.isString] },
            sequenceNumber: { validators: [validators.isString] }
          }
        }
      }
    },
    default: {
      vaccinesConceptSet: "CIEL:984",
      sequencesDefinition: [
        {
          vaccineConceptUuid: "783AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          sequences: [
            {
              sequenceLabel: "label.dose_1",
              sequenceNumber: "1"
            },
            {
              sequenceLabel: "label.dose_2",
              sequenceNumber: "2"
            },
            {
              sequenceLabel: "label.dose_3",
              sequenceNumber: "3"
            },
            {
              sequenceLabel: "label.dose_4",
              sequenceNumber: "4"
            },
            {
              sequenceLabel: "label.booster_1",
              sequenceNumber: "11"
            },
            {
              sequenceLabel: "label.booster_2",
              sequenceNumber: "12"
            }
          ]
        }
      ]
    }
  }
};

type ImmunizationSequenceDefinition = {
  vaccineConceptUuid: string;
  sequences: Array<object>;
};

export type ImmunizationWidgetConfigSchema = {
  vaccinesConceptSet: string;
  sequencesDefinition: Array<ImmunizationSequenceDefinition>;
};
