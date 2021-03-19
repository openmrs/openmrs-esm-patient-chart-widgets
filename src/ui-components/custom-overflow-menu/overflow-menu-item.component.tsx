import React from "react";

export default function CustomOverflowMenuItem(props) {
  const { onClick, itemText } = props;
  return (
    <li className="bx--overflow-menu-options__option">
      <button
        className="bx--overflow-menu-options__btn"
        role="menuitem"
        title={itemText}
        data-floating-menu-primary-focus
        onClick={onClick}
        style={{
          maxWidth: "100vw"
        }}
      >
        <span className="bx--overflow-menu-options__option-content">
          {itemText}
        </span>
      </button>
    </li>
  );
}
