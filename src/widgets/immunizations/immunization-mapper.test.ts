import { mapFromFhirImmunizationSearchResults } from "./immunization-mapper";

let rotavirusDose1 = {
  resource: {
    resourceType: "Immunization",
    id: "b9c21a82-aed3-11ea-b3de-0242ac130001",
    vaccineCode: {
      coding: [
        {
          system: "http://hl7.org/fhir/sid/cvx",
          code: "RotavirusUuid",
          display: "Rotavirus"
        }
      ]
    },
    patient: {
      reference: "Patient/D1A903924D4443A7A388778D77D86155"
    },
    encounter: {
      reference: "Encounter/example",
      id: 1234
    },
    location: {
      reference: "Location/1"
    },
    manufacturer: {
      display: "Organization/hl7"
    },
    lotNumber: "PT123F",
    occurrenceDateTime: "2018-09-21",
    expirationDate: "2025-12-15",
    protocolApplied: [
      {
        series: "4 Months",
        doseNumberPositiveInt: 2
      }
    ]
  }
};
let rotavirusDose2 = {
  resource: {
    resourceType: "Immunization",
    id: "b9c21a82-aed3-11ea-b3de-0242ac130001",
    vaccineCode: {
      coding: [
        {
          system: "http://hl7.org/fhir/sid/cvx",
          code: "RotavirusUuid",
          display: "Rotavirus"
        }
      ]
    },
    patient: {
      reference: "Patient/D1A903924D4443A7A388778D77D86155"
    },
    encounter: {
      reference: "Encounter/example",
      id: 1235
    },
    location: {
      reference: "Location/1"
    },
    manufacturer: {
      display: "Organization/hl7"
    },
    lotNumber: "PT123F",
    occurrenceDateTime: "2018-06-18",
    expirationDate: "2025-12-15",
    protocolApplied: [
      {
        series: "2 Months",
        doseNumberPositiveInt: 1
      }
    ]
  }
};
const immunizationsSearchResponseWithSingleEntry = {
  resourceType: "Bundle",
  id: "b6f39678-aed3-11ea-b3de-0242ac130004",
  type: "searchset",
  total: 1,
  entry: [rotavirusDose2]
};
const immunizationsSearchResponseWithMultipleDoses = {
  resourceType: "Bundle",
  id: "b6f39678-aed3-11ea-b3de-0242ac130004",
  type: "searchset",
  total: 2,
  entry: [rotavirusDose1, rotavirusDose2]
};
const immunizationsSearchResponseWithMultipleImmunizations = {
  resourceType: "Bundle",
  id: "b6f39678-aed3-11ea-b3de-0242ac130004",
  type: "searchset",
  total: 5,
  entry: [
    rotavirusDose1,
    rotavirusDose2,
    {
      resource: {
        resourceType: "Immunization",
        id: "b9c21d5c-aed3-11ea-b3de-0242ac130002",
        status: "completed",
        vaccineCode: {
          coding: [
            {
              system: "http://hl7.org/fhir/sid/cvx",
              code: "uuid2",
              display: "Polio"
            }
          ]
        },
        patient: {
          reference: "Patient/D1A903924D4443A7A388778D77D86155"
        },
        encounter: {
          reference: "Encounter/example",
          id: "encounterUuid"
        },
        location: {
          reference: "Location/1"
        },
        manufacturer: {
          display: "Organization/hl7"
        },
        lotNumber: "PT123F",
        occurrenceDateTime: "2018-05-21",
        expirationDate: "2025-12-15",
        protocolApplied: [
          {
            series: "2 Months",
            doseNumberPositiveInt: 1
          }
        ]
      }
    },
    {
      resource: {
        resourceType: "Immunization",
        id: "b9c21d5c-aed3-11ea-b3de-0242ac130002",
        status: "completed",
        vaccineCode: {
          coding: [
            {
              system: "http://hl7.org/fhir/sid/cvx",
              code: "uuid2",
              display: "Polio"
            }
          ]
        },
        patient: {
          reference: "Patient/D1A903924D4443A7A388778D77D86155"
        },
        encounter: {
          reference: "Encounter/example"
        },
        location: {
          reference: "Location/1"
        },
        manufacturer: {
          display: "Organization/hl7"
        },
        lotNumber: "PT123F",
        occurrenceDateTime: "2018-11-01",
        expirationDate: "2025-12-15",
        protocolApplied: [
          {
            series: "4 Months",
            doseNumberPositiveInt: 2
          }
        ]
      }
    }
  ]
};

describe("ImmunizationMapper", () => {
  it("should map the Immunization FHIR Bundle", function() {
    const immunizations = mapFromFhirImmunizationSearchResults(
      immunizationsSearchResponseWithSingleEntry
    );

    expect(immunizations.length).toBe(1);
    expect(immunizations[0].vaccineName).toBe("Rotavirus");
    expect(immunizations[0].doses.length).toBe(1);
    let expectedDose = {
      sequenceNumber: 1,
      sequenceLabel: "2 Months",
      encounterUuid: 1235,
      immunizationObsUuid: "b9c21a82-aed3-11ea-b3de-0242ac130001",
      expirationDate: "2025-12-15",
      lotNumber: "PT123F",
      manufacturer: { display: "Organization/hl7" },
      occurrenceDateTime: "2018-06-18"
    };
    expect(immunizations[0].doses[0]).toStrictEqual(expectedDose);
  });

  it("should map multiple entries for same immunization as different doses", function() {
    const immunizations = mapFromFhirImmunizationSearchResults(
      immunizationsSearchResponseWithMultipleDoses
    );

    expect(immunizations.length).toBe(1);
    expect(immunizations[0].vaccineName).toBe("Rotavirus");
    expect(immunizations[0].doses.length).toBe(2);
    let expectedDose1 = {
      sequenceNumber: 2,
      sequenceLabel: "4 Months",
      expirationDate: "2025-12-15",
      immunizationObsUuid: "b9c21a82-aed3-11ea-b3de-0242ac130001",
      lotNumber: "PT123F",
      encounterUuid: 1234,
      manufacturer: { display: "Organization/hl7" },
      occurrenceDateTime: "2018-09-21"
    };
    let expectedDose2 = {
      sequenceNumber: 1,
      sequenceLabel: "2 Months",
      expirationDate: "2025-12-15",
      lotNumber: "PT123F",
      encounterUuid: 1235,
      immunizationObsUuid: "b9c21a82-aed3-11ea-b3de-0242ac130001",
      manufacturer: { display: "Organization/hl7" },
      occurrenceDateTime: "2018-06-18"
    };
    expect(immunizations[0].doses[1]).toStrictEqual(expectedDose2);
    expect(immunizations[0].doses[0]).toStrictEqual(expectedDose1);
  });

  it("should map multiple entries for different immunization as different immunization", function() {
    const immunizations = mapFromFhirImmunizationSearchResults(
      immunizationsSearchResponseWithMultipleImmunizations
    );

    expect(immunizations.length).toBe(2);
    expect(immunizations[0].vaccineName).toBe("Rotavirus");
    expect(immunizations[0].doses.length).toBe(2);

    expect(immunizations[1].vaccineName).toBe("Polio");
    expect(immunizations[1].doses.length).toBe(2);
  });
});
