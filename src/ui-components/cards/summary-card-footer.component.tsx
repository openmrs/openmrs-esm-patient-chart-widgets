import React from "react";
import { Link } from "react-router-dom";
import styles from "./summary-card-footer.css";
import { useTranslation } from "react-i18next";

export default function SummaryCardFooter(props: SummaryCardFooterProps) {
  const { t } = useTranslation();

  if (!props.linkTo) {
    return (
      <div className={styles.footer}>
        <p className="omrs-bold">{t("see all", "See all")}</p>
      </div>
    );
  }
  return (
    <div className={`${styles.footer}`}>
      <svg className="omrs-icon" fill="var(--omrs-color-ink-medium-contrast)">
        <use xlinkHref="#omrs-icon-chevron-right" />
      </svg>
      <Link
        to={props.linkTo}
        className={`omrs-unstyled`}
        style={{ border: "none" }}
      >
        <p className="omrs-bold">{t("see all", "See all")}</p>
      </Link>
    </div>
  );
}

type SummaryCardFooterProps = {
  linkTo?: string;
};
