export const mockVitalsResponse = {
  headers: null,
  ok: true,
  redirected: true,
  status: 200,
  statusText: "ok",
  trailer: null,
  type: null,
  url: "",
  clone: null,
  body: null,
  bodyUsed: null,
  arrayBuffer: null,
  blob: null,
  formData: null,
  json: null,
  text: null,
  data: {
    resourceType: "Bundle",
    id: "63378630-e9a5-468b-baec-439d8ed55d09",
    meta: { lastUpdated: "2019-11-20T11:16:11.030+00:00" },
    type: "searchset",
    total: 10,
    link: [
      {
        relation: "self",
        url:
          "http://localhost:8080/openmrs/ws/fhir2/Observation?code=5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2C5086AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2C5087AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2C5088AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2C5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA&subject%3APatient=90f7f0b4-06a8-4a97-9678-e7a977f4b518"
      }
    ],
    entry: [
      {
        fullUrl:
          "http://localhost:8080/openmrs/ws/fhir2/Observation/1413f560-ce7d-4cf8-9969-ceacc155f503",
        resource: {
          resourceType: "Observation",
          id: "1413f560-ce7d-4cf8-9969-ceacc155f503",
          extension: [
            {
              url:
                "http://fhir-es.transcendinsights.com/stu3/StructureDefinition/resource-date-created",
              valueDateTime: "2017-01-18T09:02:37+00:00"
            },
            {
              url:
                "https://purl.org/elab/fhir/StructureDefinition/Creator-crew-version1",
              valueString: "daemon"
            },
            {
              url: "locationUuid",
              valueString: "58c57d25-8d39-41ab-8422-108a0c277d98"
            }
          ],
          status: "final",
          code: {
            coding: [
              { system: "http://ciel.org", code: "5087" },
              { system: "http://ampath.com/", code: "5087" },
              { system: "http://loinc.org", code: "8867-4" },
              { system: "http://snomed.info/sct", code: "78564009" },
              { system: "org.openmrs.module.mdrtb", code: "PULSE" },
              { system: "http://www.pih.org/", code: "5087" },
              {
                system: "http://openmrs.org",
                code: "5087AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                display: "Pulse"
              }
            ]
          },
          subject: {
            id: "90f7f0b4-06a8-4a97-9678-e7a977f4b518",
            reference: "Patient/90f7f0b4-06a8-4a97-9678-e7a977f4b518",
            identifier: { id: "90f7f0b4-06a8-4a97-9678-e7a977f4b518" },
            display: "John Taylor(Identifier:10010W)"
          },
          encounter: {
            reference: "Encounter/c8876e57-f788-47a1-b8fd-30dbbb497941"
          },
          effectiveDateTime: "2016-05-16T06:13:36+00:00",
          issued: "2016-05-16T06:13:36.000+00:00",
          valueQuantity: {
            value: 22,
            unit: "beats/min",
            system: "http://unitsofmeasure.org",
            code: "beats/min"
          },
          referenceRange: [
            {
              low: {
                value: 0,
                unit: "beats/min",
                system: "http://unitsofmeasure.org",
                code: "beats/min"
              },
              high: {
                value: 230,
                unit: "beats/min",
                system: "http://unitsofmeasure.org",
                code: "beats/min"
              }
            }
          ]
        }
      },
      {
        fullUrl:
          "http://localhost:8080/openmrs/ws/fhir2/Observation/bc9569bc-e6e6-4f18-8b1a-2b6013a74df3",
        resource: {
          resourceType: "Observation",
          id: "bc9569bc-e6e6-4f18-8b1a-2b6013a74df3",
          extension: [
            {
              url:
                "http://fhir-es.transcendinsights.com/stu3/StructureDefinition/resource-date-created",
              valueDateTime: "2017-01-18T09:02:35+00:00"
            },
            {
              url:
                "https://purl.org/elab/fhir/StructureDefinition/Creator-crew-version1",
              valueString: "daemon"
            },
            {
              url: "locationUuid",
              valueString: "58c57d25-8d39-41ab-8422-108a0c277d98"
            }
          ],
          status: "final",
          code: {
            coding: [
              { system: "http://ciel.org", code: "5087" },
              { system: "http://ampath.com/", code: "5087" },
              { system: "http://loinc.org", code: "8867-4" },
              { system: "http://snomed.info/sct", code: "78564009" },
              { system: "org.openmrs.module.mdrtb", code: "PULSE" },
              { system: "http://www.pih.org/", code: "5087" },
              {
                system: "http://openmrs.org",
                code: "5087AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                display: "Pulse"
              }
            ]
          },
          subject: {
            id: "90f7f0b4-06a8-4a97-9678-e7a977f4b518",
            reference: "Patient/90f7f0b4-06a8-4a97-9678-e7a977f4b518",
            identifier: { id: "90f7f0b4-06a8-4a97-9678-e7a977f4b518" },
            display: "John Taylor(Identifier:10010W)"
          },
          encounter: {
            reference: "Encounter/1d2bdaf3-2a70-4035-844b-bbbb42cb666e"
          },
          effectiveDateTime: "2015-08-25T06:30:35+00:00",
          issued: "2015-08-25T06:30:35.000+00:00",
          valueQuantity: {
            value: 173,
            unit: "beats/min",
            system: "http://unitsofmeasure.org",
            code: "beats/min"
          },
          referenceRange: [
            {
              low: {
                value: 0,
                unit: "beats/min",
                system: "http://unitsofmeasure.org",
                code: "beats/min"
              },
              high: {
                value: 230,
                unit: "beats/min",
                system: "http://unitsofmeasure.org",
                code: "beats/min"
              }
            }
          ]
        }
      },
      {
        fullUrl:
          "http://localhost:8080/openmrs/ws/fhir2/Observation/b1c36f8e-9e2d-4684-843c-72b7cdffa790",
        resource: {
          resourceType: "Observation",
          id: "b1c36f8e-9e2d-4684-843c-72b7cdffa790",
          extension: [
            {
              url:
                "http://fhir-es.transcendinsights.com/stu3/StructureDefinition/resource-date-created",
              valueDateTime: "2017-01-18T09:02:37+00:00"
            },
            {
              url:
                "https://purl.org/elab/fhir/StructureDefinition/Creator-crew-version1",
              valueString: "daemon"
            },
            {
              url: "locationUuid",
              valueString: "58c57d25-8d39-41ab-8422-108a0c277d98"
            }
          ],
          status: "final",
          code: {
            coding: [
              { system: "http://loinc.org", code: "8480-6" },
              { system: "http://ampath.com/", code: "5085" },
              { system: "http://ciel.org", code: "5085" },
              { system: "http://www.pih.org/", code: "5085" },
              { system: "http://snomed.info/sct", code: "271649006" },
              { system: "http://www.pih.org/country/malawi", code: "5085" },
              {
                system: "org.openmrs.module.mdrtb",
                code: "SYSTOLIC BLOOD PRESSURE"
              },
              {
                system: "http://openmrs.org",
                code: "5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                display: "Systolic blood pressure"
              }
            ]
          },
          subject: {
            id: "90f7f0b4-06a8-4a97-9678-e7a977f4b518",
            reference: "Patient/90f7f0b4-06a8-4a97-9678-e7a977f4b518",
            identifier: { id: "90f7f0b4-06a8-4a97-9678-e7a977f4b518" },
            display: "John Taylor(Identifier:10010W)"
          },
          encounter: {
            reference: "Encounter/c8876e57-f788-47a1-b8fd-30dbbb497941"
          },
          effectiveDateTime: "2016-05-16T06:13:36+00:00",
          issued: "2016-05-16T06:13:36.000+00:00",
          valueQuantity: {
            value: 161,
            unit: "mmHg",
            system: "http://unitsofmeasure.org",
            code: "mmHg"
          },
          referenceRange: [
            {
              low: {
                value: 0,
                unit: "mmHg",
                system: "http://unitsofmeasure.org",
                code: "mmHg"
              },
              high: {
                value: 250,
                unit: "mmHg",
                system: "http://unitsofmeasure.org",
                code: "mmHg"
              }
            }
          ]
        }
      },
      {
        fullUrl:
          "http://localhost:8080/openmrs/ws/fhir2/Observation/e71a78b9-168c-44f8-bd75-8def540bd496",
        resource: {
          resourceType: "Observation",
          id: "e71a78b9-168c-44f8-bd75-8def540bd496",
          extension: [
            {
              url:
                "http://fhir-es.transcendinsights.com/stu3/StructureDefinition/resource-date-created",
              valueDateTime: "2017-01-18T09:02:36+00:00"
            },
            {
              url:
                "https://purl.org/elab/fhir/StructureDefinition/Creator-crew-version1",
              valueString: "daemon"
            },
            {
              url: "locationUuid",
              valueString: "58c57d25-8d39-41ab-8422-108a0c277d98"
            }
          ],
          status: "final",
          code: {
            coding: [
              { system: "http://loinc.org", code: "8480-6" },
              { system: "http://ampath.com/", code: "5085" },
              { system: "http://ciel.org", code: "5085" },
              { system: "http://www.pih.org/", code: "5085" },
              { system: "http://snomed.info/sct", code: "271649006" },
              { system: "http://www.pih.org/country/malawi", code: "5085" },
              {
                system: "org.openmrs.module.mdrtb",
                code: "SYSTOLIC BLOOD PRESSURE"
              },
              {
                system: "http://openmrs.org",
                code: "5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                display: "Systolic blood pressure"
              }
            ]
          },
          subject: {
            id: "90f7f0b4-06a8-4a97-9678-e7a977f4b518",
            reference: "Patient/90f7f0b4-06a8-4a97-9678-e7a977f4b518",
            identifier: { id: "90f7f0b4-06a8-4a97-9678-e7a977f4b518" },
            display: "John Taylor(Identifier:10010W)"
          },
          encounter: {
            reference: "Encounter/1d2bdaf3-2a70-4035-844b-bbbb42cb666e"
          },
          effectiveDateTime: "2015-08-25T06:30:35+00:00",
          issued: "2015-08-25T06:30:35.000+00:00",
          valueQuantity: {
            value: 156,
            unit: "mmHg",
            system: "http://unitsofmeasure.org",
            code: "mmHg"
          },
          referenceRange: [
            {
              low: {
                value: 0,
                unit: "mmHg",
                system: "http://unitsofmeasure.org",
                code: "mmHg"
              },
              high: {
                value: 250,
                unit: "mmHg",
                system: "http://unitsofmeasure.org",
                code: "mmHg"
              }
            }
          ]
        }
      },
      {
        fullUrl:
          "http://localhost:8080/openmrs/ws/fhir2/Observation/83699360-d195-4d22-a7f8-74c9f0716fd4",
        resource: {
          resourceType: "Observation",
          id: "83699360-d195-4d22-a7f8-74c9f0716fd4",
          extension: [
            {
              url:
                "http://fhir-es.transcendinsights.com/stu3/StructureDefinition/resource-date-created",
              valueDateTime: "2017-01-18T09:02:37+00:00"
            },
            {
              url:
                "https://purl.org/elab/fhir/StructureDefinition/Creator-crew-version1",
              valueString: "daemon"
            },
            {
              url: "locationUuid",
              valueString: "58c57d25-8d39-41ab-8422-108a0c277d98"
            }
          ],
          status: "final",
          code: {
            coding: [
              { system: "http://loinc.org", code: "8310-5" },
              { system: "org.openmrs.module.mdrtb", code: "TEMPERATURE" },
              { system: "http://ciel.org", code: "5088" },
              { system: "http://snomed.info/snp", code: "386725007" },
              { system: "http://www.pih.org/", code: "5088" },
              { system: "http://ampath.com/", code: "5088" },
              {
                system: "http://openmrs.org",
                code: "5088AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                display: "Temperature (C)"
              }
            ]
          },
          subject: {
            id: "90f7f0b4-06a8-4a97-9678-e7a977f4b518",
            reference: "Patient/90f7f0b4-06a8-4a97-9678-e7a977f4b518",
            identifier: { id: "90f7f0b4-06a8-4a97-9678-e7a977f4b518" },
            display: "John Taylor(Identifier:10010W)"
          },
          encounter: {
            reference: "Encounter/c8876e57-f788-47a1-b8fd-30dbbb497941"
          },
          effectiveDateTime: "2016-05-16T06:13:36+00:00",
          issued: "2016-05-16T06:13:36.000+00:00",
          valueQuantity: {
            value: 37,
            unit: "DEG C",
            system: "http://unitsofmeasure.org",
            code: "DEG C"
          },
          referenceRange: [
            {
              low: {
                value: 25,
                unit: "DEG C",
                system: "http://unitsofmeasure.org",
                code: "DEG C"
              },
              high: {
                value: 43,
                unit: "DEG C",
                system: "http://unitsofmeasure.org",
                code: "DEG C"
              }
            }
          ]
        }
      },
      {
        fullUrl:
          "http://localhost:8080/openmrs/ws/fhir2/Observation/d5db0d37-df12-4d4f-8576-66284497d34f",
        resource: {
          resourceType: "Observation",
          id: "d5db0d37-df12-4d4f-8576-66284497d34f",
          extension: [
            {
              url:
                "http://fhir-es.transcendinsights.com/stu3/StructureDefinition/resource-date-created",
              valueDateTime: "2017-01-18T09:02:35+00:00"
            },
            {
              url:
                "https://purl.org/elab/fhir/StructureDefinition/Creator-crew-version1",
              valueString: "daemon"
            },
            {
              url: "locationUuid",
              valueString: "58c57d25-8d39-41ab-8422-108a0c277d98"
            }
          ],
          status: "final",
          code: {
            coding: [
              { system: "http://loinc.org", code: "8310-5" },
              { system: "org.openmrs.module.mdrtb", code: "TEMPERATURE" },
              { system: "http://ciel.org", code: "5088" },
              { system: "http://snomed.info/snp", code: "386725007" },
              { system: "http://www.pih.org/", code: "5088" },
              { system: "http://ampath.com/", code: "5088" },
              {
                system: "http://openmrs.org",
                code: "5088AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                display: "Temperature (C)"
              }
            ]
          },
          subject: {
            id: "90f7f0b4-06a8-4a97-9678-e7a977f4b518",
            reference: "Patient/90f7f0b4-06a8-4a97-9678-e7a977f4b518",
            identifier: { id: "90f7f0b4-06a8-4a97-9678-e7a977f4b518" },
            display: "John Taylor(Identifier:10010W)"
          },
          encounter: {
            reference: "Encounter/1d2bdaf3-2a70-4035-844b-bbbb42cb666e"
          },
          effectiveDateTime: "2015-08-25T06:30:35+00:00",
          issued: "2015-08-25T06:30:35.000+00:00",
          valueQuantity: {
            value: 37,
            unit: "DEG C",
            system: "http://unitsofmeasure.org",
            code: "DEG C"
          },
          referenceRange: [
            {
              low: {
                value: 25,
                unit: "DEG C",
                system: "http://unitsofmeasure.org",
                code: "DEG C"
              },
              high: {
                value: 43,
                unit: "DEG C",
                system: "http://unitsofmeasure.org",
                code: "DEG C"
              }
            }
          ]
        }
      },
      {
        fullUrl:
          "http://localhost:8080/openmrs/ws/fhir2/Observation/bbee197c-6ac2-4790-a68f-6779847feb68",
        resource: {
          resourceType: "Observation",
          id: "bbee197c-6ac2-4790-a68f-6779847feb68",
          extension: [
            {
              url:
                "http://fhir-es.transcendinsights.com/stu3/StructureDefinition/resource-date-created",
              valueDateTime: "2017-01-18T09:02:37+00:00"
            },
            {
              url:
                "https://purl.org/elab/fhir/StructureDefinition/Creator-crew-version1",
              valueString: "daemon"
            },
            {
              url: "locationUuid",
              valueString: "58c57d25-8d39-41ab-8422-108a0c277d98"
            }
          ],
          status: "final",
          code: {
            coding: [
              { system: "http://ciel.org", code: "5092" },
              {
                system: "https://www.e-imo.com/releases/problem-it",
                code: "3771"
              },
              { system: "http://snomed.info/sct", code: "431314004" },
              { system: "http://ampath.com/", code: "5092" },
              { system: "http://loinc.org", code: "2710-2" },
              {
                system: "https://www.e-imo.com/releases/problem-it",
                code: "26745610"
              },
              {
                system: "http://openmrs.org",
                code: "5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                display: "Blood oxygen saturation"
              }
            ]
          },
          subject: {
            id: "90f7f0b4-06a8-4a97-9678-e7a977f4b518",
            reference: "Patient/90f7f0b4-06a8-4a97-9678-e7a977f4b518",
            identifier: { id: "90f7f0b4-06a8-4a97-9678-e7a977f4b518" },
            display: "John Taylor(Identifier:10010W)"
          },
          encounter: {
            reference: "Encounter/c8876e57-f788-47a1-b8fd-30dbbb497941"
          },
          effectiveDateTime: "2016-05-16T06:13:36+00:00",
          issued: "2016-05-16T06:13:36.000+00:00",
          valueQuantity: {
            value: 30,
            unit: "%",
            system: "http://unitsofmeasure.org",
            code: "%"
          },
          referenceRange: [
            {
              low: {
                value: 0,
                unit: "%",
                system: "http://unitsofmeasure.org",
                code: "%"
              },
              high: {
                value: 100,
                unit: "%",
                system: "http://unitsofmeasure.org",
                code: "%"
              }
            }
          ]
        }
      },
      {
        fullUrl:
          "http://localhost:8080/openmrs/ws/fhir2/Observation/f5d5bf54-55ba-409f-964a-c4c1c4ad7437",
        resource: {
          resourceType: "Observation",
          id: "f5d5bf54-55ba-409f-964a-c4c1c4ad7437",
          extension: [
            {
              url:
                "http://fhir-es.transcendinsights.com/stu3/StructureDefinition/resource-date-created",
              valueDateTime: "2017-01-18T09:02:36+00:00"
            },
            {
              url:
                "https://purl.org/elab/fhir/StructureDefinition/Creator-crew-version1",
              valueString: "daemon"
            },
            {
              url: "locationUuid",
              valueString: "58c57d25-8d39-41ab-8422-108a0c277d98"
            }
          ],
          status: "final",
          code: {
            coding: [
              { system: "http://ciel.org", code: "5092" },
              {
                system: "https://www.e-imo.com/releases/problem-it",
                code: "3771"
              },
              { system: "http://snomed.info/sct", code: "431314004" },
              { system: "http://ampath.com/", code: "5092" },
              { system: "http://loinc.org", code: "2710-2" },
              {
                system: "https://www.e-imo.com/releases/problem-it",
                code: "26745610"
              },
              {
                system: "http://openmrs.org",
                code: "5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                display: "Blood oxygen saturation"
              }
            ]
          },
          subject: {
            id: "90f7f0b4-06a8-4a97-9678-e7a977f4b518",
            reference: "Patient/90f7f0b4-06a8-4a97-9678-e7a977f4b518",
            identifier: { id: "90f7f0b4-06a8-4a97-9678-e7a977f4b518" },
            display: "John Taylor(Identifier:10010W)"
          },
          encounter: {
            reference: "Encounter/1d2bdaf3-2a70-4035-844b-bbbb42cb666e"
          },
          effectiveDateTime: "2015-08-25T06:30:35+00:00",
          issued: "2015-08-25T06:30:35.000+00:00",
          valueQuantity: {
            value: 41,
            unit: "%",
            system: "http://unitsofmeasure.org",
            code: "%"
          },
          referenceRange: [
            {
              low: {
                value: 0,
                unit: "%",
                system: "http://unitsofmeasure.org",
                code: "%"
              },
              high: {
                value: 100,
                unit: "%",
                system: "http://unitsofmeasure.org",
                code: "%"
              }
            }
          ]
        }
      },
      {
        fullUrl:
          "http://localhost:8080/openmrs/ws/fhir2/Observation/34c413ff-0cda-4594-b65c-d298a12ef6d4",
        resource: {
          resourceType: "Observation",
          id: "34c413ff-0cda-4594-b65c-d298a12ef6d4",
          extension: [
            {
              url:
                "http://fhir-es.transcendinsights.com/stu3/StructureDefinition/resource-date-created",
              valueDateTime: "2017-01-18T09:02:37+00:00"
            },
            {
              url:
                "https://purl.org/elab/fhir/StructureDefinition/Creator-crew-version1",
              valueString: "daemon"
            },
            {
              url: "locationUuid",
              valueString: "58c57d25-8d39-41ab-8422-108a0c277d98"
            }
          ],
          status: "final",
          code: {
            coding: [
              { system: "http://www.pih.org/", code: "5086" },
              { system: "http://loinc.org", code: "35094-2" },
              { system: "http://loinc.org", code: "8462-4" },
              { system: "http://www.pih.org/country/malawi", code: "5086" },
              { system: "http://ciel.org", code: "5086" },
              { system: "http://snomed.info/sct", code: "271650006" },
              { system: "http://ampath.com/", code: "5086" },
              {
                system: "http://openmrs.org",
                code: "5086AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                display: "Diastolic blood pressure"
              }
            ]
          },
          subject: {
            id: "90f7f0b4-06a8-4a97-9678-e7a977f4b518",
            reference: "Patient/90f7f0b4-06a8-4a97-9678-e7a977f4b518",
            identifier: { id: "90f7f0b4-06a8-4a97-9678-e7a977f4b518" },
            display: "John Taylor(Identifier:10010W)"
          },
          encounter: {
            reference: "Encounter/c8876e57-f788-47a1-b8fd-30dbbb497941"
          },
          effectiveDateTime: "2016-05-16T06:13:36+00:00",
          issued: "2016-05-16T06:13:36.000+00:00",
          valueQuantity: {
            value: 72,
            unit: "mmHg",
            system: "http://unitsofmeasure.org",
            code: "mmHg"
          },
          referenceRange: [
            {
              low: {
                value: 0,
                unit: "mmHg",
                system: "http://unitsofmeasure.org",
                code: "mmHg"
              },
              high: {
                value: 150,
                unit: "mmHg",
                system: "http://unitsofmeasure.org",
                code: "mmHg"
              }
            }
          ]
        }
      },
      {
        fullUrl:
          "http://localhost:8080/openmrs/ws/fhir2/Observation/bc37e12a-71f5-432e-8536-2fb6744471b3",
        resource: {
          resourceType: "Observation",
          id: "bc37e12a-71f5-432e-8536-2fb6744471b3",
          extension: [
            {
              url:
                "http://fhir-es.transcendinsights.com/stu3/StructureDefinition/resource-date-created",
              valueDateTime: "2017-01-18T09:02:36+00:00"
            },
            {
              url:
                "https://purl.org/elab/fhir/StructureDefinition/Creator-crew-version1",
              valueString: "daemon"
            },
            {
              url: "locationUuid",
              valueString: "58c57d25-8d39-41ab-8422-108a0c277d98"
            }
          ],
          status: "final",
          code: {
            coding: [
              { system: "http://www.pih.org/", code: "5086" },
              { system: "http://loinc.org", code: "35094-2" },
              { system: "http://loinc.org", code: "8462-4" },
              { system: "http://www.pih.org/country/malawi", code: "5086" },
              { system: "http://ciel.org", code: "5086" },
              { system: "http://snomed.info/sct", code: "271650006" },
              { system: "http://ampath.com/", code: "5086" },
              {
                system: "http://openmrs.org",
                code: "5086AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                display: "Diastolic blood pressure"
              }
            ]
          },
          subject: {
            id: "90f7f0b4-06a8-4a97-9678-e7a977f4b518",
            reference: "Patient/90f7f0b4-06a8-4a97-9678-e7a977f4b518",
            identifier: { id: "90f7f0b4-06a8-4a97-9678-e7a977f4b518" },
            display: "John Taylor(Identifier:10010W)"
          },
          encounter: {
            reference: "Encounter/1d2bdaf3-2a70-4035-844b-bbbb42cb666e"
          },
          effectiveDateTime: "2015-08-25T06:30:35+00:00",
          issued: "2015-08-25T06:30:35.000+00:00",
          valueQuantity: {
            value: 64,
            unit: "mmHg",
            system: "http://unitsofmeasure.org",
            code: "mmHg"
          },
          referenceRange: [
            {
              low: {
                value: 0,
                unit: "mmHg",
                system: "http://unitsofmeasure.org",
                code: "mmHg"
              },
              high: {
                value: 150,
                unit: "mmHg",
                system: "http://unitsofmeasure.org",
                code: "mmHg"
              }
            }
          ]
        }
      }
    ]
  }
};

export const mockEmptyVitalsResponse = {
  headers: null,
  ok: true,
  redirected: true,
  status: 200,
  statusText: "ok",
  trailer: null,
  type: null,
  url: "",
  clone: null,
  body: null,
  bodyUsed: null,
  arrayBuffer: null,
  blob: null,
  formData: null,
  json: null,
  text: null,
  data: {
    resourceType: "Bundle",
    id: "63378630-e9a5-468b-baec-439d8ed55d09",
    meta: { lastUpdated: "2019-11-20T11:16:11.030+00:00" },
    type: "searchset",
    total: 10,
    link: [
      {
        relation: "self",
        url:
          "http://localhost:8080/openmrs/ws/fhir2/Observation?code=5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2C5086AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2C5087AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2C5088AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2C5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA&subject%3APatient=90f7f0b4-06a8-4a97-9678-e7a977f4b518"
      }
    ],
    entry: []
  }
};

export const mockVitalData = [
  {
    id: "e8a96dcc-5bb6-4975-be3b-214440e34fa4",
    date: "2016-05-16T06:13:36.000+00:00",
    systolic: 161,
    diastolic: 72,
    pulse: 22,
    temperature: 37,
    oxygenSaturation: 30
  },
  {
    id: "d821eb55-1ba8-49c3-9ac8-95882744bd27",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 120,
    diastolic: 80,
    pulse: 60,
    temperature: 38,
    oxygenSaturation: 93
  },
  {
    id: "dda59d9c-1544-4736-80cc-4a87d9b69cfa",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 120,
    diastolic: 80,
    pulse: 65,
    temperature: 36,
    oxygenSaturation: 42
  },
  {
    id: "4133736c-24f7-4971-84e7-986e22cb77b5",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 127,
    diastolic: 145,
    pulse: 210,
    temperature: 43,
    oxygenSaturation: 45
  },
  {
    id: "33f7aff0-07aa-449c-ab89-e8c0fe066adb",
    date: "2016-05-16T06:13:36.000+00:00",
    systolic: 138,
    diastolic: 90,
    pulse: 112,
    temperature: 33,
    oxygenSaturation: 78
  },
  {
    id: "b3829daf-081b-4837-a2b6-21878a184faf",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 135,
    diastolic: 68,
    pulse: 215,
    temperature: 38,
    oxygenSaturation: 54
  },
  {
    id: "bd54ef4d-c118-4413-8e3e-edfc66afc851",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 99,
    diastolic: 46,
    pulse: 53,
    temperature: 36,
    oxygenSaturation: 50
  },
  {
    id: "41ca9a59-1e61-43ab-b990-c985647fc203",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 113,
    diastolic: 96,
    pulse: 189,
    temperature: 39,
    oxygenSaturation: 20
  },
  {
    id: "732d01c5-218a-4738-846a-a07326bb9ebb",
    date: "2016-05-16T06:13:36.000+00:00",
    systolic: 75,
    diastolic: 59,
    pulse: 193,
    temperature: 33,
    oxygenSaturation: 36
  },
  {
    id: "52c1a328-083d-48c4-b450-7457650e10f9",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 113,
    diastolic: 116,
    pulse: 175,
    temperature: 36,
    oxygenSaturation: 80
  },
  {
    id: "43fea836-6c82-4df2-9bf1-dd07b6c54651",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 154,
    diastolic: 113,
    pulse: 157,
    temperature: 27,
    oxygenSaturation: 31
  },
  {
    id: "4a5e857f-4bce-4dea-be3b-1d789e125ff9",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 176,
    diastolic: 107,
    pulse: 4,
    temperature: 42,
    oxygenSaturation: 57
  },
  {
    id: "b8375c83-b4c1-4291-9561-d3fb38373cee",
    date: "2016-05-16T06:13:36.000+00:00",
    systolic: 161,
    diastolic: 72,
    pulse: 22,
    temperature: 37,
    oxygenSaturation: 30
  },
  {
    id: "957e943e-69ca-4378-ad7c-9d76fb11c743",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 156,
    diastolic: 64,
    pulse: 173,
    temperature: 37,
    oxygenSaturation: 41
  },
  {
    id: "115ea6af-92e7-4846-a763-1c4b229feb8b",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 146,
    diastolic: 50,
    pulse: 78,
    temperature: 34,
    oxygenSaturation: 40
  },
  {
    id: "2370f007-0bed-4623-8803-614714e04ec9",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 156,
    diastolic: 64,
    pulse: 173,
    temperature: 37,
    oxygenSaturation: 41
  },
  {
    id: "92f19d94-155b-4aa0-be96-d39149b7bb30",
    date: "2016-05-16T06:13:36.000+00:00",
    systolic: 161,
    diastolic: 72,
    pulse: 22,
    temperature: 37,
    oxygenSaturation: 30
  },
  {
    id: "93de8c68-7a67-4ea4-9080-ccf6cee13226",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 186,
    diastolic: 97,
    pulse: 173,
    temperature: 37,
    oxygenSaturation: 41
  },
  {
    id: "30eaff83-1e8c-4059-8b70-7a9aa76709fb",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 156,
    diastolic: 64,
    pulse: 173,
    temperature: 37,
    oxygenSaturation: 41
  },
  {
    id: "c141b84c-eb37-49dd-af55-5c46372461d9",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 156,
    diastolic: 64,
    pulse: 173,
    temperature: 37,
    oxygenSaturation: 41
  },
  {
    id: "e1cbd2b8-77b7-4bfc-a019-cad45155a6ac",
    date: "2016-05-16T06:13:36.000+00:00",
    systolic: 161,
    diastolic: 72,
    pulse: 22,
    temperature: 37,
    oxygenSaturation: 30
  },
  {
    id: "708aa53f-22fd-4b83-b055-7160ed3c3b47",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 156,
    diastolic: 64,
    pulse: 173,
    temperature: 37,
    oxygenSaturation: 41
  },
  {
    id: "da6060ef-bfc2-41e9-97c3-405da77fd3b9",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 156,
    diastolic: 64,
    pulse: 173,
    temperature: 37,
    oxygenSaturation: 41
  },
  {
    id: "abbe10e0-37ca-489b-9133-00b605c85a3f",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 156,
    diastolic: 64,
    pulse: 173,
    temperature: 37,
    oxygenSaturation: 41
  },
  {
    id: "98124239-ca1e-4772-b00a-3ac442233984",
    date: "2016-05-16T06:13:36.000+00:00",
    systolic: 161,
    diastolic: 72,
    pulse: 22,
    temperature: 37,
    oxygenSaturation: 30
  },
  {
    id: "5e0eb81b-c7da-477a-a031-cd9197614a0d",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 156,
    diastolic: 64,
    pulse: 173,
    temperature: 37,
    oxygenSaturation: 41
  },
  {
    id: "aa94b33a-65b9-4fe7-a6e6-34ecbfab3bc4",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 156,
    diastolic: 64,
    pulse: 173,
    temperature: 37,
    oxygenSaturation: 41
  },
  {
    id: "1b776ac0-3715-4252-af65-54e60efd32ab",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 156,
    diastolic: 64,
    pulse: 173,
    temperature: 37,
    oxygenSaturation: 41
  },
  {
    id: "530d2216-6acb-4573-9625-2683f523f5a3",
    date: "2016-05-16T06:13:36.000+00:00",
    systolic: 161,
    diastolic: 72,
    pulse: 22,
    temperature: 37,
    oxygenSaturation: 30
  },
  {
    id: "419c7ae0-c13d-4114-a145-f3952bf2d9a6",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 156,
    diastolic: 64,
    pulse: 173,
    temperature: 37,
    oxygenSaturation: 41
  },
  {
    id: "74c650f2-3bc4-4144-ba13-7e1fbc853d7e",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 156,
    diastolic: 64,
    pulse: 173,
    temperature: 37,
    oxygenSaturation: 41
  },
  {
    id: "cfcec828-16f8-44e9-8a89-a872680c6f75",
    date: "2015-08-25T06:30:35.000+00:00",
    systolic: 156,
    diastolic: 64,
    pulse: 173,
    temperature: 37,
    oxygenSaturation: 41
  }
];

export const mockVitalSigns = mockVitalData[0];
