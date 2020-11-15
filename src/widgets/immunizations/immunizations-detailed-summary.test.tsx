import {
  mockImmunizationConfig,
  mockPatientImmunizationsSearchResponse,
  mockVaccinesConceptSet,
  patient
} from "../../../__mocks__/immunizations.mock";
import { render, wait, cleanup, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { openmrsFetch, useCurrentPatient } from "@openmrs/esm-api";
import React from "react";
import { getConfig } from "@openmrs/esm-config";
import { includes } from "lodash-es";
import ImmunizationsDetailedSummary from "./immunizations-detailed-summary.component";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockOpenmrsFetch = openmrsFetch as jest.Mock;
const mockGetConfig = getConfig as jest.Mock;

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn(),
  openmrsFetch: jest.fn()
}));

jest.mock("@openmrs/esm-config", () => ({
  getConfig: jest.fn()
}));

describe("<ImmunizationsDetailedSummary />", () => {
  afterEach(cleanup);
  afterEach(mockGetConfig.mockReset);
  afterEach(mockUseCurrentPatient.mockReset);

  it("should render detailed summary from config and search results", async () => {
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
    mockOpenmrsFetch.mockImplementation(url => {
      return includes(url, "concept")
        ? Promise.resolve({ data: mockVaccinesConceptSet })
        : Promise.resolve({ data: mockPatientImmunizationsSearchResponse });
    });

    const { container, getByText } = render(
      <BrowserRouter>
        <ImmunizationsDetailedSummary
          immunizationsConfig={mockImmunizationConfig.immunizationsConfig}
        />
      </BrowserRouter>
    );

    await wait(() => {
      const immunizationTable = container.querySelector(".immunizationTable");
      expect(immunizationTable).toBeDefined();
      const rows = immunizationTable.querySelectorAll("tr");

      expect(rows.length).toBe(5);

      expect(within(rows[0]).getByText("Vaccine")).toBeTruthy();
      expect(within(rows[0]).getByText("Recent Vaccination")).toBeTruthy();

      expect(within(rows[1]).getByText("Rotavirus")).toBeTruthy();
      expect(within(rows[2]).getByText("Polio")).toBeTruthy();
      expect(within(rows[3]).getByText("Influenza")).toBeTruthy();
      expect(within(rows[4]).getByText("Adinovirus")).toBeTruthy();
    });
  });

  it("should give link when immunization are not configured", async () => {
    mockUseCurrentPatient.mockReturnValue([false, patient, patient.id, null]);
    mockOpenmrsFetch
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({ data: {} });

    const { container, getByText } = render(
      <BrowserRouter>
        <ImmunizationsDetailedSummary
          immunizationsConfig={mockImmunizationConfig.immunizationsConfig}
        />
      </BrowserRouter>
    );

    await wait(() => {
      expect(getByText("No immunizations are configured.")).toBeTruthy();
    });
  });
});
