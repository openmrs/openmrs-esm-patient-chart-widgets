import React from "react";
import styles from "./floating-button.component.scss";
import Edit24 from "@carbon/icons-react/es/edit/24";

interface FloatingButtonProps {
  onButtonClick: () => void;
  buttonStyles?: React.CSSProperties;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  onButtonClick,
  buttonStyles
}) => (
  <Edit24
    title="floatingButton"
    className={styles.floatingButtonContainer}
    style={{ ...buttonStyles }}
    onClick={onButtonClick}
  />
);

export default FloatingButton;
