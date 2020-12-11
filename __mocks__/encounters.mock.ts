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

export const mockPatientEncountersRESTAPI = {
  results: [
    {
      uuid: "7e2a4abb-4caa-44ad-b3cf-39cd9c59afd8",
      display: "Vitals 19/02/2020",
      encounterDatetime: "2020-02-19T08:26:05.000+0000",
      location: {
        uuid: "2131aff8-2e2a-480a-b7ab-4ac53250262b",
        display: "Isolation Ward",
        name: "Isolation Ward"
      },
      encounterType: {
        name: "Vitals",
        uuid: "67a71486-1a54-468f-ac3e-7091a9a79584"
      },
      auditInfo: {
        creator: {
          uuid: "bff0f63d-d192-46c7-9bbd-932affa29b80",
          display: "user-dev",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/bff0f63d-d192-46c7-9bbd-932affa29b80"
            }
          ]
        },
        dateCreated: "2020-02-19T08:26:05.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: [
        {
          provider: {
            person: {
              display: "JJ Dick"
            }
          }
        }
      ]
    },
    {
      uuid: "dafb923a-fabf-4045-aac8-90754962c65c",
      display: "Vitals 18/03/2020",
      encounterDatetime: "2020-03-18T10:16:00.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Vitals",
        uuid: "67a71486-1a54-468f-ac3e-7091a9a79584"
      },
      auditInfo: {
        creator: {
          uuid: "bff0f63d-d192-46c7-9bbd-932affa29b80",
          display: "user-dev",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/bff0f63d-d192-46c7-9bbd-932affa29b80"
            }
          ]
        },
        dateCreated: "2020-03-18T10:16:21.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: []
    },
    {
      uuid: "c4dc1026-0b57-4b6d-a7ad-c9243dbb286e",
      display: "Vitals 18/03/2020",
      encounterDatetime: "2020-03-18T10:16:00.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Vitals",
        uuid: "67a71486-1a54-468f-ac3e-7091a9a79584"
      },
      auditInfo: {
        creator: {
          uuid: "bff0f63d-d192-46c7-9bbd-932affa29b80",
          display: "user-dev",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/bff0f63d-d192-46c7-9bbd-932affa29b80"
            }
          ]
        },
        dateCreated: "2020-03-18T10:17:04.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: []
    },
    {
      uuid: "3254bc6e-ace5-4734-b9be-3bf02a2a5d00",
      display: "Attachment Upload 22/03/2020",
      encounterDatetime: "2020-03-22T18:51:36.000+0000",
      location: {
        uuid: "aff27d58-a15c-49a6-9beb-d30dcfc0c66e",
        display: "Amani Hospital",
        name: "Amani Hospital"
      },
      encounterType: {
        name: "Attachment Upload",
        uuid: "5021b1a1-e7f6-44b4-ba02-da2f2bcf8718"
      },
      auditInfo: {
        creator: {
          uuid: "45ce6c2e-dd5a-11e6-9d9c-0242ac150002",
          display: "admin",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/45ce6c2e-dd5a-11e6-9d9c-0242ac150002"
            }
          ]
        },
        dateCreated: "2020-03-22T18:51:36.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: [
        {
          provider: {
            person: {
              display: "Super User"
            }
          }
        }
      ]
    },
    {
      uuid: "58ccc40e-b583-433f-b502-431167bbf298",
      display: "Vitals 23/03/2020",
      encounterDatetime: "2020-03-23T18:56:00.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Vitals",
        uuid: "67a71486-1a54-468f-ac3e-7091a9a79584"
      },
      auditInfo: {
        creator: {
          uuid: "bff0f63d-d192-46c7-9bbd-932affa29b80",
          display: "user-dev",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/bff0f63d-d192-46c7-9bbd-932affa29b80"
            }
          ]
        },
        dateCreated: "2020-03-23T18:57:02.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: []
    },
    {
      uuid: "3f0c2596-292d-4d3e-8f3a-3a2bab24e276",
      display: "Vitals 24/03/2020",
      encounterDatetime: "2020-03-24T13:58:00.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Vitals",
        uuid: "67a71486-1a54-468f-ac3e-7091a9a79584"
      },
      auditInfo: {
        creator: {
          uuid: "bff0f63d-d192-46c7-9bbd-932affa29b80",
          display: "user-dev",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/bff0f63d-d192-46c7-9bbd-932affa29b80"
            }
          ]
        },
        dateCreated: "2020-03-24T13:58:15.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: []
    },
    {
      uuid: "c8405802-6949-44a6-9646-448e29f315a7",
      display: "Vitals 24/03/2020",
      encounterDatetime: "2020-03-24T14:21:00.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Vitals",
        uuid: "67a71486-1a54-468f-ac3e-7091a9a79584"
      },
      auditInfo: {
        creator: {
          uuid: "bff0f63d-d192-46c7-9bbd-932affa29b80",
          display: "user-dev",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/bff0f63d-d192-46c7-9bbd-932affa29b80"
            }
          ]
        },
        dateCreated: "2020-03-24T14:21:53.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: []
    },
    {
      uuid: "0600c325-89da-412e-9b10-82d5cc40c27e",
      display: "Vitals 24/03/2020",
      encounterDatetime: "2020-03-24T14:23:00.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Vitals",
        uuid: "67a71486-1a54-468f-ac3e-7091a9a79584"
      },
      auditInfo: {
        creator: {
          uuid: "bff0f63d-d192-46c7-9bbd-932affa29b80",
          display: "user-dev",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/bff0f63d-d192-46c7-9bbd-932affa29b80"
            }
          ]
        },
        dateCreated: "2020-03-24T14:23:39.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: []
    },
    {
      uuid: "2c33780e-6c64-414a-85db-94ee8f41d6cf",
      display: "Vitals 24/03/2020",
      encounterDatetime: "2020-03-24T14:26:00.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Vitals",
        uuid: "67a71486-1a54-468f-ac3e-7091a9a79584"
      },
      auditInfo: {
        creator: {
          uuid: "bff0f63d-d192-46c7-9bbd-932affa29b80",
          display: "user-dev",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/bff0f63d-d192-46c7-9bbd-932affa29b80"
            }
          ]
        },
        dateCreated: "2020-03-24T14:26:53.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: []
    },
    {
      uuid: "e9cb2687-8310-4fb1-96ef-f988dec7fc55",
      display: "Vitals 24/03/2020",
      encounterDatetime: "2020-03-24T14:28:00.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Vitals",
        uuid: "67a71486-1a54-468f-ac3e-7091a9a79584"
      },
      auditInfo: {
        creator: {
          uuid: "bff0f63d-d192-46c7-9bbd-932affa29b80",
          display: "user-dev",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/bff0f63d-d192-46c7-9bbd-932affa29b80"
            }
          ]
        },
        dateCreated: "2020-03-24T14:28:41.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: []
    },
    {
      uuid: "fddb1b8e-6815-4f08-82fa-da450b9d839d",
      display: "Vitals 24/03/2020",
      encounterDatetime: "2020-03-24T14:46:00.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Vitals",
        uuid: "67a71486-1a54-468f-ac3e-7091a9a79584"
      },
      auditInfo: {
        creator: {
          uuid: "bff0f63d-d192-46c7-9bbd-932affa29b80",
          display: "user-dev",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/bff0f63d-d192-46c7-9bbd-932affa29b80"
            }
          ]
        },
        dateCreated: "2020-03-24T14:46:51.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: [
        {
          provider: {
            person: {
              display: "Super User"
            }
          }
        }
      ]
    },
    {
      uuid: "eda9b106-4e19-416e-88f4-24b798bdd5b0",
      display: "Visit Note 30/03/2020",
      encounterDatetime: "2020-03-30T00:00:00.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Visit Note",
        uuid: "d7151f82-c1f3-4152-a605-2f9ea7414a79"
      },
      auditInfo: {
        creator: {
          uuid: "bff0f63d-d192-46c7-9bbd-932affa29b80",
          display: "user-dev",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/bff0f63d-d192-46c7-9bbd-932affa29b80"
            }
          ]
        },
        dateCreated: "2020-03-31T06:21:00.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: [
        {
          provider: {
            person: {
              display: "JJ Dick"
            }
          }
        }
      ]
    },
    {
      uuid: "49827ca6-5d59-485e-acc9-ac5546360827",
      display: "Vitals 30/03/2020",
      encounterDatetime: "2020-03-30T07:22:11.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Vitals",
        uuid: "67a71486-1a54-468f-ac3e-7091a9a79584"
      },
      auditInfo: {
        creator: {
          uuid: "45ce6c2e-dd5a-11e6-9d9c-0242ac150002",
          display: "admin",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/45ce6c2e-dd5a-11e6-9d9c-0242ac150002"
            }
          ]
        },
        dateCreated: "2020-03-30T07:22:11.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: [
        {
          provider: {
            person: {
              display: "Super User"
            }
          }
        }
      ]
    },
    {
      uuid: "f3fe5786-38f9-483d-a307-c9fe1106e54f",
      display: "Vitals 30/03/2020",
      encounterDatetime: "2020-03-30T08:09:00.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Vitals",
        uuid: "67a71486-1a54-468f-ac3e-7091a9a79584"
      },
      auditInfo: {
        creator: {
          uuid: "45ce6c2e-dd5a-11e6-9d9c-0242ac150002",
          display: "admin",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/45ce6c2e-dd5a-11e6-9d9c-0242ac150002"
            }
          ]
        },
        dateCreated: "2020-03-30T08:10:09.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: []
    },
    {
      uuid: "22b34255-a952-4333-be4f-61305105ddbb",
      display: "Vitals 30/03/2020",
      encounterDatetime: "2020-03-30T08:26:00.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Vitals",
        uuid: "67a71486-1a54-468f-ac3e-7091a9a79584"
      },
      auditInfo: {
        creator: {
          uuid: "45ce6c2e-dd5a-11e6-9d9c-0242ac150002",
          display: "admin",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/45ce6c2e-dd5a-11e6-9d9c-0242ac150002"
            }
          ]
        },
        dateCreated: "2020-03-30T08:26:12.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: []
    },
    {
      uuid: "a1f41158-63c5-4a2c-b44c-d24b3acb8f73",
      display: "Vitals 30/03/2020",
      encounterDatetime: "2020-03-30T08:27:00.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Vitals",
        uuid: "67a71486-1a54-468f-ac3e-7091a9a79584"
      },
      auditInfo: {
        creator: {
          uuid: "45ce6c2e-dd5a-11e6-9d9c-0242ac150002",
          display: "admin",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/45ce6c2e-dd5a-11e6-9d9c-0242ac150002"
            }
          ]
        },
        dateCreated: "2020-03-30T08:27:18.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: []
    },
    {
      uuid: "513897ba-3016-4424-9af9-3400d9b545da",
      display: "Visit Note 31/03/2020",
      encounterDatetime: "2020-03-31T00:00:00.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Visit Note",
        uuid: "d7151f82-c1f3-4152-a605-2f9ea7414a79"
      },
      auditInfo: {
        creator: {
          uuid: "bff0f63d-d192-46c7-9bbd-932affa29b80",
          display: "user-dev",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/bff0f63d-d192-46c7-9bbd-932affa29b80"
            }
          ]
        },
        dateCreated: "2020-03-31T12:41:52.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: [
        {
          provider: {
            person: {
              display: "JJ Dick"
            }
          }
        }
      ]
    },
    {
      uuid: "1b0ed9c7-c1b9-4042-9594-bec29527fa9c",
      display: "Visit Note 31/03/2020",
      encounterDatetime: "2020-03-31T00:00:00.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Visit Note",
        uuid: "d7151f82-c1f3-4152-a605-2f9ea7414a79"
      },
      auditInfo: {
        creator: {
          uuid: "45ce6c2e-dd5a-11e6-9d9c-0242ac150002",
          display: "admin",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/45ce6c2e-dd5a-11e6-9d9c-0242ac150002"
            }
          ]
        },
        dateCreated: "2020-03-31T21:10:10.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: [
        {
          provider: {
            person: {
              display: "JJ Dick"
            }
          }
        }
      ]
    },
    {
      uuid: "a225393c-80bc-4edf-a611-ea8c842a3712",
      display: "Visit Note 31/03/2020",
      encounterDatetime: "2020-03-31T00:00:00.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Visit Note",
        uuid: "d7151f82-c1f3-4152-a605-2f9ea7414a79"
      },
      auditInfo: {
        creator: {
          uuid: "45ce6c2e-dd5a-11e6-9d9c-0242ac150002",
          display: "admin",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/45ce6c2e-dd5a-11e6-9d9c-0242ac150002"
            }
          ]
        },
        dateCreated: "2020-03-31T21:26:52.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: [
        {
          provider: {
            person: {
              display: "JJ Dick"
            }
          }
        }
      ]
    },
    {
      uuid: "11600dd1-4c14-4ac4-b94c-ae126150abcd",
      display: "Visit Note 31/03/2020",
      encounterDatetime: "2020-03-31T00:00:00.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Visit Note",
        uuid: "d7151f82-c1f3-4152-a605-2f9ea7414a79"
      },
      auditInfo: {
        creator: {
          uuid: "45ce6c2e-dd5a-11e6-9d9c-0242ac150002",
          display: "admin",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/45ce6c2e-dd5a-11e6-9d9c-0242ac150002"
            }
          ]
        },
        dateCreated: "2020-03-31T21:34:06.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: [
        {
          provider: {
            person: {
              display: "JJ Dick"
            }
          }
        }
      ]
    },
    {
      uuid: "e573d1d6-cfa5-4d51-b106-823394674dd3",
      display: "Visit Note 01/04/2020",
      encounterDatetime: "2020-04-01T00:00:00.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Visit Note",
        uuid: "d7151f82-c1f3-4152-a605-2f9ea7414a79"
      },
      auditInfo: {
        creator: {
          uuid: "bff0f63d-d192-46c7-9bbd-932affa29b80",
          display: "user-dev",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/bff0f63d-d192-46c7-9bbd-932affa29b80"
            }
          ]
        },
        dateCreated: "2020-04-01T08:48:15.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: [
        {
          provider: {
            person: {
              display: "JJ Dick"
            }
          }
        }
      ]
    },
    {
      uuid: "024b2c78-fe1b-4f3e-92b6-e842224bfd95",
      display: "Visit Note 01/04/2020",
      encounterDatetime: "2020-04-01T00:00:00.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Visit Note",
        uuid: "d7151f82-c1f3-4152-a605-2f9ea7414a79"
      },
      auditInfo: {
        creator: {
          uuid: "bff0f63d-d192-46c7-9bbd-932affa29b80",
          display: "user-dev",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/bff0f63d-d192-46c7-9bbd-932affa29b80"
            }
          ]
        },
        dateCreated: "2020-04-01T08:37:18.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: [
        {
          provider: {
            person: {
              display: "JJ Dick"
            }
          }
        }
      ]
    },
    {
      uuid: "02dc905f-8167-40ce-a0e3-e7292f1ee0d0",
      display: "Visit Note 01/04/2020",
      encounterDatetime: "2020-04-01T00:00:00.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Visit Note",
        uuid: "d7151f82-c1f3-4152-a605-2f9ea7414a79"
      },
      auditInfo: {
        creator: {
          uuid: "bff0f63d-d192-46c7-9bbd-932affa29b80",
          display: "user-dev",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/bff0f63d-d192-46c7-9bbd-932affa29b80"
            }
          ]
        },
        dateCreated: "2020-04-01T08:37:15.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: [
        {
          provider: {
            person: {
              display: "JJ Dick"
            }
          }
        }
      ]
    },
    {
      uuid: "c6cf90db-5de4-4d55-93da-af2920a0585e",
      display: "Visit Note 01/04/2020",
      encounterDatetime: "2020-04-01T00:00:00.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Visit Note",
        uuid: "d7151f82-c1f3-4152-a605-2f9ea7414a79"
      },
      auditInfo: {
        creator: {
          uuid: "bff0f63d-d192-46c7-9bbd-932affa29b80",
          display: "user-dev",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/bff0f63d-d192-46c7-9bbd-932affa29b80"
            }
          ]
        },
        dateCreated: "2020-04-01T07:38:44.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: [
        {
          provider: {
            person: {
              display: "JJ Dick"
            }
          }
        }
      ]
    },
    {
      uuid: "5b5a0378-cf16-42ab-a9de-0113a739c617",
      display: "Vitals 06/04/2020",
      encounterDatetime: "2020-04-06T09:05:00.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Vitals",
        uuid: "67a71486-1a54-468f-ac3e-7091a9a79584"
      },
      auditInfo: {
        creator: {
          uuid: "bff0f63d-d192-46c7-9bbd-932affa29b80",
          display: "user-dev",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/bff0f63d-d192-46c7-9bbd-932affa29b80"
            }
          ]
        },
        dateCreated: "2020-04-06T09:05:42.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: []
    },
    {
      uuid: "76b19b8e-5ca7-4eaf-9d4a-974ba7081dc7",
      display: "Vitals 06/04/2020",
      encounterDatetime: "2020-04-06T09:27:00.000+0000",
      location: {
        uuid: "b1a8b05e-3542-4037-bbd3-998ee9c40574",
        display: "Inpatient Ward",
        name: "Inpatient Ward"
      },
      encounterType: {
        name: "Vitals",
        uuid: "67a71486-1a54-468f-ac3e-7091a9a79584"
      },
      auditInfo: {
        creator: {
          uuid: "55c32ecf-a66e-44ad-98db-6390371fc202",
          display: "user1",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/55c32ecf-a66e-44ad-98db-6390371fc202"
            }
          ]
        },
        dateCreated: "2020-04-06T09:27:49.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: []
    },
    {
      uuid: "62815725-9a53-4d1e-a59c-9e5f1b30fd5a",
      display: "Vitals 06/04/2020",
      encounterDatetime: "2020-04-06T09:30:00.000+0000",
      location: {
        uuid: "f76c0c8e-2c3a-443c-b26d-96a9f3847764",
        display: "Mosoriot Pharmacy",
        name: "Mosoriot Pharmacy"
      },
      encounterType: {
        name: "Vitals",
        uuid: "67a71486-1a54-468f-ac3e-7091a9a79584"
      },
      auditInfo: {
        creator: {
          uuid: "45ce6c2e-dd5a-11e6-9d9c-0242ac150002",
          display: "admin",
          links: [
            {
              rel: "self",
              uri:
                "http://localhost:8090/openmrs/ws/rest/v1/user/45ce6c2e-dd5a-11e6-9d9c-0242ac150002"
            }
          ]
        },
        dateCreated: "2020-04-06T09:30:33.000+0000",
        changedBy: null,
        dateChanged: null
      },
      encounterProviders: []
    }
  ]
};

export const mockFormattedNotes = [
  {
    id: "7e2a4abb-4caa-44ad-b3cf-39cd9c59afd8",
    encounterAuthor: "Dr. G. Testerson",
    encounterDate: "2020-02-19T08:26:05",
    encounterType: "Vitals",
    encounterLocation: "Isolation Ward"
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
