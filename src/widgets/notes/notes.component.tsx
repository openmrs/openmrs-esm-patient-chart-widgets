import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import NotesDetailedSummary from "./notes-detailed-summary.component";
import NoteRecord from "./note-record.component";

function Notes(props) {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={match.path}>
        <NotesDetailedSummary />
      </Route>
      <Route exact path={`${match.path}/:encounterUuid`}>
        <NoteRecord />
      </Route>
    </Switch>
  );
}

export default Notes;
