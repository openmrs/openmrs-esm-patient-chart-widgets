import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PatientBanner from "./patient-banner.component";
import { getStartedVisit, visitMode, visitStatus } from "../visit/visit-utils";
import { openmrsObservableFetch, openmrsFetch } from "@openmrs/esm-framework";
import { mockVisits } from "../../../__mocks__/visits.mock";
import { of } from "rxjs";

const mockOpenmrsObservableFetch = openmrsObservableFetch as jest.Mock;
const mockOpenmrsFetch = openmrsFetch as jest.Mock;

jest.unmock("lodash");
const lodash = jest.requireActual("lodash");
lodash.capitalize = jest
  .fn()
  .mockImplementation(s => s.charAt(0).toUpperCase() + s.slice(1));

function renderPatientBanner() {
  render(<PatientBanner />);
}

describe("<PatientBanner />", () => {
  beforeEach(() => {
    getStartedVisit.next(null);
    mockOpenmrsObservableFetch.mockReturnValue(of(mockVisits));
    mockOpenmrsFetch.mockReturnValue(Promise.resolve([]));
  });

  it("clicking the button toggles displaying the patient's contact details", () => {
    renderPatientBanner();

    const showAllDetailsBtn = screen.getByRole("button", {
      name: "Show all details"
    });

    fireEvent.click(showAllDetailsBtn);

    const hideAllDetailsBtn = screen.getByRole("button", {
      name: "Hide all details"
    });
    expect(hideAllDetailsBtn).toBeInTheDocument();
    expect(screen.getByText("Address")).toBeInTheDocument();
    expect(screen.getByText("Contact Details")).toBeInTheDocument();

    fireEvent.click(hideAllDetailsBtn);

    expect(showAllDetailsBtn).toBeInTheDocument();
  });

  it("should display the Active Visit tag when there is an active visit", () => {
    getStartedVisit.next({
      mode: visitMode.NEWVISIT,
      status: visitStatus.NOTSTARTED
    });

    renderPatientBanner();

    expect(screen.queryByTitle("Active Visit")).toBeVisible();
  });

  it("should not display the Active Visit tag when there is not an active visit", () => {
    renderPatientBanner();

    expect(screen.queryByTitle("Active Visit")).toBeNull();
  });
});
