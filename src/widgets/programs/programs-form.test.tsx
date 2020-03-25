import React from "react";
import { cleanup, render, wait } from "@testing-library/react";
import { useCurrentPatient } from "@openmrs/esm-api";
import {
  fetchPrograms,
  fetchEnrolledPrograms,
  fetchLocations
} from "./programs.resource";
import ProgramsForm from "./programs-form.component";
import { mockPatient } from "../../../__mocks__/patient.mock";
import {
  mockCareProgramsResponse,
  mockLocationsResponse,
  mockEnrolledProgramsResponse
} from "../../../__mocks__/programs.mock";
import { BrowserRouter } from "react-router-dom";
import { of } from "rxjs/internal/observable/of";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockFetchLocations = fetchLocations as jest.Mock;
const mockFetchCarePrograms = fetchPrograms as jest.Mock;
const mockfetchEnrolledPrograms = fetchEnrolledPrograms as jest.Mock;

jest.mock("./programs.resource", () => ({
  fetchEnrolledPrograms: jest.fn(),
  fetchPrograms: jest.fn(),
  fetchLocations: jest.fn(),
  saveProgramEnrollment: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

describe("<ProgramsForm />", () => {
  let match = { params: {}, isExact: false, path: "/", url: "/" };

  afterEach(cleanup);
  beforeEach(() => {
    mockUseCurrentPatient.mockReturnValue([
      false,
      mockPatient,
      mockPatient.id,
      null
    ]);
    mockFetchCarePrograms.mockReturnValue(of(mockCareProgramsResponse));
    mockFetchLocations.mockReturnValue(of(mockLocationsResponse));
  });

  it("renders without dying", async () => {
    mockfetchEnrolledPrograms.mockReturnValue(of(mockEnrolledProgramsResponse));

    const wrapper = render(
      <BrowserRouter>
        <ProgramsForm match={match} />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
    });
  });

  it("renders the program form with all the appropriate fields and values", async () => {
    mockfetchEnrolledPrograms.mockReturnValue(of(mockEnrolledProgramsResponse));

    const wrapper = render(
      <BrowserRouter>
        <ProgramsForm match={match} />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("Add a new program").textContent).toBeTruthy();
      expect(wrapper.getByText("Program").textContent).toBeTruthy();
      expect(wrapper.getByText("Choose a program:").textContent).toBeTruthy();
      expect(
        wrapper.getByText("Oncology Screening and Diagnosis").textContent
      ).toBeTruthy();
      expect(
        wrapper.getByText("HIV Differentiated Care").textContent
      ).toBeTruthy();
      expect(wrapper.getByText("Date enrolled").textContent).toBeTruthy();
      expect(wrapper.getByText("Date completed").textContent).toBeTruthy();
      expect(wrapper.getByText("Enrollment location").textContent).toBeTruthy();
      expect(wrapper.getByText("Choose a location:").textContent).toBeTruthy();
      expect(wrapper.getByText("Amani Hospital").textContent).toBeTruthy();
      expect(wrapper.getByText("Inpatient Ward").textContent).toBeTruthy();
      expect(wrapper.getByText("Isolation Ward").textContent).toBeTruthy();
      expect(wrapper.getByText("Laboratory").textContent).toBeTruthy();
      expect(wrapper.getByText("Mosoriot Pharmacy").textContent).toBeTruthy();
      expect(
        wrapper.getByText("Mosoriot Subcounty Hospital").textContent
      ).toBeTruthy();
      expect(wrapper.getByText("MTRH").textContent).toBeTruthy();
      expect(wrapper.getByText("MTRH Module 4").textContent).toBeTruthy();
      expect(wrapper.getByText("Outpatient Clinic").textContent).toBeTruthy();
      expect(wrapper.getByText("Pharmacy").textContent).toBeTruthy();
      expect(wrapper.getByText("Registration Desk").textContent).toBeTruthy();
      expect(wrapper.getByText("Unknown Location").textContent).toBeTruthy();
      expect(wrapper.getAllByRole("button").length).toEqual(2);
      expect(wrapper.getAllByRole("button")[0].textContent).toEqual("Cancel");
      expect(wrapper.getAllByRole("button")[1].textContent).toEqual("Enroll");
    });
  });
});
