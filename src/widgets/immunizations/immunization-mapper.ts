import { find, get, groupBy, isUndefined, map, orderBy } from "lodash-es";
import dayjs from "dayjs";
import {
  Code,
  FHIRImmunizationBundle,
  FHIRImmunizationResource,
  ImmunizationData,
  ImmunizationDoseData,
  ImmunizationFormData,
  Reference
} from "./immunization-domain";

const mapToImmunizationDose = (
  immunizationResource: FHIRImmunizationResource
): ImmunizationDoseData => {
  const immunizationObsUuid = immunizationResource?.resource?.id;
  const manufacturer = immunizationResource?.resource?.manufacturer?.display;
  const lotNumber = immunizationResource?.resource?.lotNumber;
  const protocolApplied =
    immunizationResource?.resource?.protocolApplied?.length > 0 &&
    immunizationResource?.resource?.protocolApplied[0];
  const sequenceLabel = protocolApplied?.series;
  const sequenceNumber = protocolApplied?.doseNumberPositiveInt;
  const occurrenceDateTime = dayjs(
    immunizationResource?.resource?.occurrenceDateTime
  ).format("YYYY-MM-DD");
  const expirationDate = dayjs(
    immunizationResource?.resource?.expirationDate
  ).format("YYYY-MM-DD");

  return {
    immunizationObsUuid,
    manufacturer,
    lotNumber,
    sequenceLabel,
    sequenceNumber,
    occurrenceDateTime,
    expirationDate
  };
};

const findCodeWithoutSystem = function(
  immunizationResource: FHIRImmunizationResource
) {
  //Code without system represents internal code using uuid
  return find(immunizationResource?.resource?.vaccineCode?.coding, function(
    code: Code
  ) {
    return isUndefined(code.system);
  });
};

export const mapFromFHIRImmunizationBundle = (
  immunizationBundle: FHIRImmunizationBundle
): Array<ImmunizationData> => {
  const groupByImmunization = groupBy(
    immunizationBundle.entry,
    immunizationResourceEntry => {
      return findCodeWithoutSystem(immunizationResourceEntry)?.code;
    }
  );
  return map(
    groupByImmunization,
    (immunizationsForOneVaccine: Array<FHIRImmunizationResource>) => {
      const existingDoses: Array<ImmunizationDoseData> = map(
        immunizationsForOneVaccine,
        mapToImmunizationDose
      );
      const codeWithoutSystem = findCodeWithoutSystem(
        immunizationsForOneVaccine[0]
      );

      return {
        vaccineName: codeWithoutSystem.display,
        vaccineUuid: codeWithoutSystem.code,
        existingDoses: orderBy(
          existingDoses,
          [dose => get(dose, "occurrenceDateTime")],
          ["desc"]
        )
      };
    }
  );
};

function toReferenceOfType(type: string, referenceValue: string): Reference {
  const reference = `${type}/${referenceValue}`;
  return { type, reference };
}

export const mapToFHIRImmunizationResource = (
  immunizationForData: ImmunizationFormData,
  visitUuid,
  locationUuid,
  providerUuid
): FHIRImmunizationResource => {
  return {
    resource: {
      resourceType: "Immunization",
      status: "completed",
      id: immunizationForData.immunizationObsUuid,
      vaccineCode: {
        coding: [
          {
            code: immunizationForData.vaccineUuid,
            display: immunizationForData.vaccineName
          }
        ]
      },
      patient: toReferenceOfType("Patient", immunizationForData.patientUuid),
      encounter: toReferenceOfType("Encounter", visitUuid), //Reference of visit instead of encounter
      occurrenceDateTime: dayjs(immunizationForData.vaccinationDate).toDate(),
      expirationDate: dayjs(immunizationForData.expirationDate).toDate(),
      location: toReferenceOfType("Location", locationUuid),
      performer: [{ actor: toReferenceOfType("Practitioner", providerUuid) }],
      manufacturer: { display: immunizationForData.manufacturer },
      lotNumber: immunizationForData.lotNumber,
      protocolApplied: [
        {
          doseNumberPositiveInt: immunizationForData.currentDose.sequenceNumber,
          series: immunizationForData.currentDose.sequenceLabel
        }
      ]
    }
  };
};
