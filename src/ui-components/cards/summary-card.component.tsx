import React, { ReactChildren } from "react";
import styles from "./summary-card.css";
import { Link } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";

export default function SummaryCard(props: SummaryCardProps) {
  const { t } = useTranslation();
  return (
    <div style={props.styles} className={`omrs-card ${styles.card}`}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          {props.link ? (
            <Link to={props.link} className={`omrs-unstyled`}>
              {contents()}
            </Link>
          ) : (
            <>{contents()}</>
          )}
        </div>
        {props.addComponent && (
          <div className={styles.headerAdd}>
            <button
              className={`omrs-unstyled ${styles.addBtn}`}
              onClick={() =>
                props.showComponent(props.addComponent, props.name)
              }
            >
              Add
            </button>
          </div>
        )}
        {props.editComponent && (
          <div className={styles.headerEdit}>
            <button
              className={`omrs-unstyled ${styles.editBtn}`}
              onClick={() =>
                props.showComponent(props.editComponent, props.name)
              }
            >
              Edit
            </button>
          </div>
        )}
        {props.editBtnUrl && (
          <div className={styles.headerEdit}>
            <button className={`omrs-unstyled ${styles.editBtn}`}>
              <Link className="omrs-unstyled" to={props.editBtnUrl}>
                Edit
              </Link>
            </button>
          </div>
        )}
      </div>
      {props.children}
    </div>
  );

  function contents() {
    return (
      <div className={styles.title}>
        <h2 className={`omrs-margin-0`}>{props.name}</h2>
        <svg className="omrs-icon" fill="rgba(0, 0, 0, 0.54)">
          <use xlinkHref="#omrs-icon-chevron-right" />
        </svg>
      </div>
    );
  }
}

type SummaryCardProps = {
  name: string;
  children: React.ReactNode;
  styles?: React.CSSProperties;
  link?: string;
  addComponent?: string | any;
  editComponent?: string | any;
  editBtnUrl?: string;
  showComponent?: Function;
};

type Styles = {};
