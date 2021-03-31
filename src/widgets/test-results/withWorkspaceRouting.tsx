import * as React from "react";
import { MemoryRouter, Route, useParams } from "react-router-dom";

const withWorkspaceRouting = WrappedComponent => props => {
  return (
    <MemoryRouter
      initialEntries={[props._extensionContext.actualExtensionSlotName]}
    >
      <Route path={props._extensionContext.attachedExtensionSlotName}>
        <WrappedComponent {...props} />
      </Route>
    </MemoryRouter>
  );
};

export default withWorkspaceRouting;
