import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  match,
  useHistory,
  useRouteMatch,
  BrowserRouter
} from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import { of } from "rxjs/internal/observable/of";

import {
  getSession,
  editPatientVitals,
  performPatientsVitalsSearch,
  savePatientVitals
} from "./vitals-card.resource";
import VitalsForm from "./vitals-form.component";
import { mockSessionDataResponse } from "../../../__mocks__/session.mock";
import { mockVitalData } from "../../../__mocks__/vitals.mock";
import { ConfigMock } from "../../../__mocks__/chart-widgets-config.mock";
import { mockPatientId } from "../../../__mocks__/openmrs-esm-react-utils.mock";
import { mockPatient } from "../../../__mocks__/patient.mock";

const mockUseHistory = useHistory as jest.Mock;
const mockGetSession = getSession as jest.Mock;
const mockUseRouteMatch = useRouteMatch as jest.Mock;
const mockPerformPatientVitalsSearch = performPatientsVitalsSearch as jest.Mock;
const mockEditPatientVitals = editPatientVitals as jest.Mock;
const mockSavePatientVitals = savePatientVitals as jest.Mock;
let testMatch: match = {
  params: {
    patientUuid: mockPatientId
  },
  isExact: false,
  path: "/",
  url: "/"
};

const renderVitalsForm = () =>
  render(
    <BrowserRouter>
      <VitalsForm match={testMatch} />
    </BrowserRouter>
  );

jest.mock("./vitals-card.resource", () => ({
  getSession: jest.fn(),
  performPatientsVitalsSearch: jest.fn(),
  editPatientVitals: jest.fn(),
  savePatientVitals: jest.fn()
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: jest.fn(),
  useRouteMatch: jest.fn()
}));

describe("<VitalsForm />", () => {
  let config = ConfigMock;

  beforeEach(() => {
    mockUseRouteMatch.mockReset;
    mockPerformPatientVitalsSearch.mockReset;
    mockSavePatientVitals.mockReset;

    mockGetSession.mockReturnValue(Promise.resolve(mockSessionDataResponse));
  });

  afterEach(() => jest.restoreAllMocks());

  it("renders the create vitals form with all the appropriate fields and values", async () => {
    mockSavePatientVitals.mockReturnValue(
      Promise.resolve({ status: 201, statusText: "Created" })
    );
    mockUseHistory.mockReturnValue({
      push: jest.fn()
    });

    renderVitalsForm();

    await screen.findByRole("heading", {
      name: "Add vitals, height and weight"
    });

    expect(
      screen.getByText("Add vitals, height and weight")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Date recorded")).toBeInTheDocument();
    expect(screen.getByText("Blood pressure")).toBeInTheDocument();
    expect(screen.getByLabelText("Systolic")).toBeInTheDocument();
    expect(screen.getByText("/")).toBeInTheDocument();
    expect(screen.getByLabelText("Diastolic")).toBeInTheDocument();
    expect(screen.getByLabelText("Heart rate")).toBeInTheDocument();
    expect(screen.getByLabelText("Oxygen saturation")).toBeInTheDocument();
    expect(screen.getByLabelText("Temperature")).toBeInTheDocument();
    expect(screen.getByLabelText("Celsius")).toBeInTheDocument();
    expect(screen.getByLabelText("Fahrenheit")).toBeInTheDocument();
    expect(screen.getByLabelText("Time recorded")).toBeInTheDocument();
    expect(screen.getByLabelText("Weight")).toBeInTheDocument();
    expect(screen.getByLabelText("kg")).toBeInTheDocument();
    expect(screen.getByLabelText("lbs")).toBeInTheDocument();
    expect(screen.getByLabelText("Height")).toBeInTheDocument();
    expect(screen.getByLabelText("cm")).toBeInTheDocument();
    expect(screen.getByLabelText("feet")).toBeInTheDocument();
    expect(screen.getAllByRole("button").length).toEqual(2);
    expect(screen.getAllByRole("button")[0].textContent).toEqual("Cancel");
    expect(screen.getAllByRole("button")[1].textContent).toEqual("Sign & Save");
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    expect(cancelBtn).toBeInTheDocument();
    expect(cancelBtn).not.toBeDisabled();
    const submitBtn = screen.getByRole("button", { name: "Sign & Save" });
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();

    // Date recorded is prefilled with today's date
    const todaysDate = dayjs.utc(new Date()).format("YYYY-MM-DD");
    expect(screen.getByDisplayValue(todaysDate)).toBeInTheDocument();

    // Time recorded is prefilled with the current time
    const currentTime = dayjs(new Date()).format("HH:mm");
    expect(screen.getByDisplayValue(currentTime)).toBeInTheDocument();

    const createTimestamp = new Date(`${todaysDate} ${currentTime}`);

    // Add blood pressure values
    const systolicBP = screen.getByLabelText("Systolic");
    const diastolicBP = screen.getByLabelText("Diastolic");

    fireEvent.change(systolicBP, { target: { value: "115" } });
    fireEvent.change(diastolicBP, { target: { value: "75" } });

    await screen.findByDisplayValue("115");
    await screen.findByDisplayValue("75");

    // Add heart rate value
    const heartRate = screen.getByLabelText("Heart rate");

    fireEvent.change(heartRate, { target: { value: "68" } });

    await screen.findByDisplayValue("68");

    fireEvent.click(submitBtn);

    expect(mockSavePatientVitals).toHaveBeenCalledTimes(1);
    expect(mockSavePatientVitals).toHaveBeenCalledWith(
      config.vitals.encounterTypeUuid,
      config.vitals.formUuid,
      {
        diastolicBloodPressureUuid: config.concepts.diastolicBloodPressureUuid,
        heightUuid: config.concepts.heightUuid,
        oxygenSaturationUuid: config.concepts.oxygenSaturationUuid,
        pulseUuid: config.concepts.pulseUuid,
        systolicBloodPressureUuid: config.concepts.systolicBloodPressureUuid,
        temperatureUuid: config.concepts.temperatureUuid,
        weightUuid: config.concepts.weightUuid
      },
      mockPatientId,
      {
        diastolicBloodPressure: "75",
        height: null,
        oxygenSaturation: null,
        pulse: "68",
        systolicBloodPressure: "115",
        temperature: null,
        weight: null
      },
      createTimestamp,
      new AbortController(),
      mockSessionDataResponse.data.sessionLocation.uuid
    );

    // Should navigate away after successful POST
    expect(mockUseHistory).toHaveBeenCalled();

    window.confirm = jest.fn(() => true);

    // clicking Cancel prompts user for confirmation
    fireEvent.click(cancelBtn);

    jest.spyOn(window, "confirm").mockImplementation(() => true);

    expect(window.confirm).toHaveBeenCalled();
    expect(window.confirm).toHaveBeenCalledWith(
      "There is ongoing work, are you sure you want to close this tab?"
    );
  });

  it("renders the edit vitals form when the form is launched by clicking the edit button", async () => {
    testMatch.params = {
      patientUuid: "8673ee4f-e2ab-4077-ba55-4980f408773e",
      vitalUuid: "d821eb55-1ba8-49c3-9ac8-95882744bd27"
    };

    mockUseRouteMatch.mockReturnValue(testMatch);
    mockPerformPatientVitalsSearch.mockReturnValue(of(mockVitalData));
    mockEditPatientVitals.mockReturnValue(
      Promise.resolve({ status: 200, statusText: "OK" })
    );

    renderVitalsForm();

    await screen.findByRole("heading", {
      name: "Edit vitals"
    });

    expect(screen.getByText("Edit vitals")).toBeInTheDocument();
    expect(screen.getByLabelText("Date recorded")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2015-08-25")).toBeInTheDocument();
    expect(screen.getByText("Blood pressure")).toBeInTheDocument();
    expect(screen.getByText("Systolic")).toBeInTheDocument();
    expect(screen.getByDisplayValue("120")).toBeInTheDocument();
    expect(screen.getByText("/")).toBeInTheDocument();
    expect(screen.getByLabelText("Diastolic")).toBeInTheDocument();
    expect(screen.getByDisplayValue("80")).toBeInTheDocument();
    expect(screen.getByLabelText("Heart rate")).toBeInTheDocument();
    expect(screen.getByDisplayValue("60")).toBeInTheDocument();
    expect(screen.getByText("bpm")).toBeInTheDocument();
    expect(screen.getByLabelText("Oxygen saturation")).toBeInTheDocument();
    expect(screen.getByDisplayValue("93")).toBeInTheDocument();
    expect(screen.getByLabelText("Temperature")).toBeInTheDocument();
    expect(screen.getByDisplayValue("38")).toBeInTheDocument();
    expect(screen.getByText("°C")).toBeInTheDocument();
    expect(screen.getByLabelText("Celsius")).toBeInTheDocument();
    expect(screen.getByLabelText("Fahrenheit")).toBeInTheDocument();
    expect(screen.getByLabelText("Time recorded")).toBeInTheDocument();
    expect(screen.getByDisplayValue("06:08")).toBeInTheDocument();
    expect(screen.getByLabelText("Weight")).toBeInTheDocument();
    expect(screen.getByLabelText("Height")).toBeInTheDocument();
    expect(screen.getByLabelText("kg")).toBeInTheDocument();
    expect(screen.getByLabelText("lbs")).toBeInTheDocument();
    const deleteBtn = screen.getByRole("button", { name: "Delete" });
    expect(deleteBtn).toBeInTheDocument();
    expect(deleteBtn).not.toBeDisabled();
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    expect(cancelBtn).toBeInTheDocument();
    expect(cancelBtn).not.toBeDisabled();
    const submitBtn = screen.getByRole("button", { name: "Sign & Save" });
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();

    const systolicBP = screen.getByRole("spinbutton", { name: "Systolic" });
    fireEvent.change(systolicBP, { target: { value: "111" } });

    await screen.findByDisplayValue("111");

    fireEvent.click(submitBtn);

    expect(mockEditPatientVitals).toHaveBeenCalledTimes(1);
    expect(mockEditPatientVitals).toHaveBeenCalledWith(
      {
        diastolicBloodPressureUuid: config.concepts.diastolicBloodPressureUuid,
        heightUuid: config.concepts.heightUuid,
        oxygenSaturationUuid: config.concepts.oxygenSaturationUuid,
        pulseUuid: config.concepts.pulseUuid,
        systolicBloodPressureUuid: config.concepts.systolicBloodPressureUuid,
        temperatureUuid: config.concepts.temperatureUuid,
        weightUuid: config.concepts.weightUuid
      },
      mockPatientId,
      {
        diastolicBloodPressure: 80,
        height: undefined,
        oxygenSaturation: 93,
        pulse: 60,
        systolicBloodPressure: "111",
        temperature: 38,
        weight: undefined
      },
      dayjs.utc(mockVitalData[1].date).toDate(),
      new AbortController(),
      testMatch.params["vitalUuid"],
      mockSessionDataResponse.data.sessionLocation.uuid
    );

    // Should navigate away after successful PUT
    expect(mockUseHistory).toHaveBeenCalled();

    window.confirm = jest.fn(() => true);

    // clicking Cancel prompts user for confirmation
    fireEvent.click(cancelBtn);

    jest.spyOn(window, "confirm").mockImplementation(() => true);

    expect(window.confirm).toHaveBeenCalled();
    expect(window.confirm).toHaveBeenCalledWith(
      "There is ongoing work, are you sure you want to close this tab?"
    );
  });
});
