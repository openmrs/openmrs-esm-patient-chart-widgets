export const mockDimensionsResponse = [
  {
    id: "bb1f0b1c-99c3-4be3-ac4b-c4086523ca5c",
    weight: 85,
    height: 165,
    date: "15-Apr 02:11 PM",
    bmi: "31.2",
    obsData: {
      weight: {
        resourceType: "Observation",
        id: "6113f91d-e30c-4b65-a8d8-cc04dd7b1db3",
        status: "final",
        code: {
          coding: [
            {
              code: "5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
            },
            {
              system: "http://loinc.org",
              code: "3141-9"
            },
            {
              system: "urn:oid:2.16.840.1.113883.3.7201",
              code: "5089"
            }
          ]
        },
        subject: {
          reference: "Patient/8673ee4f-e2ab-4077-ba55-4980f408773e",
          type: "Patient",
          identifier: {
            id: "1f0ad7a1-430f-4397-b571-59ea654a52db",
            use: "official",
            system: "Old Identification Number",
            value: "100GEJ"
          },
          display: "John Wilson(Old Identification Number:100GEJ)"
        },
        encounter: {
          reference: "Encounter/bb1f0b1c-99c3-4be3-ac4b-c4086523ca5c",
          type: "Encounter"
        },
        effectiveDateTime: "2020-04-15T11:11:00+00:00",
        issued: "2020-04-15T11:11:47.000+00:00",
        valueQuantity: {
          value: 85
        },
        referenceRange: [
          {
            low: {
              value: 0
            },
            high: {
              value: 250
            },
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
      },
      height: {
        resourceType: "Observation",
        id: "a9c8f158-ec10-4258-bc16-9d9593a8d0ce",
        status: "final",
        code: {
          coding: [
            {
              code: "5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
            },
            {
              system: "http://loinc.org",
              code: "8302-2"
            },
            {
              system: "urn:oid:2.16.840.1.113883.3.7201",
              code: "5090"
            }
          ]
        },
        subject: {
          reference: "Patient/8673ee4f-e2ab-4077-ba55-4980f408773e",
          type: "Patient",
          identifier: {
            id: "1f0ad7a1-430f-4397-b571-59ea654a52db",
            use: "official",
            system: "Old Identification Number",
            value: "100GEJ"
          },
          display: "John Wilson(Old Identification Number:100GEJ)"
        },
        encounter: {
          reference: "Encounter/bb1f0b1c-99c3-4be3-ac4b-c4086523ca5c",
          type: "Encounter"
        },
        effectiveDateTime: "2020-04-15T11:11:00+00:00",
        issued: "2020-04-15T11:11:47.000+00:00",
        valueQuantity: {
          value: 165
        },
        referenceRange: [
          {
            low: {
              value: 10
            },
            high: {
              value: 272
            },
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
  },
  {
    id: "51cd7805-1171-491c-823f-c67afce84614",
    weight: 80,
    height: 165,
    date: "13-Apr 03:09 PM",
    bmi: "29.4",
    obsData: {
      weight: {
        resourceType: "Observation",
        id: "74c2eea2-6d4c-447b-8378-fc4ba9ed9822",
        status: "final",
        code: {
          coding: [
            {
              code: "5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
            },
            {
              system: "http://loinc.org",
              code: "3141-9"
            },
            {
              system: "urn:oid:2.16.840.1.113883.3.7201",
              code: "5089"
            }
          ]
        },
        subject: {
          reference: "Patient/8673ee4f-e2ab-4077-ba55-4980f408773e",
          type: "Patient",
          identifier: {
            id: "1f0ad7a1-430f-4397-b571-59ea654a52db",
            use: "official",
            system: "Old Identification Number",
            value: "100GEJ"
          },
          display: "John Wilson(Old Identification Number:100GEJ)"
        },
        encounter: {
          reference: "Encounter/4a7b1330-14f9-41fc-9207-29b682cae2ef",
          type: "Encounter"
        },
        effectiveDateTime: "2020-04-06T12:08:00+00:00",
        issued: "2020-04-06T12:09:00.000+00:00",
        valueQuantity: {
          value: 80
        },
        referenceRange: [
          {
            low: {
              value: 0
            },
            high: {
              value: 250
            },
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
      },
      height: {
        resourceType: "Observation",
        id: "f92d7356-ac11-4f93-9558-30f2b221f24e",
        status: "final",
        code: {
          coding: [
            {
              code: "5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
            },
            {
              system: "http://loinc.org",
              code: "8302-2"
            },
            {
              system: "urn:oid:2.16.840.1.113883.3.7201",
              code: "5090"
            }
          ]
        },
        subject: {
          reference: "Patient/8673ee4f-e2ab-4077-ba55-4980f408773e",
          type: "Patient",
          identifier: {
            id: "1f0ad7a1-430f-4397-b571-59ea654a52db",
            use: "official",
            system: "Old Identification Number",
            value: "100GEJ"
          },
          display: "John Wilson(Old Identification Number:100GEJ)"
        },
        encounter: {
          reference: "Encounter/4a7b1330-14f9-41fc-9207-29b682cae2ef",
          type: "Encounter"
        },
        effectiveDateTime: "2020-04-06T12:08:00+00:00",
        issued: "2020-04-06T12:09:00.000+00:00",
        valueQuantity: {
          value: 165
        },
        referenceRange: [
          {
            low: {
              value: 10
            },
            high: {
              value: 272
            },
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
  },
  {
    id: "49fbba96-08eb-4b22-83f8-84753a15e70d",
    height: 186,
    date: "09-Apr 11:47 AM",
    bmi: null,
    obsData: {
      height: {
        resourceType: "Observation",
        id: "670dbe9b-2b78-4034-86d5-fe4b8fefbae0",
        status: "final",
        code: {
          coding: [
            {
              code: "5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
            },
            {
              system: "http://loinc.org",
              code: "8302-2"
            },
            {
              system: "urn:oid:2.16.840.1.113883.3.7201",
              code: "5090"
            }
          ]
        },
        subject: {
          reference: "Patient/8673ee4f-e2ab-4077-ba55-4980f408773e",
          type: "Patient",
          identifier: {
            id: "1f0ad7a1-430f-4397-b571-59ea654a52db",
            use: "official",
            system: "Old Identification Number",
            value: "100GEJ"
          },
          display: "John Wilson(Old Identification Number:100GEJ)"
        },
        encounter: {
          reference: "Encounter/b6402741-38aa-4ffc-8b42-fac76a541778",
          type: "Encounter"
        },
        effectiveDateTime: "2020-04-06T08:47:00+00:00",
        issued: "2020-04-06T08:47:53.000+00:00",
        valueQuantity: {
          value: 186
        },
        referenceRange: [
          {
            low: {
              value: 10
            },
            high: {
              value: 272
            },
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
  },
  {
    id: "e0f11a7e-31ab-4251-ac03-85a52be41c59",
    weight: 80,
    date: "06-Apr 11:47 AM",
    bmi: null,
    obsData: {
      weight: {
        resourceType: "Observation",
        id: "844882ec-e42a-44d0-8f10-af5409ec2202",
        status: "final",
        code: {
          coding: [
            {
              code: "5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
            },
            {
              system: "http://loinc.org",
              code: "3141-9"
            },
            {
              system: "urn:oid:2.16.840.1.113883.3.7201",
              code: "5089"
            }
          ]
        },
        subject: {
          reference: "Patient/8673ee4f-e2ab-4077-ba55-4980f408773e",
          type: "Patient",
          identifier: {
            id: "1f0ad7a1-430f-4397-b571-59ea654a52db",
            use: "official",
            system: "Old Identification Number",
            value: "100GEJ"
          },
          display: "John Wilson(Old Identification Number:100GEJ)"
        },
        encounter: {
          reference: "Encounter/b6402741-38aa-4ffc-8b42-fac76a541778",
          type: "Encounter"
        },
        effectiveDateTime: "2020-04-06T08:47:00+00:00",
        issued: "2020-04-06T08:47:52.000+00:00",
        valueQuantity: {
          value: 80
        },
        referenceRange: [
          {
            low: {
              value: 0
            },
            high: {
              value: 250
            },
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
  },
  {
    id: "c0d589e9-a50a-4bd1-b1c2-fccfafcbb9d9",
    weight: 80,
    date: "02-Apr 02:00 AM",
    bmi: null,
    obsData: {
      weight: {
        resourceType: "Observation",
        id: "a5ccbbb1-5ace-4c47-ae71-a79ec1afb76e",
        status: "final",
        code: {
          coding: [
            {
              code: "5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
            },
            {
              system: "http://loinc.org",
              code: "3141-9"
            },
            {
              system: "urn:oid:2.16.840.1.113883.3.7201",
              code: "5089"
            }
          ]
        },
        subject: {
          reference: "Patient/8673ee4f-e2ab-4077-ba55-4980f408773e",
          type: "Patient",
          identifier: {
            id: "1f0ad7a1-430f-4397-b571-59ea654a52db",
            use: "official",
            system: "Old Identification Number",
            value: "100GEJ"
          },
          display: "John Wilson(Old Identification Number:100GEJ)"
        },
        encounter: {
          reference: "Encounter/fb8948ad-e984-496f-98dd-315265bc2a93",
          type: "Encounter"
        },
        effectiveDateTime: "2020-04-01T23:00:00+00:00",
        issued: "2020-04-01T23:00:29.000+00:00",
        valueQuantity: {
          value: 80
        },
        referenceRange: [
          {
            low: {
              value: 0
            },
            high: {
              value: 250
            },
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
  },
  {
    id: "3c312c0c-a914-47b7-a2c1-ca0a5e40da5a",
    weight: 70,
    height: 185,
    date: "30-Mar 03:38 PM",
    bmi: "20.5",
    obsData: {
      weight: {
        resourceType: "Observation",
        id: "403f84a5-da85-41c5-820f-64a6a0e55ea4",
        status: "final",
        code: {
          coding: [
            {
              code: "5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
            },
            {
              system: "http://loinc.org",
              code: "3141-9"
            },
            {
              system: "urn:oid:2.16.840.1.113883.3.7201",
              code: "5089"
            }
          ]
        },
        subject: {
          reference: "Patient/8673ee4f-e2ab-4077-ba55-4980f408773e",
          type: "Patient",
          identifier: {
            id: "1f0ad7a1-430f-4397-b571-59ea654a52db",
            use: "official",
            system: "Old Identification Number",
            value: "100GEJ"
          },
          display: "John Wilson(Old Identification Number:100GEJ)"
        },
        encounter: {
          reference: "Encounter/fdec10a2-4acc-4ca3-807a-2a1d5ed3061c",
          type: "Encounter"
        },
        effectiveDateTime: "2020-03-30T12:32:00+00:00",
        issued: "2020-03-30T12:38:56.000+00:00",
        valueQuantity: {
          value: 70
        },
        referenceRange: [
          {
            low: {
              value: 0
            },
            high: {
              value: 250
            },
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
      },
      height: {
        resourceType: "Observation",
        id: "89eba397-ecf0-47fa-9a40-9e44724a556f",
        status: "final",
        code: {
          coding: [
            {
              code: "5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
            },
            {
              system: "http://loinc.org",
              code: "8302-2"
            },
            {
              system: "urn:oid:2.16.840.1.113883.3.7201",
              code: "5090"
            }
          ]
        },
        subject: {
          reference: "Patient/8673ee4f-e2ab-4077-ba55-4980f408773e",
          type: "Patient",
          identifier: {
            id: "1f0ad7a1-430f-4397-b571-59ea654a52db",
            use: "official",
            system: "Old Identification Number",
            value: "100GEJ"
          },
          display: "John Wilson(Old Identification Number:100GEJ)"
        },
        encounter: {
          reference: "Encounter/fdec10a2-4acc-4ca3-807a-2a1d5ed3061c",
          type: "Encounter"
        },
        effectiveDateTime: "2020-03-30T12:32:00+00:00",
        issued: "2020-03-30T12:38:56.000+00:00",
        valueQuantity: {
          value: 185
        },
        referenceRange: [
          {
            low: {
              value: 10
            },
            high: {
              value: 272
            },
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
  }
];
