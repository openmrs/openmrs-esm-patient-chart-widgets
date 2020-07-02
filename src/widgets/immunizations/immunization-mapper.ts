import { get, groupBy, map, orderBy } from "lodash-es";
import dayjs from "dayjs";

const mapToImmunizationDoses = immunizationResource => {
  const immunizationObsUuid = immunizationResource?.resource?.id;
  const encounterUuid = immunizationResource?.resource?.encounter?.id;
  const manufacturer = immunizationResource?.resource?.manufacturer;
  const lotNumber = immunizationResource?.resource?.lotNumber;
  const protocolApplied =
    immunizationResource?.resource?.protocolApplied?.length > 0 &&
    immunizationResource?.resource?.protocolApplied[0]?.protocol;
  const sequenceLabel = protocolApplied?.series;
  const sequenceNumber = protocolApplied?.doseNumberPositiveInt;
  const occurrenceDateTime = protocolApplied?.occurrenceDateTime;
  const expirationDate = protocolApplied?.expirationDate;
  return {
    encounterUuid: encounterUuid,
    immunizationObsUuid: immunizationObsUuid,
    manufacturer: manufacturer,
    lotNumber: lotNumber,
    sequenceLabel: sequenceLabel,
    sequenceNumber: sequenceNumber,
    occurrenceDateTime: occurrenceDateTime,
    expirationDate: expirationDate
  };
};

export const mapFromFhirImmunizationSearchResults = immunizationSearchResult => {
  //TODO: Change to UUIDs
  const groupByImmunization = groupBy(
    immunizationSearchResult.entry,
    "resource.vaccineCode.coding[0].display"
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

export const mapToFhirImmunizationResource = immunizationDose => {
  const immunizationResource: FHIRImmunizationResource = {
    resourceType: "Immunization",
    status: "Completed",
    id: immunizationDose.immunizationObsUuid,
    vaccineCode: {
      coding: [
        {
          system: "", //TODO: What is the proper system
          code: immunizationDose.vaccineUuid,
          display: immunizationDose.vaccineName
        }
      ]
    },
    patient: { id: immunizationDose.patientUuid },
    encounter: { id: immunizationDose.encounterUuid }, //TODO replace by visit uuid
    occurrenceDateTime: dayjs(immunizationDose.vaccinationDate).toDate(),
    recorded: new Date(),
    location: { id: "XYZ" }, //TODO replace by locations
    manufacturer: { reference: immunizationDose.manufacturer },
    lotNumber: immunizationDose.lotNumber,
    protocolApplied: [
      {
        protocol: {
          occurrenceDateTime: dayjs(immunizationDose.vaccinationDate).toDate(),
          doseNumberPositiveInt: immunizationDose.currentDose.sequenceNumber,
          series: immunizationDose.currentDose.sequenceLabel,
          expirationDate: dayjs(immunizationDose.expirationDate).toDate()
        }
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
  vaccineCode: { coding: [Code] };
  patient: { id: string };
  encounter: { id: string };
  occurrenceDateTime: Date;
  recorded: Date;
  location: { id: string };
  manufacturer: { reference: { string } };
  lotNumber: { reference: { string } };
  protocolApplied: [
    {
      protocol: {
        occurrenceDateTime: Date;
        doseNumberPositiveInt: number;
        series: string;
        expirationDate: Date;
      };
    }
  ];
};
