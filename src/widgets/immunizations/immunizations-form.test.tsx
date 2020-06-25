import React from "react";
import { BrowserRouter } from "react-router-dom";
import { cleanup, render, wait, fireEvent } from "@testing-library/react";
import { useCurrentPatient } from "@openmrs/esm-api";
import {
  mockPatientImmunizationWithSeries,
  mockPatientImmunizationWithoutSeries,
  patient
} from "../../../__mocks__/immunizations.mock";
import { ImmunizationsForm } from "./immunizations-form.component";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

describe("<ImmunizationsForm />", () => {
  let match = { params: {}, isExact: false, path: "/", url: "/" };
  let wrapper: any;

  mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
  afterEach(cleanup);

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
});
