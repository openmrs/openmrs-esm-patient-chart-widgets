import React from "react";
import { BrowserRouter } from "react-router-dom";
import { cleanup, render, wait, fireEvent } from "@testing-library/react";
import { useCurrentPatient } from "@openmrs/esm-api";
import { patient } from "../../../__mocks__/immunizations.mock";
import { ImmunizationsForm } from "./immunizations-form.component";
import { savePatientImmunization } from "./immunizations.resource";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockSavePatientImmunization = savePatientImmunization as jest.Mock;

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("./immunizations.resource", () => ({
  savePatientImmunization: jest.fn()
}));

describe("<ImmunizationsForm />", () => {
  let match = { params: {}, isExact: false, path: "/", url: "/" };
  let wrapper: any;

  mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
  afterEach(cleanup);
  afterEach(mockSavePatientImmunization.mockReset);

  it("renders immunization form without dying", async () => {
    match.params = [
      {
        vaccineName: "Rotavirus",
        manufacturer: { reference: "Organization/hl7" },
        expirationDate: "",
        vaccinationDate: "",
        lotNumber: "",
        isSeries: false
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

  it("displays the appropriate fields when adding a new immunization without series", async () => {
    match.params = [
      {
        vaccineName: "Rotavirus",
        manufacturer: {
          reference: "Organization/hl7"
        },
        expirationDate: "",
        vaccinationDate: "",
        lotNumber: "",
        isSeries: false
      }
    ];
    wrapper = render(
      <BrowserRouter>
        <ImmunizationsForm match={match} />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("add Vaccine: Rotavirus")).toBeDefined();
      expect(wrapper.queryByText("Series")).toBeNull();
      expect(wrapper.getByText("vaccination Date")).toBeDefined();
      expect(wrapper.getByText("expiration Date")).toBeDefined();
      expect(wrapper.getByText("lot number")).toBeDefined();
      expect(wrapper.getByText("manufacturer")).toBeDefined();
      expect(wrapper.getByText("cancel")).toBeDefined();
      expect(wrapper.getByText("save")).toBeDefined();
    });
  });

  it("displays the appropriate fields when adding a new immunization with series", async () => {
    match.params = [
      {
        immunizationObsUuid: "",
        vaccineName: "Rotavirus",
        manufacturer: { reference: "Organization/hl7" },
        expirationDate: "",
        vaccinationDate: "",
        lotNumber: "",
        isSeries: true,
        series: [
          { label: "2 Months", value: 1 },
          { label: "4 Months", value: 2 },
          { label: "6 Months", value: 3 }
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
      expect(wrapper.getByText("add Vaccine: " + "Rotavirus")).toBeDefined();
      expect(wrapper.getByText("vaccination Date")).toBeDefined();
      expect(wrapper.getByText("expiration Date")).toBeDefined();
      expect(wrapper.getByText("lot number")).toBeDefined();
      expect(wrapper.getByText("series")).toBeDefined();
      expect(wrapper.getByText("manufacturer")).toBeDefined();
      expect(wrapper.getByText("cancel")).toBeDefined();
      expect(wrapper.getByText("save")).toBeDefined();
    });
  });

  it("displays the appropriate fields and values when editing an existing immunization without series", async () => {
    match.params = [
      {
        immunizationObsUuid: "b9c21a82-aed3-11ea-b3de-0242ac130004",
        vaccineName: "Rotavirus",
        manufacturer: {
          reference: "Organization/hl7"
        },
        expirationDate: "2018-12-15",
        vaccinationDate: "2018-06-18",
        lotNumber: "PT123F",
        isSeries: false
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
      expect(wrapper.getByText("vaccination Date")).toBeDefined();
      expect(wrapper.getByText("expiration Date")).toBeDefined();
      expect(wrapper.getByText("lot number")).toBeDefined();
      expect(wrapper.getByText("manufacturer")).toBeDefined();
      expect(wrapper.getByText("cancel")).toBeDefined();
      expect(wrapper.getByText("save")).toBeDefined();
    });
  });

  it("displays the appropriate fields and values when editing an existing immunization with series", async () => {
    match.params = [
      {
        immunizationObsUuid: "b9c21a82-aed3-11ea-b3de-0242ac130004",
        vaccineName: "Rotavirus",
        manufacturer: { reference: "Organization/hl7" },
        expirationDate: "2018-12-15",
        vaccinationDate: "2018-06-18",
        lotNumber: "PT123F",
        isSeries: true,
        series: [
          { label: "2 Months", value: 1 },
          { label: "4 Months", value: 2 },
          { label: "6 Months", value: 3 }
        ],
        currentDose: { label: "2 Months", value: 1 }
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
      expect(wrapper.getByText("vaccination Date")).toBeDefined();
      expect(wrapper.getByText("expiration Date")).toBeDefined();
      expect(wrapper.getByText("lot number")).toBeDefined();
      expect(wrapper.getByText("series")).toBeDefined();
      expect(wrapper.getByText("manufacturer")).toBeDefined();
      expect(wrapper.getByText("cancel")).toBeDefined();
      expect(wrapper.getByText("save")).toBeDefined();
    });
  });

  it("should have save button disabled unless data entered", async () => {
    mockSavePatientImmunization.mockResolvedValue({ status: 200 });
    match.params = [
      {
        vaccineName: "Rotavirus",
        isSeries: false
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
        vaccineName: "Rotavirus",
        isSeries: false
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

  it("makes a call to create new immnunization without series", async () => {
    jest.setTimeout(10000);
    mockSavePatientImmunization.mockResolvedValue({ status: 200 });
    match.params = [
      {
        vaccineName: "Rotavirus",
        vaccineUuid: "RotavirusUuid",
        isSeries: false
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
      expect(firstArgument.resource.resourceType).toBe("Immunization");
      expect(firstArgument.resource.id).toBeUndefined();
      expect(firstArgument.resource.vaccineCode.coding[0].display).toBe(
        "Rotavirus"
      );
      expect(firstArgument.resource.vaccineCode.coding[0].code).toBe(
        "RotavirusUuid"
      );
      expect(firstArgument.resource.patient.id).toBe(patient.id);

      expect(firstArgument.resource.encounter).toBeTruthy();
      expect(firstArgument.resource.encounter.id).toBeUndefined();

      expect(firstArgument.resource.location).toBeTruthy();
      expect(firstArgument.resource.manufacturer.reference).toBe("XYTR4");
      expect(firstArgument.resource.lotNumber).toBe("09876");

      expect(
        firstArgument.resource.protocolApplied[0].protocol.series
      ).toBeUndefined();
      expect(
        firstArgument.resource.protocolApplied[0].protocol.doseNumberPositiveInt
      ).toBeUndefined();
      expect(
        firstArgument.resource.protocolApplied[0].protocol.occurrenceDateTime
      ).toBe("2020-06-15");
      expect(
        firstArgument.resource.protocolApplied[0].protocol.expirationDate
      ).toBe("2020-06-30");

      const secondArgument = mockSavePatientImmunization.mock.calls[0][1];
      expect(secondArgument).toBe(patient.id);

      const thirdArgument = mockSavePatientImmunization.mock.calls[0][2];
      expect(thirdArgument).toBeUndefined();
    });
  });
});
