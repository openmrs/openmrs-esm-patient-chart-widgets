import React from "react";
import { BrowserRouter } from "react-router-dom";
import { cleanup, fireEvent, render, wait } from "@testing-library/react";
import { useCurrentPatient, openmrsObservableFetch } from "@openmrs/esm-api";
import { patient } from "../../../__mocks__/immunizations.mock";
import { ImmunizationsForm } from "./immunizations-form.component";
import { savePatientImmunization } from "./immunizations.resource";
import dayjs from "dayjs";
import { getStartedVisit, visitItem } from "../visit/visit-utils";
import { of } from "rxjs";
import { mockSessionDataResponse } from "../../../__mocks__/session.mock";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockSavePatientImmunization = savePatientImmunization as jest.Mock;
const mockOpenmrsObservableFetch = openmrsObservableFetch as jest.Mock;

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn(),
  openmrsObservableFetch: jest.fn()
}));

jest.mock("./immunizations.resource", () => ({
  savePatientImmunization: jest.fn()
}));

describe("<ImmunizationsForm />", () => {
  let match = { params: {}, isExact: false, path: "/", url: "/" };
  let wrapper: any;

  getStartedVisit.getValue = function() {
    const mockVisitItem: visitItem = {
      visitData: { uuid: "visitUuid" }
    };
    return mockVisitItem;
  };
  mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
  mockOpenmrsObservableFetch.mockImplementation(() =>
    of(mockSessionDataResponse)
  );

  afterEach(cleanup);
  afterEach(mockSavePatientImmunization.mockReset);

  it("renders immunization form without dying", async () => {
    match.params = [
      {
        vaccineName: "Rotavirus"
      }
    ];
    wrapper = render(
      <BrowserRouter>
        <ImmunizationsForm match={match} />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
    });
  });

  it("displays the appropriate fields when adding a new immunization without sequence", async () => {
    match.params = [
      {
        vaccineName: "Rotavirus"
      }
    ];
    wrapper = render(
      <BrowserRouter>
        <ImmunizationsForm match={match} />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("add vaccine: Rotavirus")).toBeDefined();
      expect(wrapper.queryByText("sequence")).toBeNull();
      expect(wrapper.getByText("vaccination date")).toBeDefined();
      expect(wrapper.getByText("expiration date")).toBeDefined();
      expect(wrapper.getByText("lot number")).toBeDefined();
      expect(wrapper.getByText("manufacturer")).toBeDefined();
      expect(wrapper.getByText("cancel")).toBeDefined();
      expect(wrapper.getByText("save")).toBeDefined();
    });
  });

  it("displays the appropriate fields when adding a new immunization with sequence", async () => {
    match.params = [
      {
        vaccineName: "Rotavirus",
        sequences: [
          { sequenceLabel: "2 Months", sequenceNumber: 1 },
          { sequenceLabel: "4 Months", sequenceNumber: 2 },
          { sequenceLabel: "6 Months", sequenceNumber: 3 }
        ]
      }
    ];
    wrapper = render(
      <BrowserRouter>
        <ImmunizationsForm match={match} />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("add vaccine: " + "Rotavirus")).toBeDefined();
      expect(wrapper.getByText("vaccination date")).toBeDefined();
      expect(wrapper.getByText("expiration date")).toBeDefined();
      expect(wrapper.getByText("lot number")).toBeDefined();
      expect(wrapper.getByText("sequence")).toBeDefined();
      expect(wrapper.getByText("manufacturer")).toBeDefined();
      expect(wrapper.getByText("cancel")).toBeDefined();
      expect(wrapper.getByText("save")).toBeDefined();
    });
  });

  it("displays the appropriate fields and values when editing an existing immunization without sequence", async () => {
    match.params = [
      {
        immunizationObsUuid: "b9c21a82-aed3-11ea-b3de-0242ac130004",
        vaccineName: "Rotavirus",
        manufacturer: "Organization/hl7",
        expirationDate: "2018-12-15",
        vaccinationDate: "2018-06-18",
        lotNumber: "12345"
      }
    ];
    wrapper = render(
      <BrowserRouter>
        <ImmunizationsForm match={match} />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("edit vaccine: Rotavirus")).toBeDefined();
      expect(wrapper.getByTestId("vaccinationDateInput").value).toBe(
        "2018-06-18"
      );
      expect(wrapper.getByTestId("vaccinationExpirationInput").value).toBe(
        "2018-12-15"
      );
      expect(wrapper.getByTestId("lotNumberInput").value).toBe("12345");
      expect(wrapper.getByTestId("manufacturerInput").value).toBe(
        "Organization/hl7"
      );
      expect(wrapper.getByText("cancel")).toBeDefined();
      expect(wrapper.getByText("save")).toBeDefined();
    });
  });

  it("displays the appropriate fields and values when editing an existing immunization with sequence", async () => {
    match.params = [
      {
        immunizationObsUuid: "b9c21a82-aed3-11ea-b3de-0242ac130004",
        vaccineName: "Rotavirus",
        manufacturer: "Organization/hl7",
        expirationDate: "2018-12-15",
        vaccinationDate: "2018-06-18",
        lotNumber: "12345",
        sequences: [
          { sequenceLabel: "2 Months", sequenceNumber: 1 },
          { sequenceLabel: "4 Months", sequenceNumber: 2 },
          { sequenceLabel: "6 Months", sequenceNumber: 3 }
        ],
        currentDose: { sequenceLabel: "2 Months", sequenceNumber: 1 }
      }
    ];
    wrapper = render(
      <BrowserRouter>
        <ImmunizationsForm match={match} />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("edit vaccine: Rotavirus")).toBeDefined();
      expect(wrapper.getByText("2 Months").value).toBeDefined();
      expect(wrapper.getByLabelText("sequence").value).toBe("1");
      expect(wrapper.getByTestId("vaccinationDateInput").value).toBe(
        "2018-06-18"
      );
      expect(wrapper.getByTestId("vaccinationExpirationInput").value).toBe(
        "2018-12-15"
      );
      expect(wrapper.getByTestId("lotNumberInput").value).toBe("12345");
      expect(wrapper.getByTestId("manufacturerInput").value).toBe(
        "Organization/hl7"
      );
      expect(wrapper.getByText("cancel")).toBeDefined();
      expect(wrapper.getByText("save")).toBeDefined();
    });
  });

  it("should have save button disabled unless data entered", async () => {
    mockSavePatientImmunization.mockResolvedValue({ status: 200 });
    match.params = [
      {
        vaccineName: "Rotavirus"
      }
    ];
    wrapper = render(
      <BrowserRouter>
        <ImmunizationsForm match={match} />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("save")).toBeDisabled();
    });
  });

  it("should enable save button when mandatory fields are selected", async () => {
    mockSavePatientImmunization.mockResolvedValue({ status: 200 });
    match.params = [
      {
        vaccineName: "Rotavirus"
      }
    ];
    wrapper = render(
      <BrowserRouter>
        <ImmunizationsForm match={match} />
      </BrowserRouter>
    );

    await wait(() => {
      const vaccinationDate = wrapper.getByTestId("vaccinationDateInput");
      fireEvent.change(vaccinationDate, { target: { value: "2020-06-15" } });
      expect(wrapper.getByText("save")).toBeEnabled();
    });
  });

  it("makes a call to create new immnunization without sequence", async () => {
    mockSavePatientImmunization.mockResolvedValue({ status: 200 });
    match.params = [
      {
        vaccineName: "Rotavirus",
        vaccineUuid: "RotavirusUuid"
      }
    ];
    wrapper = render(
      <BrowserRouter>
        <ImmunizationsForm match={match} />
      </BrowserRouter>
    );

    await wait(() => {
      const vaccinationDate = wrapper.getByTestId("vaccinationDateInput");
      fireEvent.change(vaccinationDate, { target: { value: "2020-06-15" } });

      const vaccinationExpiration = wrapper.getByTestId(
        "vaccinationExpirationInput"
      );
      fireEvent.change(vaccinationExpiration, {
        target: { value: "2020-06-30" }
      });

      const lotNumber = wrapper.getByTestId("lotNumberInput");
      fireEvent.change(lotNumber, { target: { value: "09876" } });

      const manufacturer = wrapper.getByTestId("manufacturerInput");
      fireEvent.change(manufacturer, { target: { value: "XYTR4" } });

      fireEvent.submit(wrapper.getByTestId("immunization-form"));
      expect(mockSavePatientImmunization).toBeCalled();

      const firstArgument = mockSavePatientImmunization.mock.calls[0][0];
      expectImmunization(
        firstArgument,
        undefined,
        "visitUuid",
        undefined,
        undefined,
        "09876"
      );

      const secondArgument = mockSavePatientImmunization.mock.calls[0][1];
      expect(secondArgument).toBe(patient.id);

      const thirdArgument = mockSavePatientImmunization.mock.calls[0][2];
      expect(thirdArgument).toBeUndefined();
    });
  });

  it("makes a call to create new immnunization with sequence", async () => {
    mockSavePatientImmunization.mockResolvedValue({ status: 200 });
    match.params = [
      {
        vaccineName: "Rotavirus",
        vaccineUuid: "RotavirusUuid",
        sequences: [
          { sequenceLabel: "2 Months", sequenceNumber: 1 },
          { sequenceLabel: "4 Months", sequenceNumber: 2 },
          { sequenceLabel: "6 Months", sequenceNumber: 3 }
        ]
      }
    ];
    wrapper = render(
      <BrowserRouter>
        <ImmunizationsForm match={match} />
      </BrowserRouter>
    );

    await wait(() => {
      const sequence = wrapper.getByLabelText("sequence");
      fireEvent.change(sequence, { target: { value: 2 } });

      const vaccinationDate = wrapper.getByTestId("vaccinationDateInput");
      fireEvent.change(vaccinationDate, { target: { value: "2020-06-15" } });

      const vaccinationExpiration = wrapper.getByTestId(
        "vaccinationExpirationInput"
      );
      fireEvent.change(vaccinationExpiration, {
        target: { value: "2020-06-30" }
      });

      const lotNumber = wrapper.getByTestId("lotNumberInput");
      fireEvent.change(lotNumber, { target: { value: "09876" } });

      const manufacturer = wrapper.getByTestId("manufacturerInput");
      fireEvent.change(manufacturer, { target: { value: "XYTR4" } });

      fireEvent.submit(wrapper.getByTestId("immunization-form"));
      expect(mockSavePatientImmunization).toBeCalled();

      const firstArgument = mockSavePatientImmunization.mock.calls[0][0];
      expectImmunization(
        firstArgument,
        undefined,
        "visitUuid",
        "4 Months",
        2,
        "09876"
      );

      const secondArgument = mockSavePatientImmunization.mock.calls[0][1];
      expect(secondArgument).toBe(patient.id);

      const thirdArgument = mockSavePatientImmunization.mock.calls[0][2];
      expect(thirdArgument).toBeUndefined();
    });
  });
  it("should have save button disabled unless data changed in edit mode", async () => {
    mockSavePatientImmunization.mockResolvedValue({ status: 200 });
    match.params = [
      {
        immunizationObsUuid: "b9c21a82-aed3-11ea-b3de-0242ac130004",
        vaccineName: "Rotavirus",
        manufacturer: { reference: "Organization/hl7" },
        expirationDate: "2018-12-15",
        vaccinationDate: "2018-06-18",
        lotNumber: "PT123F",
        sequence: [
          { sequenceLabel: "2 Months", sequenceNumber: 1 },
          { sequenceLabel: "4 Months", sequenceNumber: 2 },
          { sequenceLabel: "6 Months", sequenceNumber: 3 }
        ],
        currentDose: { sequenceLabel: "2 Months", sequenceNumber: 1 }
      }
    ];
    wrapper = render(
      <BrowserRouter>
        <ImmunizationsForm match={match} />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("save")).toBeDisabled();
    });
  });

  it("should enable save button when data is changed in edit mode", async () => {
    mockSavePatientImmunization.mockResolvedValue({ status: 200 });
    match.params = [
      {
        immunizationObsUuid: "b9c21a82-aed3-11ea-b3de-0242ac130004",
        vaccineName: "Rotavirus",
        manufacturer: { reference: "Organization/hl7" },
        expirationDate: "2018-12-15",
        vaccinationDate: "2018-06-18",
        lotNumber: "PT123F",
        sequence: [
          { sequenceLabel: "2 Months", sequenceNumber: 1 },
          { sequenceLabel: "4 Months", sequenceNumber: 2 },
          { sequenceLabel: "6 Months", sequenceNumber: 3 }
        ],
        currentDose: { sequenceLabel: "2 Months", sequenceNumber: 1 }
      }
    ];
    wrapper = render(
      <BrowserRouter>
        <ImmunizationsForm match={match} />
      </BrowserRouter>
    );

    await wait(() => {
      const vaccinationDate = wrapper.getByTestId("vaccinationDateInput");
      fireEvent.change(vaccinationDate, { target: { value: "2020-06-15" } });
      expect(wrapper.getByText("save")).toBeEnabled();
    });
  });

  it("makes a call to edit existing immnunization with sequence", async () => {
    mockSavePatientImmunization.mockResolvedValue({ status: 200 });
    match.params = [
      {
        immunizationObsUuid: "b9c21a82-aed3-11ea-b3de-0242ac130004",
        vaccineName: "Rotavirus",
        vaccineUuid: "RotavirusUuid",
        manufacturer: "XYTR4",
        expirationDate: "2020-06-30",
        vaccinationDate: "2020-06-15",
        lotNumber: "PT123F",
        sequences: [
          { sequenceLabel: "2 Months", sequenceNumber: 1 },
          { sequenceLabel: "4 Months", sequenceNumber: 2 },
          { sequenceLabel: "6 Months", sequenceNumber: 3 }
        ],
        currentDose: { sequenceLabel: "2 Months", sequenceNumber: 1 }
      }
    ];
    wrapper = render(
      <BrowserRouter>
        <ImmunizationsForm match={match} />
      </BrowserRouter>
    );

    await wait(() => {
      const lotNumber = wrapper.getByTestId("lotNumberInput");
      fireEvent.change(lotNumber, { target: { value: "12345" } });

      fireEvent.submit(wrapper.getByTestId("immunization-form"));
      expect(mockSavePatientImmunization).toBeCalled();

      const firstArgument = mockSavePatientImmunization.mock.calls[0][0];
      expectImmunization(
        firstArgument,
        "b9c21a82-aed3-11ea-b3de-0242ac130004",
        "visitUuid",
        "2 Months",
        1,
        "12345"
      );

      const secondArgument = mockSavePatientImmunization.mock.calls[0][1];
      expect(secondArgument).toBe(patient.id);

      const thirdArgument = mockSavePatientImmunization.mock.calls[0][2];
      expect(thirdArgument).toBe("b9c21a82-aed3-11ea-b3de-0242ac130004");
    });
  });
});

function expectImmunization(
  immunizationParam,
  immunizationObsUuid,
  expectedEncounterUuid,
  expectedSeries,
  sequenceNumber,
  expectedLotNumer: string
) {
  expect(immunizationParam.resource.resourceType).toBe("Immunization");
  expect(immunizationParam.resource.id).toBe(immunizationObsUuid);
  expect(immunizationParam.resource.vaccineCode.coding[0].display).toBe(
    "Rotavirus"
  );
  expect(immunizationParam.resource.vaccineCode.coding[0].code).toBe(
    "RotavirusUuid"
  );
  expect(immunizationParam.resource.patient.id).toBe(patient.id);

  expect(immunizationParam.resource.encounter).toBeTruthy();
  expect(immunizationParam.resource.encounter.id).toBe(expectedEncounterUuid);

  expect(immunizationParam.resource.location).toBeTruthy();
  expect(immunizationParam.resource.manufacturer.reference).toBe("XYTR4");
  expect(immunizationParam.resource.lotNumber).toBe(expectedLotNumer);

  expect(immunizationParam.resource.protocolApplied[0].protocol.series).toBe(
    expectedSeries
  );
  expect(
    immunizationParam.resource.protocolApplied[0].protocol.doseNumberPositiveInt
  ).toBe(sequenceNumber);
  expect(
    immunizationParam.resource.protocolApplied[0].protocol.occurrenceDateTime.toISOString()
  ).toBe(dayjs("2020-06-15").toISOString());
  expect(
    immunizationParam.resource.protocolApplied[0].protocol.expirationDate.toISOString()
  ).toBe(dayjs("2020-06-30").toISOString());
}
