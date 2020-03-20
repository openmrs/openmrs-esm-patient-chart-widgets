import React from "react";
import { cleanup, render, wait } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Notes from "./notes.component";

describe("<NotesComponent />", () => {
  let wrapper: any;

  afterEach(cleanup);

  xit("renders without dying", async () => {
    wrapper = render(
      <BrowserRouter>
        <Notes />
      </BrowserRouter>
    );
    await wait(() => {
      expect(wrapper).toBeTruthy();
    });
  });
});
