export const mockPatientEncounters = {
  data: {
    resourceType: "Bundle",
    id: "857a8f14-5a4a-48a6-8427-a73b4756e6fa",
    status: null,
    meta: {
      lastUpdated: "2019-11-07T12:04:14.742"
    },
    type: "searchset",
    total: 1,
    link: [
      {
        relation: "self",
        url:
          "http://localhost:8080/openmrs/ws/fhir2/Encounter?_id=638591-9586-4b2b-a511-17bc1b79d1ba"
      }
    ],
    entry: [
      {
        fullUrl:
          "http://localhost:8080/openmrs/ws/fhir2/Encounter/638591-9586-4b2b-a511-17bc1b79d1ba",
        resource: {
          resourceType: "Encounter",
          id: "638591-9586-4b2b-a511-17bc1b79d1ba",
          extension: [
            {
              url:
                "http://fhir-es.transcendinsights.com/stu3/StructureDefinition/resource-date-created",
              valueDateTime: "2017-01-18T08:59:07"
            },
            {
              url:
                "https://purl.org/elab/fhir/StructureDefinition/Creator-crew-version1",
              valueString: "daemon8"
            },
            {
              url: "dateChanged",
              valueDateTime: "2017-01-18T08:59:08"
            },
            {
              url: "changedBy",
              valueString: "daemon9"
            },
            {
              url: "formUuid",
              valueString: "a000cb34-9ec1-4344-a1c8-f692232f6edd"
            }
          ],
          status: "finished",
          type: [
            {
              coding: [
                {
                  display: "Vitals",
                  userSelected: false
                }
              ]
            }
          ],
          subject: {
            id: "1e7e9782-2e97-44a0-ab2e-9d04498d4ca6",
            reference: "Patient/1e7e9782-2e97-44a0-ab2e-9d04498d4ca6",
            display: "Paul Walker(Identifier:10000X)"
          },
          period: {
            start: "2015-04-17T06:16:07",
            end: "2015-04-17T06:16:07"
          },
          location: [
            {
              location: {
                reference: "Location/58c57d25-8d39-41ab-8422-108a0c277d98",
                display: "Outpatient Clinic"
              },
              period: {
                start: "2015-04-17T06:16:07",
                end: "2019-11-09T06:16:07"
              }
            }
          ],
          partOf: {
            reference: "Encounter/e1d45e08-4a2a-4bb1-accb-2181c3e25455",
            display: "Facility Visit"
          }
        }
      },
      {
        fullUrl:
          "http://localhost:8080/openmrs/ws/fhir2/Encounter/11238591-9586-4b2b-a511-17bc1b79d1ba",
        resource: {
          resourceType: "Encounter",
          id: "11238591-9586-4b2b-a511-17bc1b79d1ba",
          extension: [
            {
              url:
                "http://fhir-es.transcendinsights.com/stu3/StructureDefinition/resource-date-created",
              valueDateTime: "2017-01-18T08:59:07"
            },
            {
              url:
                "https://purl.org/elab/fhir/StructureDefinition/Creator-crew-version1",
              valueString: "daemon10"
            },
            {
              url: "dateChanged",
              valueDateTime: "2017-01-18T08:59:08"
            },
            {
              url: "changedBy",
              valueString: "daemon12"
            },
            {
              url: "formUuid",
              valueString: "a000cb34-9ec1-4344-a1c8-f692232f6edd"
            }
          ],
          status: "finished",
          type: [
            {
              coding: [
                {
                  display: "Vitals",
                  userSelected: false
                }
              ]
            }
          ],
          subject: {
            id: "1e7e9782-2e97-44a0-ab2e-9d04498d4ca6",
            reference: "Patient/1e7e9782-2e97-44a0-ab2e-9d04498d4ca6",
            display: "Paul Walker(Identifier:10000X)"
          },
          period: {
            start: "2015-04-17T06:16:07",
            end: "2015-04-17T06:16:07"
          },
          location: [
            {
              location: {
                reference: "Location/58c57d25-8d39-41ab-8422-108a0c277d98",
                display: "Inpatient Clinic"
              },
              period: {
                start: "2015-04-17T06:16:07",
                end: "2019-04-17T06:16:07"
              }
            }
          ],
          partOf: {
            reference: "Encounter/e1d45e08-4a2a-4bb1-accb-2181c3e25455",
            display: "Facility Visit"
          }
        }
      },
      {
        fullUrl:
          "http://localhost:8080/openmrs/ws/fhir2/Encounter/24638591-9586-4b2b-a511-17bc1b79d1ba",
        resource: {
          resourceType: "Encounter",
          id: "24638591-9586-4b2b-a511-17bc1b79d1ba",
          participant: [
            {
              individual: {
                reference: "Practitioner/bf218490-1691-11df-97a5-7038c432aabf",
                display: "Super User(Identifier:admin)"
              }
            }
          ],
          status: "finished",
          type: [
            {
              coding: [
                {
                  display: "Vitals",
                  userSelected: false
                }
              ]
            }
          ],
          subject: {
            id: "1e7e9782-2e97-44a0-ab2e-9d04498d4ca6",
            reference: "Patient/1e7e9782-2e97-44a0-ab2e-9d04498d4ca6",
            display: "Paul Walker(Identifier:10000X)"
          },
          period: {
            start: "2015-04-17T06:16:07",
            end: "2015-04-17T06:16:07"
          },
          location: [
            {
              location: {
                reference: "Location/58c57d25-8d39-41ab-8422-108a0c277d98",
                display: "Turbo County Hospital"
              },
              period: {
                start: "2015-04-17T06:16:07",
                end: "2015-04-17T06:16:07"
              }
            }
          ],
          partOf: {
            reference: "Encounter/e1d45e08-4a2a-4bb1-accb-2181c3e25455",
            display: "Facility Visit"
          }
        }
      }
    ]
  }
};

export const mockPatientEncountersRESTAPI = [
  {
    id: "f01e7ac0-014b-461b-a545-3dbdde84cc36",
    encounterDate: "2020-09-22T11:05:27",
    encounterType: "Visit Note",
    encounterLocation: "Amani Hospital",
    encounterAuthor: "Dr. G. Kigen"
  },
  {
    id: "11c8acf9-707d-4d44-9abe-f5266dc11f73",
    encounterDate: "2020-01-13T07:35:00",
    encounterType: "Vitals",
    encounterLocation: "Inpatient Ward",
    encounterAuthor: "Super User"
  },
  {
    id: "f375edbc-a862-48ef-af4a-2bc6d5fc67cf",
    encounterDate: "2020-01-13T00:14:00",
    encounterType: "Vitals",
    encounterLocation: "Inpatient Ward",
    encounterAuthor: "Super User"
  },
  {
    id: "687bb022-140c-4988-a4ab-f93c95290c1e",
    encounterDate: "2020-01-11T16:24:43",
    encounterType: "Vitals",
    encounterLocation: "Inpatient Ward",
    encounterAuthor: "Super User"
  },
  {
    id: "1977dcb5-74fc-4d0b-8ee2-6d4fd6c0677f",
    encounterDate: "2020-01-11T16:24:43",
    encounterType: "Vitals",
    encounterLocation: "Inpatient Ward",
    encounterAuthor: "Super User"
  },
  {
    id: "aafecc7f-3c72-4803-8af3-a7f93bb546f9",
    encounterDate: "2020-01-10T13:07:55",
    encounterType: "Vitals",
    encounterLocation: "Inpatient Ward",
    encounterAuthor: "Super User"
  },
  {
    id: "4e936341-5137-4d9d-bdca-1f8eebf1fa7a",
    encounterDate: "2019-06-19T07:44:31",
    encounterType: "Attachment Upload",
    encounterLocation: "Amani Hospital",
    encounterAuthor: "User Seven"
  },
  {
    id: "5a2f4641-2e70-4802-b708-13e3d24ae79c",
    encounterDate: "2019-06-19T05:49:53",
    encounterType: "Visit Note",
    encounterLocation: "Inpatient Ward",
    encounterAuthor: "Super User"
  },
  {
    id: "95ac6571-a5de-45aa-9612-5ba7de287019",
    encounterDate: "2019-01-13T12:13:00",
    encounterType: "Vitals",
    encounterLocation: "Inpatient Ward",
    encounterAuthor: "Super User"
  },
  {
    id: "88ff09ca-efba-4f3c-a642-e3aa16e61719",
    encounterDate: "2016-05-16T08:15:36",
    encounterType: "Attachment Upload",
    encounterLocation: "Unknown Location",
    encounterAuthor: "Super User"
  },
  {
    id: "cea8c664-5a88-4eb8-bb85-d12ac330b716",
    encounterDate: "2016-05-16T07:45:36",
    encounterType: "Visit Note",
    encounterLocation: "Unknown Location"
  },
  {
    id: "c8876e57-f788-47a1-b8fd-30dbbb497941",
    encounterDate: "2016-05-16T06:05:00",
    encounterType: "Vitals",
    encounterLocation: "Inpatient Ward",
    encounterAuthor: "Super User"
  },
  {
    id: "3960550c-d25c-441f-ae87-debeff8924e3",
    encounterDate: "2015-08-25T08:02:35",
    encounterType: "Visit Note",
    encounterLocation: "Unknown Location"
  }
];

export const mockEncounterResponse = {
  uuid: "7e98713a-1572-4b44-92c1-c504bd6c5ce2",
  display: "Visit Note 28/01/2015",
  encounterDatetime: "2015-01-28T08:00:33.000+0000",
  patient: {
    uuid: "8673ee4f-e2ab-4077-ba55-4980f408773e",
    display: "100GEJ - John Wilson"
  },
  location: {
    uuid: "8d6c993e-c2cc-11de-8d13-0010c6dffd0f",
    display: "Unknown Location"
  },
  form: {
    uuid: "c75f120a-04ec-11e3-8780-2b40bef9a44b",
    display: "Visit Note"
  },
  encounterType: {
    uuid: "d7151f82-c1f3-4152-a605-2f9ea7414a79",
    display: "Visit Note"
  },
  obs: [
    {
      uuid: "4d06417e-61ad-41a5-a9fc-638a1ccd4b86",
      display:
        "Visit Diagnoses: Presumed diagnosis, Primary, Vitamin A Deficiency with Keratomalacia"
    },
    {
      uuid: "78765452-58a8-4f0a-91ff-831647a2e9dc",
      display:
        "Visit Diagnoses: Other disease of hard tissue of teeth, Secondary, Confirmed diagnosis"
    },
    {
      uuid: "06c212a3-61f5-401d-8afd-2917c662c0ea",
      display:
        "Text of encounter note: Duis aute irure dolor in reprehenderit in voluptat"
    }
  ],
  orders: [],
  voided: false,
  visit: {
    uuid: "a3e2a749-15e9-4c67-afa7-aab9a0bdd832",
    display: "Facility Visit @ Unknown Location - 28/01/2015 06:04"
  },
  encounterProviders: [],
  resourceVersion: "1.9"
};

export const mockAlternativeEncounterResponse = {
  uuid: "3b9ab69d-4479-49f3-bf73-2bf23ada3edf",
  display: "Vitals 28/01/2015",
  encounterDatetime: "2015-01-28T06:06:33.000+0000",
  patient: {
    uuid: "8673ee4f-e2ab-4077-ba55-4980f408773e",
    display: "100GEJ - John Wilson"
  },
  location: {
    uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
    display: "Inpatient Ward"
  },
  form: {
    uuid: "a000cb34-9ec1-4344-a1c8-f692232f6edd",
    display: "Vitals"
  },
  encounterType: {
    uuid: "67a71486-1a54-468f-ac3e-7091a9a79584",
    display: "Vitals"
  },
  obs: [
    {
      uuid: "662b2614-4de0-48cb-a829-c2a5f743e4c6",
      display: "Weight (kg): 65.0"
    },
    {
      uuid: "5580d10c-82f6-4b3a-bd95-66d372007774",
      display: "Height (cm): 180.0"
    },
    {
      uuid: "92f19d94-155b-4aa0-be96-d39149b7bb30",
      display: "Systolic blood pressure: 120.0"
    },
    {
      uuid: "310e36b6-8bd2-4f11-9af5-def1c31a8264",
      display: "Pulse: 60.0"
    },
    {
      uuid: "ad4677b2-9d0d-44aa-825b-808973ecc071",
      display: "Blood oxygen saturation: 92.0"
    },
    {
      uuid: "30250613-5cf2-416b-a0fd-f24dcbbb7962",
      display: "Temperature (C): 37.0"
    },
    {
      uuid: "31b38aec-4765-4e97-bded-78e21b854973",
      display: "Diastolic blood pressure: 80.0"
    }
  ],
  orders: [],
  voided: false,
  visit: null,
  encounterProviders: [
    {
      uuid: "1ef282c4-c716-4aec-9c35-ba4c4e0441d5",
      display: "Super User: Clinician"
    }
  ],
  resourceVersion: "1.9"
};
