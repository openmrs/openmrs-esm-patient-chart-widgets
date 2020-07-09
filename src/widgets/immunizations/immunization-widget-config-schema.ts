import { validators } from "@openmrs/esm-module-config";

export default {
  vaccinesConceptSet: {
    validators: [validators.isString],
    description:
      "This needs to be a uuid or concept mapping which will have all the possible vaccines as set-members."
  },
  sequenceDefinitions: {
    description:
      "Doses/Schedules definitions for each vaccine configured if applicable. If not provided the vaccine would be treated as a vaccine without schedules",
    arrayElements: {
      vaccineConceptUuid: {
        validators: [validators.isUuid],
        description: "The UUID of the individual vaccine concept"
      },
      sequences: {
        arrayElements: {
          sequenceLabel: {
            validators: [validators.isString],
            description:
              "Name of the dose/booster/schedule.. This will be used as a translation key as well."
          },
          sequenceNumber: {
            validators: [validators.isNumber],
            description:
              "The dose number in the vaccines. Convention for doses is [1...9] and for boosters is [11...19]"
          }
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
            sequenceNumber: 1
          },
          {
            sequenceLabel: "Dose-2",
            sequenceNumber: 2
          },
          {
            sequenceLabel: "Dose-3",
            sequenceNumber: 3
          },
          {
            sequenceLabel: "Dose-4",
            sequenceNumber: 4
          },
          {
            sequenceLabel: "Booster-1",
            sequenceNumber: 11
          },
          {
            sequenceLabel: "Booster-2",
            sequenceNumber: 12
          }
        ]
      }
    ]
  }
};
