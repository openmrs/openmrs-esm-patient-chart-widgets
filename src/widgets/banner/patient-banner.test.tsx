import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PatientBanner from "./patient-banner.component";
import { getVisitsForPatient } from "../visit/visit.resource";
import { of } from "rxjs";

jest.unmock("lodash");
const lodash = jest.requireActual("lodash");
lodash.capitalize = jest
  .fn()
  .mockImplementation(s => s.charAt(0).toUpperCase() + s.slice(1));

const mockGetVisitsForPatient = getVisitsForPatient as jest.Mock;

jest.mock("../visit/visit.resource", () => ({
  getVisitsForPatient: jest.fn()
}));

function renderPatientBanner() {
  render(<PatientBanner />);
}

describe("<PatientBanner />", () => {
  afterEach(mockGetVisitsForPatient.mockReset);

  beforeEach(() => {
    mockGetVisitsForPatient.mockReturnValue(of({}));
  });

  it("clicking the button toggles displaying the patient's contact details", () => {
    renderPatientBanner();

    const showContactDetailsBtn = screen.getByRole("button", {
      name: "Show Contact Details"
    });

    fireEvent.click(showContactDetailsBtn);

    const hideContactDetailsBtn = screen.getByRole("button", {
      name: "Hide Contact Details"
    });
    expect(hideContactDetailsBtn).toBeInTheDocument();
    expect(screen.getByText("Address")).toBeInTheDocument();
    expect(screen.getByText("Contact Details")).toBeInTheDocument();

    fireEvent.click(hideContactDetailsBtn);

    expect(showContactDetailsBtn).toBeInTheDocument();
  });

  it("should display the Active Visit tag when there is an active visit", () => {
    mockGetVisitsForPatient.mockReturnValue(
      of({
        ok: true,
        data: {
          results: [
            {
              uuid: "4d4fd38c-8729-4e2f-874d-bbac83dd38d0",
              stopDatetime: null
            }
          ]
        }
      })
    );

    renderPatientBanner();

    expect(screen.queryByTitle("Active Visit")).toBeVisible();
  });

  it("should not display the Active Visit tag when there is not an active visit", () => {
    mockGetVisitsForPatient.mockReturnValue(
      of({
        ok: true,
        data: {
          results: [
            {
              uuid: "aeef2554-5f75-4507-8236-e5aface1c0a1",
              stopDatetime: "2020-07-28T10:29:00.000+0000"
            }
          ]
        }
      })
    );

    renderPatientBanner();

    expect(screen.queryByTitle("Active Visit")).toBeNull();
  });
});
