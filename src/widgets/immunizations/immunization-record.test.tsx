import React from "react";
import { getImmunizationByUuid } from "./immunizations.resource";
import { render, cleanup, wait } from "@testing-library/react";
import { BrowserRouter, match } from "react-router-dom";
import ImmunizationRecord from "./immunization-record.component";
import { useCurrentPatient } from "../../../__mocks__/openmrs-esm-api.mock";
import {
  patient,
  mockPatientImmunizationResult
} from "../../../__mocks__/immunizations.mock";
import { of } from "rxjs";

const mockPerformPatientImmunizationSearch = getImmunizationByUuid as jest.Mock;
const mockUseCurrentPatient = useCurrentPatient as jest.Mock;

jest.mock("./immunizations.resource", () => ({
  getImmunizationByUuid: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

describe("<ImmunizationRecord />", () => {
  let wrapper: any;

  afterEach(cleanup);
  beforeEach(mockPerformPatientImmunizationSearch.mockReset);
  beforeEach(
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null])
  );

  it("renders without dying", async () => {
    mockPerformPatientImmunizationSearch.mockReturnValue(
      of(mockPatientImmunizationResult)
    );
    wrapper = render(
      <BrowserRouter>
        <ImmunizationRecord />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
    });
  });

  it("displays a detailed summary of the selected immunization", async () => {
    mockPerformPatientImmunizationSearch.mockReturnValue(
      of(mockPatientImmunizationResult)
    );
    wrapper = render(
      <BrowserRouter>
        <ImmunizationRecord />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("Immunization").textContent).toBeTruthy();
      expect(wrapper.getByText("Edit").textContent).toBeTruthy();
      expect(wrapper.getByText("Renal rejection").textContent).toBeTruthy();
      expect(wrapper.getByText("Jul-2011").textContent).toBeTruthy();
      expect(wrapper.getByText("Active").textContent).toBeTruthy();
      expect(wrapper.getByText("Details").textContent).toBeTruthy();
      expect(wrapper.getByText("Last updated").textContent).toBeTruthy();
      expect(wrapper.getByText("01-Aug-2011").textContent).toBeTruthy();
      expect(wrapper.getByText("Last updated by").textContent).toBeTruthy();
      expect(
        wrapper.getByText("Dr. Katherine Mwangi").textContent
      ).toBeTruthy();
      expect(
        wrapper.getByText("Last updated location").textContent
      ).toBeTruthy();
      expect(wrapper.getByText("Busia, Clinic").textContent).toBeTruthy();
    });
  });
});
