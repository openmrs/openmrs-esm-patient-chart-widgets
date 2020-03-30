import React from "react";
import { BrowserRouter } from "react-router-dom";
import VisitsNote from "./visit-note.component";

describe("<VisitNote>", () => {
  it("render without dying", () => {
    <BrowserRouter>
      <VisitsNote />
    </BrowserRouter>;
  });
});
