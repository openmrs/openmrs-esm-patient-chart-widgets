import React from "react";
import styles from "./overflow-menu-item.scss";

export default function CustomOverflowMenuItem(props) {
  const { children } = props;
  return (
    <li
      className={`bx--overflow-menu-options__option ${styles.overflowMenuItemList}`}
    >
      {children}
    </li>
  );
}
