import React from "react";
import {
  cleanup,
  render,
  wait,
  within,
  fireEvent
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import VaccinationRow from "./vaccinationRow";

const match = { params: {}, isExact: false, path: "/", url: "/" };
let wrapper;

describe("<VaccinationRow />", () => {
  afterEach(() => {
    cleanup;
  });

  it("should show just vaccine name and add button when no doses are given", async () => {
    const immunization = {
      vaccineName: "Rotavirus",
      doses: []
    };
    const { debug, container, getByText } = render(
      <BrowserRouter>
        <VaccinationRow immunization={immunization} />
      </BrowserRouter>
    );

    await wait(() => {
      const vaccinationRow = container.querySelector("tr");
      const expandButton = vaccinationRow.querySelector("use");

      expect(expandButton).toBeTruthy();
      expect(expandButton.getAttribute("xlink:href")).toBe("");
      expect(within(vaccinationRow).getByText("Rotavirus")).toBeTruthy();
      expect(within(vaccinationRow).getByText("addButton")).toBeTruthy();
    });
  });

  it("should show vaccine name with expand button and recent vaccination date when existing doses are present", async () => {
    const immunization = {
      vaccineName: "Rotavirus",
      doses: [
        {
          series: "4 Months",
          occurrenceDateTime: "2019-06-18",
          doseNumberPositiveInt: 1,
          expirationDate: "2019-06-18"
        },
        {
          series: "2 Months",
          occurrenceDateTime: "2018-06-18",
          doseNumberPositiveInt: 1,
          expirationDate: "2018-06-18"
        }
      ]
    };
    const { debug, container, getByText } = render(
      <BrowserRouter>
        <VaccinationRow immunization={immunization} />
      </BrowserRouter>
    );

    await wait(() => {
      const vaccinationRow = container.querySelector("tr");
      const expandButton = vaccinationRow.querySelector("use");

      expect(expandButton).toBeTruthy();
      expect(expandButton.getAttribute("xlink:href")).toBe(
        "#omrs-icon-chevron-down"
      );

      expect(within(vaccinationRow).getByText("Rotavirus")).toBeTruthy();
      expect(within(vaccinationRow).getByText("18-Jun-2019")).toBeTruthy();
      expect(within(vaccinationRow).getByText("addButton")).toBeTruthy();
    });
  });

  it("should show vaccine all doses of vaccine along with recent vaccination date when expanded", async () => {
    const immunization = {
      vaccineName: "Rotavirus",
      isSeries: true,
      doses: [
        {
          currentDoseLabel: "4 Months",
          occurrenceDateTime: "2019-05-18",
          doseNumberPositiveInt: 2,
          expirationDate: "2019-06-18"
        },
        {
          currentDoseLabel: "2 Months",
          occurrenceDateTime: "2018-05-18",
          doseNumberPositiveInt: 1,
          expirationDate: "2018-06-18"
        }
      ]
    };
    const { debug, container, getByText } = render(
      <BrowserRouter>
        <VaccinationRow immunization={immunization} />
      </BrowserRouter>
    );

    await wait(() => {
      const vaccinationRow = container.querySelector("tr");
      const expandButton = vaccinationRow.querySelector("use");
      fireEvent.click(expandButton);

      const seriesRows = container.querySelectorAll(".seriesTable tr");
      expect(seriesRows.length).toBe(3);

      expect(within(seriesRows[0]).getByText("SERIES")).toBeTruthy();
      expect(within(seriesRows[0]).getByText("VACCINATION DATE")).toBeTruthy();
      expect(within(seriesRows[0]).getByText("EXPIRATION DATE")).toBeTruthy();

      expect(within(seriesRows[1]).getByText("4 Months")).toBeTruthy();
      expect(within(seriesRows[1]).getByText("18-May-2019")).toBeTruthy();
      expect(within(seriesRows[1]).getByText("18-Jun-2019")).toBeTruthy();

      expect(within(seriesRows[2]).getByText("2 Months")).toBeTruthy();
      expect(within(seriesRows[2]).getByText("18-May-2018")).toBeTruthy();
      expect(within(seriesRows[2]).getByText("18-Jun-2018")).toBeTruthy();

      expect(expandButton.getAttribute("xlink:href")).toBe(
        "#omrs-icon-chevron-up"
      );
    });
  });
});
