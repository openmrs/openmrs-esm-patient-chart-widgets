import React from "react";
import { cleanup, render, wait } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Vitals from "./vitals.component";

jest.mock("@openmrs/esm-api", () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual("@openmrs/esm-api");

  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    fhirBaseUrl: `/ws/fhir2`
  };
});

describe("<VitalsComponent />", () => {
  let wrapper: any;

  afterEach(cleanup);

  it("renders without dying", async () => {
    wrapper = render(
      <BrowserRouter>
        <Vitals />
      </BrowserRouter>
    );
    await wait(() => {
      expect(wrapper).toBeTruthy();
    });
  });
});
