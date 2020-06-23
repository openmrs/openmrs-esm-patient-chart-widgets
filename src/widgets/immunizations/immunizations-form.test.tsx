import React from "react";
import { BrowserRouter } from "react-router-dom";
import { cleanup, render, wait, fireEvent } from "@testing-library/react";
import {
  mockPatientImmunizationWithSeries,
  mockPatientImmunizationWithoutSeries
} from "../../../__mocks__/immunizations.mock";
import { ImmunizationsForm } from "./immunizations-form.component";

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

describe("<ImmunizationsForm />", () => {
  let match = { params: {}, isExact: false, path: "/", url: "/" };
  let wrapper: any;

  afterEach(cleanup);

  it("renders immunization form without dying", async () => {
    match.params = [{
      immunizationUuid : "",
      immunizationName : mockPatientImmunizationWithoutSeries.resource.vaccineCode.text,
      manufacturer : mockPatientImmunizationWithoutSeries.resource.manufacturer,
      expirationDate : "",
      vaccinationDate : "",
      lotNumber : "",
      isSeries : false
    }];
    wrapper = render(
      <BrowserRouter>
        <ImmunizationsForm match={match} />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
    });
  });

  it("displays the appropriate fields when adding a new immunization without series", async () => {
    match.params = [{
      immunizationUuid : "",
      immunizationName : mockPatientImmunizationWithoutSeries.resource.vaccineCode.text,
      manufacturer : mockPatientImmunizationWithoutSeries.resource.manufacturer,
      expirationDate : "",
      vaccinationDate : "",
      lotNumber : "",
      isSeries : false
    }];
    wrapper = render(
      <BrowserRouter>
        <ImmunizationsForm match={match} />
      </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("add Vaccine: "+ mockPatientImmunizationWithSeries.resource.vaccineCode.text)).toBeDefined();
      expect(wrapper.getByText("vaccination Date")).toBeDefined();
      expect(wrapper.getByText("expiration Date")).toBeDefined();
      expect(wrapper.getByText("lot number")).toBeDefined();
      expect(wrapper.getByText("manufacturer")).toBeDefined();
      expect(wrapper.getByText("cancel")).toBeDefined();
      expect(wrapper.getByText("save")).toBeDefined();
    });
  });

  it("displays the appropriate fields when adding a new immunization with series", async () => {
    match.params = [{
      immunizationUuid : "",
      immunizationName : mockPatientImmunizationWithSeries.resource.vaccineCode.text,
      manufacturer : mockPatientImmunizationWithSeries.resource.manufacturer,
      expirationDate : "",
      vaccinationDate : "",
      lotNumber : "",
      isSeries : true,
      series:mockPatientImmunizationWithSeries.resource.series
    }];
    wrapper = render(
        <BrowserRouter>
          <ImmunizationsForm match={match} />
        </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("add Vaccine: "+ mockPatientImmunizationWithSeries.resource.vaccineCode.text)).toBeDefined();
      expect(wrapper.getByText("vaccination Date")).toBeDefined();
      expect(wrapper.getByText("expiration Date")).toBeDefined();
      expect(wrapper.getByText("lot number")).toBeDefined();
      expect(wrapper.getByText("series")).toBeDefined();
      expect(wrapper.getByText("manufacturer")).toBeDefined();
      expect(wrapper.getByText("cancel")).toBeDefined();
      expect(wrapper.getByText("save")).toBeDefined();
    });
  });

  it("displays the appropriate fields and values when editing an existing immunization without series", async () => {
    match.params = [{
      immunizationUuid : mockPatientImmunizationWithoutSeries.resource.uuid,
      immunizationName : mockPatientImmunizationWithoutSeries.resource.vaccineCode.text,
      manufacturer : mockPatientImmunizationWithoutSeries.resource.manufacturer,
      expirationDate : mockPatientImmunizationWithoutSeries.resource.expirationDate,
      vaccinationDate : mockPatientImmunizationWithoutSeries.resource.protocolApplied[0].occurrenceDateTime,
      lotNumber : mockPatientImmunizationWithoutSeries.resource.lotNumber,
      isSeries : false
    }];
    wrapper = render(
        <BrowserRouter>
          <ImmunizationsForm match={match} />
        </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("edit vaccine: "+ mockPatientImmunizationWithSeries.resource.vaccineCode.text)).toBeDefined();
      expect(wrapper.getByText("vaccination Date")).toBeDefined();
      expect(wrapper.getByText("expiration Date")).toBeDefined();
      expect(wrapper.getByText("lot number")).toBeDefined();
      expect(wrapper.getByText("manufacturer")).toBeDefined();
      expect(wrapper.getByText("cancel")).toBeDefined();
      expect(wrapper.getByText("save")).toBeDefined();
    });
  });

  it("displays the appropriate fields and values when editing an existing immunization with series", async () => {
    match.params = [{
      immunizationUuid : mockPatientImmunizationWithSeries.resource.uuid,
      immunizationName : mockPatientImmunizationWithSeries.resource.vaccineCode.text,
      manufacturer : mockPatientImmunizationWithSeries.resource.manufacturer,
      expirationDate : mockPatientImmunizationWithSeries.resource.expirationDate,
      vaccinationDate : mockPatientImmunizationWithSeries.resource.protocolApplied[0].occurrenceDateTime,
      lotNumber : mockPatientImmunizationWithSeries.resource.lotNumber,
      isSeries : true,
      series: mockPatientImmunizationWithSeries.resource.series
    }];
    wrapper = render(
        <BrowserRouter>
          <ImmunizationsForm match={match} />
        </BrowserRouter>
    );

    await wait(() => {
      expect(wrapper).toBeDefined();
      expect(wrapper.getByText("edit vaccine: "+ mockPatientImmunizationWithSeries.resource.vaccineCode.text)).toBeDefined();
      expect(wrapper.getByText("vaccination Date")).toBeDefined();
      expect(wrapper.getByText("expiration Date")).toBeDefined();
      expect(wrapper.getByText("lot number")).toBeDefined();
      expect(wrapper.getByText("series")).toBeDefined();
      expect(wrapper.getByText("manufacturer")).toBeDefined();
      expect(wrapper.getByText("cancel")).toBeDefined();
      expect(wrapper.getByText("save")).toBeDefined();
    });
  });
});
