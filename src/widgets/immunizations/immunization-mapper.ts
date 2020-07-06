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
  const occurrenceDateTime = dayjs(protocolApplied?.occurrenceDateTime).format(
    "YYYY-MM-DD"
  );
  const expirationDate = dayjs(protocolApplied?.expirationDate).format(
    "YYYY-MM-DD"
  );
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
          system: "", //TODO: What is the proper system
          code: immunizationDose.vaccineUuid,
          display: immunizationDose.vaccineName
        }
      ]
    },
    patient: { id: immunizationDose.patientUuid },
    encounter: { id: visitUuid }, //Reference of visit instead of encounter
    occurrenceDateTime: dayjs(immunizationDose.vaccinationDate).toDate(),
    location: { id: locationUuid },
    performer: { actor: { id: providerUuid } },
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
  location: { id: string };
  performer: { actor: { id: { string } } };
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
