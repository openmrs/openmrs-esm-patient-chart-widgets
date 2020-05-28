import React from "react";
import { cleanup, render, wait } from "@testing-library/react";
import { BrowserRouter, match, useRouteMatch } from "react-router-dom";
import VitalRecord from "./vital-record.component";
import { mockPatient } from "../../../__mocks__/patient.mock";
import { useCurrentPatient } from "../../../__mocks__/openmrs-esm-api.mock";
import { mockVitalSigns, mockVitalData } from "../../../__mocks__/vitals.mock";
import { performPatientsVitalsSearch } from "./vitals-card.resource";
import { of } from "rxjs/internal/observable/of";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockUseRouteMatch = useRouteMatch as jest.Mock;
const mockFetchPatientVitalSigns = performPatientsVitalsSearch as jest.Mock;

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("./vitals-card.resource", () => ({
  performPatientsVitalsSearch: jest.fn()
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useRouteMatch: jest.fn()
}));

describe("<VitalRecord />", () => {
  let wrapper: any;
  let match: match = {
    params: { vitalUuid: "d821eb55-1ba8-49c3-9ac8-95882744bd27" },
    isExact: false,
    path: "/",
    url: "/"
  };

  afterEach(cleanup);
  beforeEach(mockFetchPatientVitalSigns.mockReset);
  beforeEach(mockUseRouteMatch.mockReset);
  beforeEach(() => {
    mockUseCurrentPatient.mockReturnValue([
      false,
      mockPatient,
      mockPatient.id,
      null
    ]);
  });

  it("renders without dying", async () => {
    mockUseRouteMatch.mockReturnValue(match);
    mockFetchPatientVitalSigns.mockReturnValue(of(mockVitalData));
    wrapper = render(
      <BrowserRouter>
        <VitalRecord />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
    });
  });

  it("renders a summary of the selected vital signs", async () => {
    mockUseRouteMatch.mockReturnValue(match);
    mockFetchPatientVitalSigns.mockReturnValue(of(mockVitalData));
    wrapper = render(
      <BrowserRouter>
        <VitalRecord />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("Vital").textContent).toBeTruthy();
      expect(wrapper.getByText("Measured at").textContent).toBeTruthy();
      expect(wrapper.getByText(/25-Aug-2015/).textContent).toBeTruthy();
      expect(wrapper.getByText("Blood pressure").textContent).toBeTruthy();
      expect(wrapper.getByText(/120 \/ 80/).textContent).toBeTruthy();
      expect(wrapper.getByText("mmHg").textContent).toBeTruthy();
      expect(wrapper.getByText("Heart rate").textContent).toBeTruthy();
      expect(wrapper.getByText("60").textContent).toBeTruthy();
      expect(wrapper.getByText("bpm").textContent).toBeTruthy();
      expect(wrapper.getByText("Oxygen saturation").textContent).toBeTruthy();
      expect(wrapper.getByText("93").textContent).toBeTruthy();
      expect(wrapper.getByText("%").textContent).toBeTruthy();
      expect(wrapper.getByText("Temperature").textContent).toBeTruthy();
      expect(wrapper.getByText("38").textContent).toBeTruthy();
      expect(wrapper.getByText("°C").textContent).toBeTruthy();
    });
  });
});
