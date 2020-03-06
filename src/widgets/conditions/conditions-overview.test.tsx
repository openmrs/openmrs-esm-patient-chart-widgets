import React from "react";
import { cleanup, render, wait } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { performPatientConditionsSearch } from "./conditions.resource";
import ConditionsOverview from "./conditions-overview.component";
import { useCurrentPatient } from "@openmrs/esm-api";
import {
  patient,
  mockPatientConditionsResult
} from "../../../__mocks__/conditions.mock";

const mockUseCurrentPatient = useCurrentPatient as jest.MockedFunction<any>;
const mockPerformPatientConditionsSearch = performPatientConditionsSearch as jest.Mock;

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("./conditions.resource", () => ({
  performPatientConditionsSearch: jest.fn()
}));

const match = { params: {}, isExact: false, path: "/", url: "/" };
let wrapper;

describe("<ConditionsOverview />", () => {
  afterEach(() => {
    cleanup;
  });

  beforeEach(mockUseCurrentPatient.mockReset);
  beforeEach(() => {
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
  });

  it("should render without dying", async () => {
    mockPerformPatientConditionsSearch.mockResolvedValue(
      mockPatientConditionsResult
    );

    wrapper = render(
      <BrowserRouter>
        <ConditionsOverview basePath="/" />
      </BrowserRouter>
    );
    await wait(() => {
      expect(wrapper).toBeTruthy();
    });
  });

  it("should display the patient conditions correctly", async () => {
    mockPerformPatientConditionsSearch.mockReturnValue(
      Promise.resolve(mockPatientConditionsResult)
    );

    wrapper = render(
      <BrowserRouter>
        <ConditionsOverview basePath="/" />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper.getByText("Hypertension")).toBeTruthy();
      expect(wrapper.getByText("Renal rejection")).toBeTruthy();
    });
  });

  it("should not display the patient conditions when conditions are absent", async () => {
    mockPerformPatientConditionsSearch.mockReturnValue(Promise.resolve(null));

    wrapper = render(
      <BrowserRouter>
        <ConditionsOverview match={match} />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("No Conditions documented.")).toBeTruthy();
    });
  });
});
