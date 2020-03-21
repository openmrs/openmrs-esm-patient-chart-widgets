import React from "react";
import { cleanup, render, wait } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import VitalRecord from "./vital-record.component";
import { mockPatient } from "../../../__mocks__/patient.mock";
import { useCurrentPatient } from "../../../__mocks__/openmrs-esm-api.mock";
import { fetchVitalSignByUuid } from "./vitals-card.resource";
import { of } from "rxjs/internal/observable/of";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockFetchPatientVital = fetchVitalSignByUuid as jest.Mock;

jest.mock("./vitals-card.resource", () => ({
  fetchVitalSignByUuid: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

describe("<VitalRecord />", () => {
  let wrapper: any;

  afterEach(cleanup);
  beforeEach(mockFetchPatientVital.mockReset);
  beforeEach(() => {
    mockUseCurrentPatient.mockReturnValue([
      false,
      mockPatient,
      mockPatient.id,
      null
    ]);
    mockFetchPatientVital.mockReturnValue(of([]));
  });

  it("renders without dying", async () => {
    wrapper = render(
      <BrowserRouter>
        <VitalRecord />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
    });
  });
});
