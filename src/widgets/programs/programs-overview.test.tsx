import React from "react";
import { cleanup, render, wait } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { fetchEnrolledPrograms } from "./programs.resource";
import ProgramsOverview from "./programs-overview.component";
import { mockPatient } from "../../../__mocks__/patient.mock";
import {
  mockProgramsResponse,
  mockEmptyProgramsResponse
} from "../../../__mocks__/programs.mock";
import * as openmrsApi from "@openmrs/esm-api";
import { of } from "rxjs/internal/observable/of";

describe("<ProgramsOverview />", () => {
  let match, wrapper: any, patient: fhir.Patient, programs: any;

  afterEach(cleanup);

  beforeEach(() => {
    patient = mockPatient;
    match = { params: {}, isExact: false, path: "/", url: "/" };
  });

  it("should render without dying", async () => {
    wrapper = render(
      <BrowserRouter>
        <ProgramsOverview basePath="/" />
      </BrowserRouter>
    );
    await wait(() => {
      expect(wrapper).toBeTruthy();
    });
  });

  it("should render an empty state view when programs are absent", async () => {
    const spy = jest.spyOn(openmrsApi, "openmrsObservableFetch");
    spy.mockReturnValue(of(mockEmptyProgramsResponse));

    wrapper = render(
      <BrowserRouter>
        <ProgramsOverview basePath="/" />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("Add").textContent).toBeTruthy();
      expect(wrapper.getByText("Care Programs").textContent).toBeTruthy();
      expect(
        wrapper.getByText(
          "This patient has no program enrollments recorded in the system."
        ).textContent
      ).toBeTruthy();
    });
  });

  it("should display the patients programs correctly", async () => {
    const spy = jest.spyOn(openmrsApi, "openmrsObservableFetch");
    spy.mockReturnValue(of(mockProgramsResponse));

    wrapper = render(
      <BrowserRouter>
        <ProgramsOverview basePath="/" />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper.getByTitle("HIV Care and Treatment")).toBeDefined();
      spy.mockRestore();
    });
  });
});
