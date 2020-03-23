import React from "react";
import { cleanup, render, wait } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Programs from "./programs.component";

describe("<ProgramsComponent />", () => {
  let wrapper: any;

  afterEach(cleanup);

  it("renders without dying", async () => {
    wrapper = render(
      <BrowserRouter>
        <Programs />
      </BrowserRouter>
    );
    await wait(() => {
      expect(wrapper).toBeTruthy();
    });
  });
});
