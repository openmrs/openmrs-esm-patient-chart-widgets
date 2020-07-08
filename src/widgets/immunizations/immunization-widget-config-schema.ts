import { validators } from "@openmrs/esm-module-config";

export default {
  vaccinesConceptSet: { validators: [validators.isString] },
  sequenceDefinitions: {
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
    sequenceDefinitions: [
      {
        vaccineConceptUuid: "783AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        sequences: [
          {
            sequenceLabel: "Dose-1",
            sequenceNumber: "1"
          },
          {
            sequenceLabel: "Dose-2",
            sequenceNumber: "2"
          },
          {
            sequenceLabel: "Dose-3",
            sequenceNumber: "3"
          },
          {
            sequenceLabel: "Dose-4",
            sequenceNumber: "4"
          },
          {
            sequenceLabel: "Booster-1",
            sequenceNumber: "11"
          },
          {
            sequenceLabel: "Booster-2",
            sequenceNumber: "12"
          }
        ]
      }
    ]
  }
};
