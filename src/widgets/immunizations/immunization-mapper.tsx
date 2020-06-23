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

export const fromImmunizationSearchResult = function(immunizationSearchResult) {
  //TODO: Change to UUIDs
  const groupByImmunization = groupBy(
    immunizationSearchResult.entry,
    "resource.vaccineCode.text"
  );
  return map(groupByImmunization, (immunizationResources, key) => {
    let doses = map(immunizationResources, mapToImmunizationDoses);
    return {
      vaccineName: immunizationResources[0]?.resource?.vaccineCode?.text,
      //TODO how vaccine uuids are coming
      vaccineUuid: immunizationResources[0]?.resource?.vaccineCode?.text,
      doses: orderBy(doses, [dose => get(dose, "doseNumber")])
    };
  });
};
