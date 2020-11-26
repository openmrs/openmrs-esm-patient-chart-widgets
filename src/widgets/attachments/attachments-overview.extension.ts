import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import AttachmentsOverview from "./attachments-overview.component";

const { bootstrap, mount, unmount } = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: AttachmentsOverview
});

export default { bootstrap, mount, unmount };
