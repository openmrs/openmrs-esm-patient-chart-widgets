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
        immunizationUuid: "",
        vaccineName:
          mockPatientImmunizationWithoutSeries.resource.vaccineCode.coding[0]
            .display,
        manufacturer:
          mockPatientImmunizationWithoutSeries.resource.manufacturer,
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
        immunizationObsUuid: "",
        vaccineName:
          mockPatientImmunizationWithoutSeries.resource.vaccineCode.text,
        manufacturer:
          mockPatientImmunizationWithoutSeries.resource.manufacturer,
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
      expect(
        wrapper.getByText(
          "add Vaccine: " +
            mockPatientImmunizationWithSeries.resource.vaccineCode.text
        )
      ).toBeDefined();
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
        vaccineName:
          mockPatientImmunizationWithSeries.resource.vaccineCode.text,
        manufacturer: mockPatientImmunizationWithSeries.resource.manufacturer,
        expirationDate: "",
        vaccinationDate: "",
        lotNumber: "",
        isSeries: true,
        series: mockPatientImmunizationWithSeries.resource.series
      }
    ];
    wrapper = render(
      <BrowserRouter>
        <ImmunizationsForm match={match} />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(
        wrapper.getByText(
          "add Vaccine: " +
            mockPatientImmunizationWithSeries.resource.vaccineCode.text
        )
      ).toBeDefined();
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
        immunizationObsUuid: mockPatientImmunizationWithoutSeries.resource.uuid,
        vaccineName:
          mockPatientImmunizationWithoutSeries.resource.vaccineCode.coding[0]
            .display,
        manufacturer:
          mockPatientImmunizationWithoutSeries.resource.manufacturer,
        expirationDate:
          mockPatientImmunizationWithoutSeries.resource.expirationDate,
        vaccinationDate:
          mockPatientImmunizationWithoutSeries.resource.protocolApplied[0]
            .occurrenceDateTime,
        lotNumber: mockPatientImmunizationWithoutSeries.resource.lotNumber,
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
      expect(
        wrapper.getByText(
          "edit vaccine: " +
            mockPatientImmunizationWithSeries.resource.vaccineCode.coding[0]
              .display
        )
      ).toBeDefined();
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
        immunizationObsUuid: mockPatientImmunizationWithSeries.resource.uuid,
        vaccineName:
          mockPatientImmunizationWithoutSeries.resource.vaccineCode.coding[0]
            .display,
        manufacturer: mockPatientImmunizationWithSeries.resource.manufacturer,
        expirationDate:
          mockPatientImmunizationWithSeries.resource.expirationDate,
        vaccinationDate:
          mockPatientImmunizationWithSeries.resource.protocolApplied[0]
            .occurrenceDateTime,
        lotNumber: mockPatientImmunizationWithSeries.resource.lotNumber,
        isSeries: true,
        series: mockPatientImmunizationWithSeries.resource.series,
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
      expect(
        wrapper.getByText(
          "edit vaccine: " +
            mockPatientImmunizationWithSeries.resource.vaccineCode.coding[0]
              .display
        )
      ).toBeDefined();
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
