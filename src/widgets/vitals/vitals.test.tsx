import React from "react";
import { cleanup, render, wait } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Vitals from "./vitals.component";

describe("<NotesComponent />", () => {
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
