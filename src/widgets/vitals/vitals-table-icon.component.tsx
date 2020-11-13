import * as React from "react";

const VitalsTableIcon = ({ width = "40", height = "40" }) => {
  return (
    <svg width={`${width}px`} height={`${height}`} viewBox="0 0 32 32">
      <title>{"table"}</title>
      <path d="M29 5a2 2 0 00-2-2H5a2 2 0 00-2 2v22a2 2 0 002 2h22a2 2 0 002-2zm-2 0v4H5V5zm0 22H5v-4h22zm0-6H5v-4h22zm0-6H5v-4h22z" />
      <path
        data-name="&lt;Transparent Rectangle&gt;"
        fill="none"
        d="M0 0h32v32H0z"
      />
    </svg>
  );
};

export default VitalsTableIcon;
