import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { useCurrentPatient } from "@openmrs/esm-react-utils";
import Allergies from "./allergies.component";

(useCurrentPatient as jest.Mock).mockImplementation(() => []);

jest.mock("@openmrs/esm-api", () => ({
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
