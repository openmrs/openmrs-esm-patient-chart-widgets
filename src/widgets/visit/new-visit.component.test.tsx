import React from "react";
import dayjs from "dayjs";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { of } from "rxjs";
import { mockVisitTypesDataResponse } from "../../../__mocks__/visits.mock";
import { mockLocationsDataResponse } from "../../../__mocks__/location.mock";
import { mockSessionDataResponse } from "../../../__mocks__/session.mock";
import {
  openmrsObservableFetch,
  getCurrentPatientUuid
} from "@openmrs/esm-api";
import NewVisit from "./new-visit-component";
const mockGetCurrentPatientUuid = getCurrentPatientUuid as jest.Mock;
const mockOpenmrsObservableFetch = openmrsObservableFetch as jest.Mock;

jest.mock("@openmrs/esm-api", () => ({
  getCurrentPatientUuid: jest.fn(),
  openmrsObservableFetch: jest.fn(),
  fhirBaseUrl: "/ws/fhir2"
}));

describe("<NewVisit />", () => {
  let patientUuid = "some-patient-uuid";

  afterEach(cleanup);
  afterEach(mockOpenmrsObservableFetch.mockReset);
  afterEach(mockGetCurrentPatientUuid.mockReset);
  beforeEach(() => {
    mockGetCurrentPatientUuid.mockReturnValue(of(patientUuid));
    mockOpenmrsObservableFetch.mockImplementation(
      (url: string, config: { method: string; body: any }) => {
        if (url.indexOf("/visittype") >= 0) {
          return of(mockVisitTypesDataResponse);
        }
        if (url.indexOf("/location") >= 0) {
          return of(mockLocationsDataResponse);
        }
        if (url.indexOf("/session") >= 0) {
          return of(mockSessionDataResponse);
        }
        if (url.indexOf("/visit") >= 0 && config.method === "POST") {
          return of({ data: config.body });
        }
        // return nothing to ensure that all api calls are mocked
      }
    );
  });

  it("renders and default values are selected", () => {
    const { queryByLabelText, getByDisplayValue } = render(
      <NewVisit
        onVisitStarted={() => {}}
        onCanceled={() => {}}
        closeComponent={() => {}}
        viewMode={true}
      />
    );
    expect(queryByLabelText(/Visit Type/i)).toBeTruthy();
    expect(queryByLabelText(/Start Date\/Time/i)).toBeTruthy();
    expect(queryByLabelText(/location/i)).toBeTruthy();
    // expect(queryByLabelText(/Visit Type/i)).toBeTruthy();
    expect(queryByLabelText(/Start/i)).toBeTruthy();

    // check for default selected location being the session location
    expect(getByDisplayValue(/Inpatient Ward/i)).toBeTruthy();
  });

  it("starts or cancels a new visit", async () => {
    const mockStartedCallback = jest.fn();
    const mockCancelledCallback = jest.fn();
    const mockCloseComponent = jest.fn();

    const { getByLabelText, getByTestId, container } = render(
      <NewVisit
        onVisitStarted={mockStartedCallback}
        onCanceled={mockCancelledCallback}
        closeComponent={mockCloseComponent}
        viewMode={true}
      />
    );

    const testDate = dayjs(new Date())
      .subtract(1, "day")
      .subtract(1, "hour")
      .set("second", 0)
      .set("millisecond", 0);

    // simulate visit type selection
    const visitTypeSelect = getByLabelText(/Visit Type/i);
    fireEvent.change(visitTypeSelect, { target: { value: "some-uuid1" } });

    // simulate location selection
    const locationSelect = getByLabelText(/location/i);
    fireEvent.change(locationSelect, { target: { value: "some-uuid1" } });

    // simulate date selection
    const dateControl = getByTestId("date-select");
    fireEvent.change(dateControl, {
      target: { value: testDate.format("YYYY-MM-DD") }
    });

    const timeControl = getByTestId("time-select");
    fireEvent.change(timeControl, {
      target: { value: testDate.format("HH:mm") }
    });

    // simulate clicking of save
    const saveButton = await screen.findByText("Start");
    fireEvent(
      saveButton,
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true
      })
    );

    expect(mockStartedCallback.mock.calls.length).toBe(1);
    expect(mockStartedCallback.mock.calls[0][0]).toBeTruthy();
    expect(mockStartedCallback.mock.calls[0][0]["visitType"]).toEqual(
      "some-uuid1"
    );
    expect(mockStartedCallback.mock.calls[0][0]["location"]).toEqual(
      "some-uuid1"
    );
    expect(mockStartedCallback.mock.calls[0][0]["patient"]).toEqual(
      patientUuid
    );
    expect(
      dayjs(mockStartedCallback.mock.calls[0][0]["startDatetime"]).isSame(
        testDate
      )
    ).toBe(true);

    // simulate cancelling
    const cancelButton = await screen.findByText("Cancel");
    fireEvent(
      cancelButton,
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true
      })
    );
    expect(mockCancelledCallback.mock.calls.length).toBe(1);
  });
});
