import {
  filter,
  find,
  get,
  groupBy,
  isEmpty,
  isUndefined,
  map,
  orderBy
} from "lodash-es";
import dayjs from "dayjs";
import {
  ImmunizationDoseData,
  FHIRImmunizationBundle,
  FHIRImmunizationResource,
  ImmunizationFormData,
  Code,
  ImmunizationData
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
    return isUndefined(code.system) || isEmpty(code.system);
  });
};

export const mapFromFHIRImmunizationBundle = (
  immunizationBundle: FHIRImmunizationBundle
): Array<ImmunizationData> => {
  //TODO use system with blank system
  const groupByImmunization = groupBy(
    immunizationBundle.entry,
    immunizationResourceEntry => {
      return findCodeWithoutSystem(immunizationResourceEntry)?.code;
    }
  );

  return map(
    groupByImmunization,
    (immunizationResources: Array<FHIRImmunizationResource>) => {
      const existingDoses: Array<ImmunizationDoseData> = map(
        immunizationResources,
        mapToImmunizationDose
      );
      const codeWithoutSystem = findCodeWithoutSystem(immunizationResources[0]);

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
            system: "", //No system means OpenMRS
            code: immunizationForData.vaccineUuid,
            display: immunizationForData.vaccineName
          }
        ]
      },
      patient: { id: immunizationForData.patientUuid },
      encounter: { id: visitUuid }, //Reference of visit instead of encounter
      occurrenceDateTime: dayjs(immunizationForData.vaccinationDate).toDate(),
      expirationDate: dayjs(immunizationForData.expirationDate).toDate(),
      location: { id: locationUuid },
      performer: { actor: { id: providerUuid } },
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
