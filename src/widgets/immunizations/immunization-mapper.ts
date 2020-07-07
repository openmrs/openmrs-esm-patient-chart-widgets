import { get, groupBy, map, orderBy } from "lodash-es";
import dayjs from "dayjs";
import {
  FHIRImmunizationResource,
  ImmunizationFormData
} from "./immunization-domain";

const mapToImmunizationDoses = immunizationResource => {
  const immunizationObsUuid = immunizationResource?.resource?.id;
  const encounterUuid = immunizationResource?.resource?.encounter?.id;
  const manufacturer = immunizationResource?.resource?.manufacturer;
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
    encounterUuid,
    immunizationObsUuid,
    manufacturer,
    lotNumber,
    sequenceLabel,
    sequenceNumber,
    occurrenceDateTime,
    expirationDate
  };
};

export const mapFromFhirImmunizationSearchResults = immunizationSearchResult => {
  const groupByImmunization = groupBy(
    immunizationSearchResult.entry,
    "resource.vaccineCode.coding[0].code"
  );
  return map(groupByImmunization, (immunizationResources, key) => {
    let doses = map(immunizationResources, mapToImmunizationDoses);
    return {
      vaccineName:
        immunizationResources[0]?.resource?.vaccineCode?.coding[0].display,
      vaccineUuid:
        immunizationResources[0]?.resource?.vaccineCode?.coding[0].code,
      doses: orderBy(doses, [dose => get(dose, "occurrenceDateTime")], ["desc"])
    };
  });
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
      status: "Completed",
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
