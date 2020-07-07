import { get, groupBy, map, orderBy } from "lodash-es";
import dayjs from "dayjs";

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

export const mapToFhirImmunizationResource = (
  immunizationDose,
  visitUuid,
  locationUuid,
  providerUuid
) => {
  const immunizationResource: FHIRImmunizationResource = {
    resourceType: "Immunization",
    status: "Completed",
    id: immunizationDose.immunizationObsUuid,
    vaccineCode: {
      coding: [
        {
          system: "", //No system means OpenMRS
          code: immunizationDose.vaccineUuid,
          display: immunizationDose.vaccineName
        }
      ]
    },
    patient: { id: immunizationDose.patientUuid },
    encounter: { id: visitUuid }, //Reference of visit instead of encounter
    occurrenceDateTime: dayjs(immunizationDose.vaccinationDate).toDate(),
    expirationDate: dayjs(immunizationDose.expirationDate).toDate(),
    location: { id: locationUuid },
    performer: { actor: { id: providerUuid } },
    manufacturer: { display: immunizationDose.manufacturer },
    lotNumber: immunizationDose.lotNumber,
    protocolApplied: [
      {
        doseNumberPositiveInt: immunizationDose.currentDose.sequenceNumber,
        series: immunizationDose.currentDose.sequenceLabel
      }
    ]
  };
  return { resource: immunizationResource };
};

type Code = {
  code: string;
  system: string;
  display: string;
};

type FHIRImmunizationResource = {
  resourceType: "Immunization";
  status: "Completed";
  id: string;
  vaccineCode: { coding: Array<Code> };
  patient: { id: string };
  encounter: { id: string };
  occurrenceDateTime: Date;
  expirationDate: Date;
  location: { id: string };
  performer: { actor: { id: { string } } };
  manufacturer: { display: { string } };
  lotNumber: number;
  protocolApplied: [
    {
      doseNumberPositiveInt: number;
      series: string;
    }
  ];
};
