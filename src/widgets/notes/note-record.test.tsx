import React from "react";
import { cleanup, render, wait } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NoteRecord from "./note-record.component";
import { mockPatient } from "../../../__mocks__/patient.mock";
import { useCurrentPatient } from "../../../__mocks__/openmrs-esm-api.mock";
import { fetchEncounterByUuid } from "./encounter.resource";
import {
  mockEncounterResponse,
  mockAlternativeEncounterResponse
} from "../../../__mocks__/encounters.mock";
import { of } from "rxjs/internal/observable/of";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockFetchPatientEncounter = fetchEncounterByUuid as jest.Mock;

jest.mock("./encounter.resource", () => ({
  fetchEncounterByUuid: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

describe("<NoteRecord />", () => {
  let wrapper: any;

  afterEach(cleanup);
  beforeEach(mockFetchPatientEncounter.mockReset);
  beforeEach(() => {
    mockUseCurrentPatient.mockReturnValue([
      false,
      mockPatient,
      mockPatient.id,
      null
    ]);
  });

  it("renders without dying", async () => {
    mockFetchPatientEncounter.mockReturnValue(of(mockEncounterResponse));
    wrapper = render(
      <BrowserRouter>
        <NoteRecord />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
    });
  });

  it("displays a detailed summary of the selected note", async () => {
    mockFetchPatientEncounter.mockReturnValue(of(mockEncounterResponse));
    wrapper = render(
      <BrowserRouter>
        <NoteRecord />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("Note").textContent).toBeTruthy();
      expect(
        wrapper.getByText("Visit Note 28/01/2015").textContent
      ).toBeTruthy();
      expect(wrapper.getByText("Encounter type").textContent).toBeTruthy();
      expect(wrapper.getByText("Encounter datetime").textContent).toBeTruthy();
      expect(wrapper.getByText("Location").textContent).toBeTruthy();
      expect(wrapper.getByText("Visit Note").textContent).toBeTruthy();
      expect(wrapper.getByText("Unknown Location").textContent).toBeTruthy();
      expect(wrapper.getByText("28-01-2015").textContent).toBeTruthy();
      expect(wrapper.getByText("Details").textContent).toBeTruthy();
      expect(
        wrapper.getByText(
          "Visit Diagnoses: Presumed diagnosis, Primary, Vitamin A Deficiency with Keratomalacia"
        ).textContent
      ).toBeTruthy();
      expect(
        wrapper.getByText(
          "Visit Diagnoses: Other disease of hard tissue of teeth, Secondary, Confirmed diagnosis"
        ).textContent
      ).toBeTruthy();
      expect(
        wrapper.getByText(
          "Text of encounter note: Duis aute irure dolor in reprehenderit in voluptat"
        ).textContent
      ).toBeTruthy();
    });
  });

  it("displays a detailed summary of the selected note", async () => {
    mockFetchPatientEncounter.mockReturnValue(of(mockEncounterResponse));
    wrapper = render(
      <BrowserRouter>
        <NoteRecord />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("Note").textContent).toBeTruthy();
      expect(
        wrapper.getByText("Visit Note 28/01/2015").textContent
      ).toBeTruthy();
      expect(wrapper.getByText("Encounter type").textContent).toBeTruthy();
      expect(wrapper.getByText("Encounter datetime").textContent).toBeTruthy();
      expect(wrapper.getByText("Location").textContent).toBeTruthy();
      expect(wrapper.getByText("Visit Note").textContent).toBeTruthy();
      expect(wrapper.getByText("Unknown Location").textContent).toBeTruthy();
      expect(wrapper.getByText("28-01-2015").textContent).toBeTruthy();
      expect(wrapper.getByText("Details").textContent).toBeTruthy();
      expect(
        wrapper.getByText(
          "Visit Diagnoses: Presumed diagnosis, Primary, Vitamin A Deficiency with Keratomalacia"
        ).textContent
      ).toBeTruthy();
      expect(
        wrapper.getByText(
          "Visit Diagnoses: Other disease of hard tissue of teeth, Secondary, Confirmed diagnosis"
        ).textContent
      ).toBeTruthy();
      expect(
        wrapper.getByText(
          "Text of encounter note: Duis aute irure dolor in reprehenderit in voluptat"
        ).textContent
      ).toBeTruthy();
    });
  });

  it("displays the patient note details when present", async () => {
    mockFetchPatientEncounter.mockReturnValue(
      of(mockAlternativeEncounterResponse)
    );
    wrapper = render(
      <BrowserRouter>
        <NoteRecord />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("Details").textContent).toBeTruthy();
      expect(wrapper.getByText("Weight (kg): 65.0").textContent).toBeTruthy();
      expect(wrapper.getByText("Height (cm): 180.0").textContent).toBeTruthy();
      expect(
        wrapper.getByText("Systolic blood pressure: 120.0").textContent
      ).toBeTruthy();
      expect(wrapper.getByText("Pulse: 60.0").textContent).toBeTruthy();
      expect(
        wrapper.getByText("Blood oxygen saturation: 92.0").textContent
      ).toBeTruthy();
      expect(
        wrapper.getByText("Temperature (C): 37.0").textContent
      ).toBeTruthy();
      expect(
        wrapper.getByText("Diastolic blood pressure: 80.0").textContent
      ).toBeTruthy();
    });
  });
});
