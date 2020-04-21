import React from "react";
import SummaryCard from "../cards/summary-card.component";
import styles from "./empty-state.css";

export default function EmptyState(props: EmptyStateProps) {
  return (
    <SummaryCard
      name={props.name}
      addComponent={props.addComponent}
      showComponent={props.showComponent}
    >
      <div
        style={props.styles}
        className={`omrs-medium ${styles.emptyStateText}`}
      >
        <p className="omrs-type-body-regular">{props.displayText}</p>
      </div>
    </SummaryCard>
  );
}

type EmptyStateProps = {
  name: string;
  displayText: string;
  styles?: React.CSSProperties;
  addComponent?: string | any;
  showComponent?: Function;
};
