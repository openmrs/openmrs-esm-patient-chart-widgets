import { get, groupBy, map, orderBy } from "lodash-es";

const mapToImmunizationDoses = immunizationResource => {
  const manufacturer = immunizationResource?.resource.manufacturer;
  const lotNumber = immunizationResource?.resource.lotNumber;
  const protocolApplied =
    immunizationResource?.resource?.protocolApplied?.length > 0 &&
    immunizationResource?.resource?.protocolApplied[0]?.protocol;
  const currentDoseLabel = protocolApplied?.series;
  const doseNumber = protocolApplied?.doseNumberPositiveInt;
  const occurrenceDateTime = protocolApplied?.occurrenceDateTime;
  const expirationDate = protocolApplied?.expirationDate;
  return {
    manufacturer: manufacturer,
    lotNumber: lotNumber,
    currentDoseLabel: currentDoseLabel,
    doseNumber: doseNumber,
    occurrenceDateTime: occurrenceDateTime,
    expirationDate: expirationDate
  };
};

export const fromImmunizationSearchResult = immunizationSearchResult => {
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
      doses: orderBy(doses, [dose => get(dose, "doseNumber")])
    };
  });
};

export const toFhirImmunizationResource = immunizationDose => {
  const immunizationResource: any = {};
  immunizationResource.resourceType = "Immunization";
  immunizationResource.id = immunizationDose.immunizationUuid;
  immunizationResource.vaccineCode = {
    coding: [
      { code: "vaccineUUid", display: immunizationDose.immunizationName }
    ]
  };
  immunizationResource.patient = { uuid: immunizationDose.patientUuid };
  immunizationResource.encounter = {
    type: "TypeUUid",
    uuid: immunizationDose.encounterUuid
  };
  immunizationResource.location = { name: "XYZ" };
  immunizationResource.manufacturer = {
    reference: immunizationDose.manufacturer
  };
  immunizationResource.lotNumber = immunizationDose.lotNumber;
  immunizationResource.protocolApplied = [
    {
      protocol: {
        occurrenceDateTime: immunizationDose.vaccinationDate,
        doseNumberPositiveInt: immunizationDose.currentDose.value,
        series: immunizationDose.currentDose.label,
        expirationDate: immunizationDose.expirationDate
      }
    }
  ];
  return { resource: immunizationResource };
};
