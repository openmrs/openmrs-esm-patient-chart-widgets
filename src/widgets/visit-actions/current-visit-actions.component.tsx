import React from "react";

import {
  ContentSwitcher,
  FormGroup,
  RadioButton,
  RadioButtonGroup,
  Switch,
  Tile
} from "carbon-components-react";
import styles from "./visit-actions.scss";

const CurrentVisitActions: React.FC<any> = () => {
  const contextProps = [
    {
      name: "recommended",
      text: "Recommended",
      onClick: showRecommended,
      onKeyDown: () => {}
    },
    {
      name: "completed",
      text: "Completed",
      onClick: showCompleted,
      onKeyDown: () => {}
    }
  ];

  function showRecommended() {}

  function showCompleted() {}

  return (
    <Tile className={styles.visitTile}>
      <h1 className={styles.heading}>Current Visit Actions</h1>
      {/* <ContentSwitcher onChange={console.log}>
        {contextProps.map(props => (
          <Switch style={{ width: "10.063rem" }} {...props} />
        ))}
      </ContentSwitcher> */}
    </Tile>
  );
};

export default CurrentVisitActions;
