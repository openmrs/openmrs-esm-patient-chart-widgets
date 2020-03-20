import React from "react";
import { cleanup, render, wait } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NoteRecord from "./note-record.component";
import { mockPatient } from "../../../__mocks__/patient.mock";
import { useCurrentPatient } from "../../../__mocks__/openmrs-esm-api.mock";
import { fetchEncounterByUuid } from "./encounter.resource";
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
    mockFetchPatientEncounter.mockReturnValue(of([]));
  });

  it("renders without dying", async () => {
    wrapper = render(
      <BrowserRouter>
        <NoteRecord />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
    });
  });
});
