import { openmrsFetch } from "@openmrs/esm-api";
import { of } from "rxjs";

export function performPatientImmunizationsSearch(
  patientIdentifier: string,
  patientUuid: string,
  abortController: AbortController
) {
  return openmrsFetch(
    `/ws/rest/v1/${patientUuid}/fhir/immunization/search?patient=${patientUuid}`,
    { signal: abortController.signal }
  ).then(response => response.data);
}

export function getImmunizationByUuid(immunizationUuid: string) {
  return of(
    mockPatientImmunizationsSearchResponse.entry.find(
      res => res.resource.id === immunizationUuid
    )
  );
}

export function savePatientImmunization(
  patientImmunization,
  patientUuid,
  immunizationObsUuid,
  abortController
) {
  let immunizationEndpoint = `/ws/rest/v1/${patientUuid}/fhir/immunization`;
  if (immunizationObsUuid) {
    immunizationEndpoint = `${immunizationEndpoint}/${immunizationObsUuid}`;
  }
  return openmrsFetch(immunizationEndpoint, {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: patientImmunization,
    signal: abortController.signal
  });
}
// TODO: to be removed post integration
const mockPatientImmunizationSearchResponse = {
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

const mockPatientImmunizationsSearchResponse = {
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
