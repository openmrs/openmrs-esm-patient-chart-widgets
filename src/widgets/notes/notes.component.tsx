import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import NotesDetailedSummary from "./notes-detailed-summary.component";
import NoteRecord from "./note-record.component";

function Notes() {
  const path = "/patient/:patientUuid/chart/encounters/notes";

  return (
    <BrowserRouter basename={window["getOpenmrsSpaBase"]()}>
      <Switch>
        <Route exact path={path}>
          <NotesDetailedSummary />
        </Route>
        <Route exact path={`${path}/:encounterUuid`}>
          <NoteRecord />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Notes;
