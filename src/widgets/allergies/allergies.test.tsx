import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Allergies from "./allergies.component";

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: () => [],
  fhirBaseUrl: `/ws/fhir2`
}));

describe("<Allergies/>", () => {
  it("renders without dying", () => {
    const wrapper = render(
      <BrowserRouter>
        <Allergies />
      </BrowserRouter>
    );
  });
});
