import dayjs from "dayjs";

const todaysDate = dayjs().format("YYYY-MM-DD");

export const mockDimensionResponse = {
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
    id: "67eaa382-a8a7-4093-9b2a-1a05ec3f405a",
    meta: { lastUpdated: `${todaysDate}T09:32:14.334+00:00` },
    type: "searchset",
    total: 13,
    entry: [
      {
        resource: {
          resourceType: "Observation",
          id: "7d300a63-b12b-4280-9788-928fc1d040ef",
          status: "final",
          code: {
            coding: [
              { code: "5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" },
              { system: "http://loinc.org", code: "8302-2" },
              { system: "urn:oid:2.16.840.1.113883.3.7201", code: "5090" }
            ]
          },
          subject: {
            reference: "Patient/6c201864-7ec0-4baa-a686-295c2c69ff41",
            type: "Patient",
            identifier: {
              id: "3398f0fc-799b-4e98-816c-9bf0aa13b634",
              use: "official",
              system: "OpenMRS ID",
              value: "10040T"
            },
            display: "John Green(OpenMRS ID:10040T)"
          },
          encounter: {
            reference: "Encounter/1a82fdc6-3d14-44c4-ab45-d65baa0062ae",
            type: "Encounter"
          },
          effectiveDateTime: "2016-12-18T06:48:20+00:00",
          issued: "2017-01-18T09:11:20.000+00:00",
          valueQuantity: { value: 173.0 },
          referenceRange: [
            {
              low: { value: 10.0 },
              high: { value: 272.0 },
              type: {
                coding: [
                  {
                    system:
                      "http://terminology.hl7.org/CodeSystem/referencerange-meaning",
                    code: "treatment"
                  }
                ]
              }
            }
          ]
        }
      },
      {
        resource: {
          resourceType: "Observation",
          id: "fcc6e063-bd54-489a-b2b5-5bb4f4fb7237",
          status: "final",
          code: {
            coding: [
              { code: "5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" },
              { system: "http://loinc.org", code: "3141-9" },
              { system: "urn:oid:2.16.840.1.113883.3.7201", code: "5089" }
            ]
          },
          subject: {
            reference: "Patient/6c201864-7ec0-4baa-a686-295c2c69ff41",
            type: "Patient",
            identifier: {
              id: "3398f0fc-799b-4e98-816c-9bf0aa13b634",
              use: "official",
              system: "OpenMRS ID",
              value: "10040T"
            },
            display: "John Green(OpenMRS ID:10040T)"
          },
          encounter: {
            reference: "Encounter/1a82fdc6-3d14-44c4-ab45-d65baa0062ae",
            type: "Encounter"
          },
          effectiveDateTime: "2016-12-18T06:48:20+00:00",
          issued: "2017-01-18T09:11:20.000+00:00",
          valueQuantity: { value: 235.0 },
          referenceRange: [
            {
              low: { value: 0.0 },
              high: { value: 250.0 },
              type: {
                coding: [
                  {
                    system:
                      "http://terminology.hl7.org/CodeSystem/referencerange-meaning",
                    code: "treatment"
                  }
                ]
              }
            }
          ]
        }
      },
      {
        resource: {
          resourceType: "Observation",
          id: "d02d07b3-2532-4102-8838-66f0bc337c73",
          status: "final",
          code: {
            coding: [
              { code: "5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" },
              { system: "http://loinc.org", code: "8302-2" },
              { system: "urn:oid:2.16.840.1.113883.3.7201", code: "5090" }
            ]
          },
          subject: {
            reference: "Patient/6c201864-7ec0-4baa-a686-295c2c69ff41",
            type: "Patient",
            identifier: {
              id: "3398f0fc-799b-4e98-816c-9bf0aa13b634",
              use: "official",
              system: "OpenMRS ID",
              value: "10040T"
            },
            display: "John Green(OpenMRS ID:10040T)"
          },
          encounter: {
            reference: "Encounter/d563da0a-9ce0-497b-8fcb-6df3f4985abc",
            type: "Encounter"
          },
          effectiveDateTime: "2015-03-23T06:47:21+00:00",
          issued: "2017-01-18T09:11:21.000+00:00",
          valueQuantity: { value: 70.0 },
          referenceRange: [
            {
              low: { value: 10.0 },
              high: { value: 272.0 },
              type: {
                coding: [
                  {
                    system:
                      "http://terminology.hl7.org/CodeSystem/referencerange-meaning",
                    code: "treatment"
                  }
                ]
              }
            }
          ]
        }
      },
      {
        resource: {
          resourceType: "Observation",
          id: "e8284549-db13-40d4-8bab-41f8515f3002",
          status: "final",
          code: {
            coding: [
              { code: "5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" },
              { system: "http://loinc.org", code: "3141-9" },
              { system: "urn:oid:2.16.840.1.113883.3.7201", code: "5089" }
            ]
          },
          subject: {
            reference: "Patient/6c201864-7ec0-4baa-a686-295c2c69ff41",
            type: "Patient",
            identifier: {
              id: "3398f0fc-799b-4e98-816c-9bf0aa13b634",
              use: "official",
              system: "OpenMRS ID",
              value: "10040T"
            },
            display: "John Green(OpenMRS ID:10040T)"
          },
          encounter: {
            reference: "Encounter/d563da0a-9ce0-497b-8fcb-6df3f4985abc",
            type: "Encounter"
          },
          effectiveDateTime: "2015-03-23T06:47:21+00:00",
          issued: "2017-01-18T09:11:21.000+00:00",
          valueQuantity: { value: 203.0 },
          referenceRange: [
            {
              low: { value: 0.0 },
              high: { value: 250.0 },
              type: {
                coding: [
                  {
                    system:
                      "http://terminology.hl7.org/CodeSystem/referencerange-meaning",
                    code: "treatment"
                  }
                ]
              }
            }
          ]
        }
      },
      {
        resource: {
          resourceType: "Observation",
          id: "ff8a458f-4c67-469f-b232-b8e666ae89ad",
          status: "final",
          code: {
            coding: [
              { code: "5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" },
              { system: "http://loinc.org", code: "8302-2" },
              { system: "urn:oid:2.16.840.1.113883.3.7201", code: "5090" }
            ]
          },
          subject: {
            reference: "Patient/6c201864-7ec0-4baa-a686-295c2c69ff41",
            type: "Patient",
            identifier: {
              id: "3398f0fc-799b-4e98-816c-9bf0aa13b634",
              use: "official",
              system: "OpenMRS ID",
              value: "10040T"
            },
            display: "John Green(OpenMRS ID:10040T)"
          },
          encounter: {
            reference: "Encounter/a099e22d-1884-476d-85de-0eb604ac2a2e",
            type: "Encounter"
          },
          effectiveDateTime: "2016-01-22T06:56:22+00:00",
          issued: "2017-01-18T09:11:22.000+00:00",
          valueQuantity: { value: 99.0 },
          referenceRange: [
            {
              low: { value: 10.0 },
              high: { value: 272.0 },
              type: {
                coding: [
                  {
                    system:
                      "http://terminology.hl7.org/CodeSystem/referencerange-meaning",
                    code: "treatment"
                  }
                ]
              }
            }
          ]
        }
      },
      {
        resource: {
          resourceType: "Observation",
          id: "2a70a330-d6f1-4e0c-af44-cf90c1edde8b",
          status: "final",
          code: {
            coding: [
              { code: "5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" },
              { system: "http://loinc.org", code: "3141-9" },
              { system: "urn:oid:2.16.840.1.113883.3.7201", code: "5089" }
            ]
          },
          subject: {
            reference: "Patient/6c201864-7ec0-4baa-a686-295c2c69ff41",
            type: "Patient",
            identifier: {
              id: "3398f0fc-799b-4e98-816c-9bf0aa13b634",
              use: "official",
              system: "OpenMRS ID",
              value: "10040T"
            },
            display: "John Green(OpenMRS ID:10040T)"
          },
          encounter: {
            reference: "Encounter/a099e22d-1884-476d-85de-0eb604ac2a2e",
            type: "Encounter"
          },
          effectiveDateTime: "2016-01-22T06:56:22+00:00",
          issued: "2017-01-18T09:11:22.000+00:00",
          valueQuantity: { value: 172.0 },
          referenceRange: [
            {
              low: { value: 0.0 },
              high: { value: 250.0 },
              type: {
                coding: [
                  {
                    system:
                      "http://terminology.hl7.org/CodeSystem/referencerange-meaning",
                    code: "treatment"
                  }
                ]
              }
            }
          ]
        }
      },
      {
        resource: {
          resourceType: "Observation",
          id: "bd99933a-0823-49d7-8e93-7331b54fbfde",
          status: "final",
          code: {
            coding: [
              { code: "5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" },
              { system: "http://loinc.org", code: "8302-2" },
              { system: "urn:oid:2.16.840.1.113883.3.7201", code: "5090" }
            ]
          },
          subject: {
            reference: "Patient/6c201864-7ec0-4baa-a686-295c2c69ff41",
            type: "Patient",
            identifier: {
              id: "3398f0fc-799b-4e98-816c-9bf0aa13b634",
              use: "official",
              system: "OpenMRS ID",
              value: "10040T"
            },
            display: "John Green(OpenMRS ID:10040T)"
          },
          encounter: {
            reference: "Encounter/f2826b6d-f470-41ce-9314-bcd0dea653ea",
            type: "Encounter"
          },
          effectiveDateTime: "2015-08-09T06:40:23+00:00",
          issued: "2017-01-18T09:11:23.000+00:00",
          valueQuantity: { value: 150.0 },
          referenceRange: [
            {
              low: { value: 10.0 },
              high: { value: 272.0 },
              type: {
                coding: [
                  {
                    system:
                      "http://terminology.hl7.org/CodeSystem/referencerange-meaning",
                    code: "treatment"
                  }
                ]
              }
            }
          ]
        }
      },
      {
        resource: {
          resourceType: "Observation",
          id: "249c22f9-d866-465a-9b3d-68cfe6a9fd5b",
          status: "final",
          code: {
            coding: [
              { code: "5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" },
              { system: "http://loinc.org", code: "3141-9" },
              { system: "urn:oid:2.16.840.1.113883.3.7201", code: "5089" }
            ]
          },
          subject: {
            reference: "Patient/6c201864-7ec0-4baa-a686-295c2c69ff41",
            type: "Patient",
            identifier: {
              id: "3398f0fc-799b-4e98-816c-9bf0aa13b634",
              use: "official",
              system: "OpenMRS ID",
              value: "10040T"
            },
            display: "John Green(OpenMRS ID:10040T)"
          },
          encounter: {
            reference: "Encounter/f2826b6d-f470-41ce-9314-bcd0dea653ea",
            type: "Encounter"
          },
          effectiveDateTime: "2015-08-09T06:40:23+00:00",
          issued: "2017-01-18T09:11:23.000+00:00",
          valueQuantity: { value: 128.0 },
          referenceRange: [
            {
              low: { value: 0.0 },
              high: { value: 250.0 },
              type: {
                coding: [
                  {
                    system:
                      "http://terminology.hl7.org/CodeSystem/referencerange-meaning",
                    code: "treatment"
                  }
                ]
              }
            }
          ]
        }
      },
      {
        resource: {
          resourceType: "Observation",
          id: "cb60347c-4a5a-42df-896a-3383500a4bba",
          status: "final",
          code: {
            coding: [
              { code: "5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" },
              { system: "http://loinc.org", code: "8302-2" },
              { system: "urn:oid:2.16.840.1.113883.3.7201", code: "5090" }
            ]
          },
          subject: {
            reference: "Patient/6c201864-7ec0-4baa-a686-295c2c69ff41",
            type: "Patient",
            identifier: {
              id: "3398f0fc-799b-4e98-816c-9bf0aa13b634",
              use: "official",
              system: "OpenMRS ID",
              value: "10040T"
            },
            display: "John Green(OpenMRS ID:10040T)"
          },
          encounter: {
            reference: "Encounter/ed573f55-9870-4673-a309-ed17e9d6326e",
            type: "Encounter"
          },
          effectiveDateTime: "2016-10-30T06:22:24+00:00",
          issued: "2017-01-18T09:11:24.000+00:00",
          valueQuantity: { value: 193.0 },
          referenceRange: [
            {
              low: { value: 10.0 },
              high: { value: 272.0 },
              type: {
                coding: [
                  {
                    system:
                      "http://terminology.hl7.org/CodeSystem/referencerange-meaning",
                    code: "treatment"
                  }
                ]
              }
            }
          ]
        }
      },
      {
        resource: {
          resourceType: "Observation",
          id: "cba73f26-c6b5-4e94-90ef-f679768b59da",
          status: "final",
          code: {
            coding: [
              { code: "5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" },
              { system: "http://loinc.org", code: "3141-9" },
              { system: "urn:oid:2.16.840.1.113883.3.7201", code: "5089" }
            ]
          },
          subject: {
            reference: "Patient/6c201864-7ec0-4baa-a686-295c2c69ff41",
            type: "Patient",
            identifier: {
              id: "3398f0fc-799b-4e98-816c-9bf0aa13b634",
              use: "official",
              system: "OpenMRS ID",
              value: "10040T"
            },
            display: "John Green(OpenMRS ID:10040T)"
          },
          encounter: {
            reference: "Encounter/ed573f55-9870-4673-a309-ed17e9d6326e",
            type: "Encounter"
          },
          effectiveDateTime: "2016-10-30T06:22:24+00:00",
          issued: "2017-01-18T09:11:24.000+00:00",
          valueQuantity: { value: 26.0 },
          referenceRange: [
            {
              low: { value: 0.0 },
              high: { value: 250.0 },
              type: {
                coding: [
                  {
                    system:
                      "http://terminology.hl7.org/CodeSystem/referencerange-meaning",
                    code: "treatment"
                  }
                ]
              }
            }
          ]
        }
      },
      {
        resource: {
          resourceType: "Observation",
          id: "bf3ee835-61ea-4c32-9370-7427648f93ee",
          status: "final",
          code: {
            coding: [
              { code: "5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" },
              { system: "http://loinc.org", code: "8302-2" },
              { system: "urn:oid:2.16.840.1.113883.3.7201", code: "5090" }
            ]
          },
          subject: {
            reference: "Patient/6c201864-7ec0-4baa-a686-295c2c69ff41",
            type: "Patient",
            identifier: {
              id: "3398f0fc-799b-4e98-816c-9bf0aa13b634",
              use: "official",
              system: "OpenMRS ID",
              value: "10040T"
            },
            display: "John Green(OpenMRS ID:10040T)"
          },
          encounter: {
            reference: "Encounter/937c72c8-415a-45e0-9bda-8de70f0a6a0c",
            type: "Encounter"
          },
          effectiveDateTime: "2015-08-18T06:59:25+00:00",
          issued: "2017-01-18T09:11:25.000+00:00",
          valueQuantity: { value: 14.0 },
          referenceRange: [
            {
              low: { value: 10.0 },
              high: { value: 272.0 },
              type: {
                coding: [
                  {
                    system:
                      "http://terminology.hl7.org/CodeSystem/referencerange-meaning",
                    code: "treatment"
                  }
                ]
              }
            }
          ]
        }
      },
      {
        resource: {
          resourceType: "Observation",
          id: "2c46f65b-79f1-41f6-8b44-3972af23527c",
          status: "final",
          code: {
            coding: [
              { code: "5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" },
              { system: "http://loinc.org", code: "3141-9" },
              { system: "urn:oid:2.16.840.1.113883.3.7201", code: "5089" }
            ]
          },
          subject: {
            reference: "Patient/6c201864-7ec0-4baa-a686-295c2c69ff41",
            type: "Patient",
            identifier: {
              id: "3398f0fc-799b-4e98-816c-9bf0aa13b634",
              use: "official",
              system: "OpenMRS ID",
              value: "10040T"
            },
            display: "John Green(OpenMRS ID:10040T)"
          },
          encounter: {
            reference: "Encounter/937c72c8-415a-45e0-9bda-8de70f0a6a0c",
            type: "Encounter"
          },
          effectiveDateTime: "2015-08-18T06:59:25+00:00",
          issued: "2017-01-18T09:11:25.000+00:00",
          valueQuantity: { value: 11.0 },
          referenceRange: [
            {
              low: { value: 0.0 },
              high: { value: 250.0 },
              type: {
                coding: [
                  {
                    system:
                      "http://terminology.hl7.org/CodeSystem/referencerange-meaning",
                    code: "treatment"
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  }
};
