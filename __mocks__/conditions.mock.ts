import { Condition } from "../src/widgets/conditions/conditions.resource";

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

export const mockPatientConditionsResult: Condition[] = [
  {
    clinicalStatus: "active",
    conceptId: "160148AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Malaria, confirmed",
    onsetDateTime: "2019-11-04T00:00:00+00:00",
    recordedDate: "2019-11-04T04:49:28+00:00",
    id: "1e9160ee-8927-409c-b8f3-346c9736f8d7"
  },
  {
    clinicalStatus: "active",
    conceptId: "116128AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Anaemia",
    onsetDateTime: "2019-02-28T00:00:00+00:00",
    recordedDate: "2019-02-28T11:15:22+00:00",
    id: "5be1a412-406a-43ed-a2de-d4995884baa1"
  },
  {
    clinicalStatus: "active",
    conceptId: "116128AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Anosmia",
    onsetDateTime: "2020-10-01T00:00:00+00:00",
    recordedDate: "2020-10-25T09:36:55+00:00",
    id: "1a790e53-2ff5-4689-9ea7-d7da8cca367e"
  },
  {
    clinicalStatus: "active",
    conceptId: "160161AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Generalized Skin Infection due to AIDS",
    onsetDateTime: "2020-06-30T00:00:00+00:00",
    recordedDate: "2020-06-19T06:41:25+00:00",
    id: "43578769-f1a4-46af-b08b-d9fe8a07066f"
  },
  {
    clinicalStatus: "inactive",
    conceptId: "512AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Rash",
    onsetDateTime: "2019-06-19T00:00:00+00:00",
    recordedDate: "2019-06-19T06:40:22+00:00",
    id: "37d2ed09-a85f-44b3-9e4e-dd77b3f4dacd"
  },
  {
    clinicalStatus: "active",
    conceptId: "143264AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Cough",
    onsetDateTime: "2020-01-19T00:00:00+00:00",
    recordedDate: "2020-01-19T06:43:01+00:00",
    id: "2a7c1279-407d-43f4-af87-5a59562ec2c9"
  }
];

export const mockPatientConditionResult: Condition =
  mockPatientConditionsResult[0];
