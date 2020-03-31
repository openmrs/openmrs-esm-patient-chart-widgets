import React from "react";
import { cleanup, render, wait } from "@testing-library/react";
import { useCurrentPatient } from "@openmrs/esm-api";
import {
  fetchPrograms,
  fetchEnrolledPrograms,
  fetchLocations,
  getPatientProgramByUuid,
  getSession
} from "./programs.resource";
import ProgramsForm from "./programs-form.component";
import { mockPatient } from "../../../__mocks__/patient.mock";
import {
  mockCareProgramsResponse,
  mockEnrolledProgramsResponse,
  mockLocationsResponse,
  mockOncProgramResponse
} from "../../../__mocks__/programs.mock";
import { mockSessionDataResponse } from "../../../__mocks__/session.mock";
import { BrowserRouter } from "react-router-dom";
import { of } from "rxjs/internal/observable/of";

const mockUseCurrentPatient = useCurrentPatient as jest.Mock;
const mockFetchLocations = fetchLocations as jest.Mock;
const mockFetchCarePrograms = fetchPrograms as jest.Mock;
const mockFetchEnrolledPrograms = fetchEnrolledPrograms as jest.Mock;
const mockGetProgramByUuid = getPatientProgramByUuid as jest.Mock;
const mockGetSession = getSession as jest.Mock;

jest.mock("./programs.resource", () => ({
  fetchEnrolledPrograms: jest.fn(),
  fetchPrograms: jest.fn(),
  fetchLocations: jest.fn(),
  getPatientProgramByUuid: jest.fn(),
  getSession: jest.fn(),
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
    mockGetSession.mockReturnValue(Promise.resolve(mockSessionDataResponse));
    mockFetchCarePrograms.mockReturnValue(of(mockCareProgramsResponse));
    mockFetchLocations.mockReturnValue(of(mockLocationsResponse));
    mockGetProgramByUuid.mockReturnValue(of(mockOncProgramResponse));
  });

  it("renders without dying", async () => {
    mockFetchEnrolledPrograms.mockReturnValue(of(mockEnrolledProgramsResponse));

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
    mockFetchEnrolledPrograms.mockReturnValue(of(mockEnrolledProgramsResponse));

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

  it("renders the edit program form when the edit button is clicked on an existing program", async () => {
    mockFetchEnrolledPrograms.mockReturnValue(of(mockEnrolledProgramsResponse));
    match = {
      params: {
        program: "Oncology Screening and Diagnosis",
        programUuid: "46bd14b8-2357-42a2-8e16-262e8f0057d7",
        enrollmentDate: "2020-03-25T00:00:00.000+0000",
        completionDate: "2020-03-25T00:00:00.000+0000",
        location: "58c57d25-8d39-41ab-8422-108a0c277d98"
      },
      isExact: false,
      path: "/",
      url: "/"
    };

    const wrapper = render(
      <BrowserRouter>
        <ProgramsForm match={match} />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("Edit Program").textContent).toBeTruthy();
      expect(
        wrapper.getByText("Oncology Screening and Diagnosis").textContent
      ).toBeTruthy();
      expect(wrapper.getByText("Date enrolled").textContent).toBeTruthy();
      expect(wrapper.getByText("Date completed").textContent).toBeTruthy();
      expect(wrapper.getByText("Enrollment location").textContent).toBeTruthy();
      expect(wrapper.getByText("Save").textContent).toBeTruthy();
      expect(wrapper.getByText("Cancel").textContent).toBeTruthy();
    });
  });
});
