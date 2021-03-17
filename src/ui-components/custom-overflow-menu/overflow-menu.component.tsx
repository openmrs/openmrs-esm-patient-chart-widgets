import React, { useState, useEffect } from "react";
import { OverflowMenuVertical24 } from "@carbon/icons-react";
import CustomOverflowMenuItem from "./overflow-menu-item.component";

export default function CustomOverflowMenuComponent() {
  useEffect(() => {
    var script = document.createElement("script");
    script.src =
      "https://unpkg.com/carbon-components/scripts/carbon-components.min.js";

    document.body.appendChild(script);
  }, []);

  return (
    <div
      data-overflow-menu
      className="bx--overflow-menu"
      style={{
        width: "auto",
        height: "auto"
      }}
    >
      <button
        className="bx--overflow-menu__trigger"
        aria-haspopup="true"
        aria-expanded="false"
        id="custom-actions-overflow-menu-trigger"
        aria-controls="custom-actions-overflow-menu"
        style={{
          width: "auto",
          height: "auto",
          padding: "0.5rem",
          color: "#0f62fe"
        }}
      >
        Actions <OverflowMenuVertical24 />
      </button>
      <div
        className="bx--overflow-menu-options bx--overflow-menu--flip"
        tabIndex={0}
        data-floating-menu-direction="bottom"
        role="menu"
        aria-labelledby="custom-actions-overflow-menu-trigger"
        id="custom-actions-overflow-menu"
        style={{
          minWidth: "15rem"
        }}
      >
        <ul className="bx--overflow-menu-options__content">
          <CustomOverflowMenuItem itemText="Start Visit" />
          <CustomOverflowMenuItem itemText="Edit Patient Details" />
          <CustomOverflowMenuItem itemText="Mark Patient Deceased" />
          <CustomOverflowMenuItem itemText="Add Past Visit" />
        </ul>
        <span></span>
      </div>
    </div>
  );
}
