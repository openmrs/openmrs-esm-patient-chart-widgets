import React, { useState, useEffect, useRef } from "react";

export default function CustomOverflowMenuComponent(props) {
  const [showMenu, toggleShowMenu] = useState(false);
  const { menuTitle, children } = props;
  const wrapperRef = useRef(null);
  useEffect(() => {
    /**
     * Toggle showMenu if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        toggleShowMenu(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div
      data-overflow-menu
      className="bx--overflow-menu"
      style={{
        width: "auto",
        height: "auto",
        marginBottom: "-1.5rem",
        marginTop: "-1.25rem"
      }}
      ref={wrapperRef}
    >
      <button
        className={`bx--overflow-menu__trigger ${showMenu &&
          "bx--overflow-menu--open"}`}
        aria-haspopup="true"
        aria-expanded={showMenu}
        id="custom-actions-overflow-menu-trigger"
        aria-controls="custom-actions-overflow-menu"
        onClick={() => toggleShowMenu(!showMenu)}
        style={{
          width: "auto",
          height: "auto",
          padding: "1rem",
          color: "#0f62fe",
          boxShadow: showMenu ? "0 2px 6px 0 rgb(0 0 0 / 30%)" : "none"
        }}
      >
        {menuTitle}
      </button>
      <div
        className="bx--overflow-menu-options bx--overflow-menu--flip"
        tabIndex={0}
        data-floating-menu-direction="bottom"
        role="menu"
        aria-labelledby="custom-actions-overflow-menu-trigger"
        id="custom-actions-overflow-menu"
        style={{
          backgroundColor: "#f4f4f4",
          display: showMenu ? "block" : "none"
        }}
      >
        <ul className="bx--overflow-menu-options__content">{children}</ul>
        <span></span>
      </div>
    </div>
  );
}
