export const patient: fhir.Patient = {
  resourceType: "Patient",
  id: "8673ee4f-e2ab-4077-ba55-4980f408773e",
  extension: [
    {
      url:
        "http://fhir-es.transcendinsights.com/stu3/StructureDefinition/resource-date-created",
      valueDateTime: "2017-01-18T09:42:40+00:00"
    },
    {
      url:
        "https://purl.org/elab/fhir/StructureDefinition/Creator-crew-version1",
      valueString: "daemon"
    }
  ],
  identifier: [
    {
      id: "1f0ad7a1-430f-4397-b571-59ea654a52db",
      use: "usual",
      system: "OpenMRS ID",
      value: "10010W"
    }
  ],
  active: true,
  name: [
    {
      id: "efdb246f-4142-4c12-a27a-9be60b9592e9",
      use: "usual",
      family: "Wilson",
      given: ["John"]
    }
  ],
  gender: "male",
  birthDate: "1972-04-04",
  deceasedBoolean: false,
  address: [
    {
      id: "0c244eae-85c8-4cc9-b168-96b51f864e77",
      use: "home",
      line: ["Address10351"],
      city: "City0351",
      state: "State0351tested",
      postalCode: "60351",
      country: "Country0351"
    }
  ]
};

export const mockImmunizationConfig = {
  immunizations: [
    {
      vaccineName: "Rotavirus",
      uuid: "uuid1",
      isSeries: true,
      series: [
        { label: "2 Months", value: 1 },
        { label: "4 Months", value: 2 },
        { label: "6 Months", value: 3 }
      ]
    },
    {
      vaccineName: "Adenovirus",
      uuid: "uuid2",
      isSeries: true,
      series: [
        { label: "Dose-1", value: 1 },
        { label: "Dose-2", value: 2 },
        { label: "Dose-3", value: 3 },
        { label: "Booster-1", value: 4 }
      ]
    },
    {
      vaccineName: "Polio",
      uuid: "uuid3",
      isSeries: true,
      series: [
        { label: "2 Months", value: 1 },
        { label: "4 Months", value: 2 },
        { label: "6 Months", value: 3 }
      ]
    },
    {
      vaccineName: "Influenza",
      uuid: "uuid4",
      isSeries: false
    }
  ]
};

export const mockPatientImmunization = {
  resource: {
    resourceType: "Immunization",
    id: "protocol",
    uuid: "b9c21a82-aed3-11ea-b3de-0242ac130004",
    vaccineCode: {
      coding: [
        {
          system: "http://hl7.org/fhir/sid/cvx",
          code: "104"
        }
      ],
      text: "Rotavirus"
    },
    patient: {
      reference: "Patient/D1A903924D4443A7A388778D77D86155"
    },
    encounter: {
      reference: "Encounter/example"
    },
    occurrenceDateTime: "2018-06-18",
    location: {
      reference: "Location/1"
    },
    manufacturer: {
      reference: "Organization/hl7"
    },
    lotNumber: "PT123F",
    expirationDate: "2018-12-15",
    protocolApplied: [
      {
        series: "2 Months",
        occurrenceDateTime: "2018-06-18",
        doseNumberPositiveInt: 1
      },
      {
        series: "4 Months",
        occurrenceDateTime: "2018-09-21",
        doseNumberPositiveInt: 2
      }
    ]
  }
};

export const mockPatientImmunizationsSearchResponse = {
  resourceType: "Bundle",
  id: "b6f39678-aed3-11ea-b3de-0242ac130004",
  type: "searchset",
  total: 5,
  entry: [
    {
      resource: {
        resourceType: "Immunization",
        uuid: "b9c21a82-aed3-11ea-b3de-0242ac130001",
        id: "protocol",
        vaccineCode: {
          coding: [
            {
              system: "http://hl7.org/fhir/sid/cvx",
              code: "104"
            }
          ],
          text: "Rotavirus"
        },
        patient: {
          reference: "Patient/D1A903924D4443A7A388778D77D86155"
        },
        encounter: {
          reference: "Encounter/example"
        },
        occurrenceDateTime: "2018-06-18",
        location: {
          reference: "Location/1"
        },
        manufacturer: {
          reference: "Organization/hl7"
        },
        lotNumber: "PT123F",
        expirationDate: "2025-12-15",
        isSeries: true,
        protocolApplied: [
          {
            protocol: {
              series: "4 Months",
              occurrenceDateTime: "2018-09-21",
              doseNumberPositiveInt: 2,
              expirationDate: "2025-12-15"
            }
          }
        ]
      }
    },
    {
      resource: {
        resourceType: "Immunization",
        uuid: "b9c21a82-aed3-11ea-b3de-0242ac130001",
        id: "protocol",
        vaccineCode: {
          coding: [
            {
              system: "http://hl7.org/fhir/sid/cvx",
              code: "104"
            }
          ],
          text: "Rotavirus"
        },
        patient: {
          reference: "Patient/D1A903924D4443A7A388778D77D86155"
        },
        encounter: {
          reference: "Encounter/example"
        },
        occurrenceDateTime: "2018-06-18",
        location: {
          reference: "Location/1"
        },
        manufacturer: {
          reference: "Organization/hl7"
        },
        lotNumber: "PT123F",
        expirationDate: "2025-12-15",
        isSeries: true,
        protocolApplied: [
          {
            protocol: {
              series: "2 Months",
              occurrenceDateTime: "2018-06-18",
              doseNumberPositiveInt: 1,
              expirationDate: "2025-12-15"
            }
          }
        ]
      }
    },
    {
      resource: {
        resourceType: "Immunization",
        id: "protocol",
        uuid: "b9c21d5c-aed3-11ea-b3de-0242ac130002",
        status: "completed",
        vaccineCode: {
          coding: [
            {
              system: "http://hl7.org/fhir/sid/cvx",
              code: "121"
            }
          ],
          text: "Polio"
        },
        patient: {
          reference: "Patient/D1A903924D4443A7A388778D77D86155"
        },
        encounter: {
          reference: "Encounter/example"
        },
        occurrenceDateTime: "2018-06-18",
        location: {
          reference: "Location/1"
        },
        manufacturer: {
          reference: "Organization/hl7"
        },
        lotNumber: "PT123F",
        expirationDate: "2025-12-15",
        isSeries: true,
        protocolApplied: [
          {
            protocol: {
              series: "2 Months",
              occurrenceDateTime: "2018-05-21",
              doseNumberPositiveInt: 1,
              expirationDate: "2025-12-15"
            }
          }
        ]
      }
    },
    {
      resource: {
        resourceType: "Immunization",
        id: "protocol",
        uuid: "b9c21d5c-aed3-11ea-b3de-0242ac130002",
        status: "completed",
        vaccineCode: {
          coding: [
            {
              system: "http://hl7.org/fhir/sid/cvx",
              code: "121"
            }
          ],
          text: "Polio"
        },
        patient: {
          reference: "Patient/D1A903924D4443A7A388778D77D86155"
        },
        encounter: {
          reference: "Encounter/example"
        },
        occurrenceDateTime: "2018-06-18",
        location: {
          reference: "Location/1"
        },
        manufacturer: {
          reference: "Organization/hl7"
        },
        lotNumber: "PT123F",
        expirationDate: "2025-12-15",
        isSeries: true,
        protocolApplied: [
          {
            protocol: {
              series: "4 Months",
              occurrenceDateTime: "2018-11-01",
              doseNumberPositiveInt: 2,
              expirationDate: "2025-12-15"
            }
          }
        ]
      }
    },
    {
      resource: {
        resourceType: "Immunization",
        id: "historical",
        uuid: "b9c21e6a-aed3-11ea-b3de-0242ac130003",
        status: "completed",
        vaccineCode: {
          coding: [
            {
              system: "http://hl7.org/fhir/sid/cvx",
              code: "105"
            }
          ],
          text: "Influenza"
        },
        patient: {
          reference: "Patient/D1A903924D4443A7A388778D77D86155"
        },
        encounter: {
          reference: "Encounter/example"
        },
        occurrenceDateTime: "2018-06-18",
        location: {
          reference: "Location/1"
        },
        manufacturer: {
          reference: "Organization/hl7"
        },
        lotNumber: "PT123F",
        expirationDate: "2025-12-15",
        isSeries: false,
        protocolApplied: [
          {
            protocol: {
              occurrenceDateTime: "2018-05-21",
              doseNumberPositiveInt: 1,
              expirationDate: "2025-12-15"
            }
          }
        ]
      }
    },
    {
      resource: {
        resourceType: "Immunization",
        id: "historical",
        uuid: "b9c21e6a-aed3-11ea-b3de-0242ac130003",
        status: "completed",
        vaccineCode: {
          coding: [
            {
              system: "http://hl7.org/fhir/sid/cvx",
              code: "105"
            }
          ],
          text: "Influenza"
        },
        patient: {
          reference: "Patient/D1A903924D4443A7A388778D77D86155"
        },
        encounter: {
          reference: "Encounter/example"
        },
        occurrenceDateTime: "2018-06-18",
        location: {
          reference: "Location/1"
        },
        manufacturer: {
          reference: "Organization/hl7"
        },
        lotNumber: "PT123F",
        expirationDate: "2025-12-15",
        isSeries: false,
        protocolApplied: [
          {
            protocol: {
              occurrenceDateTime: "2018-05-21",
              doseNumberPositiveInt: 1,
              expirationDate: "2025-12-15"
            }
          }
        ]
      }
    }
  ]
};
