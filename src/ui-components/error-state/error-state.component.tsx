import React from "react";

import { Tile } from "carbon-components-react";
import { Trans, useTranslation } from "react-i18next";

import styles from "./error-state.scss";
import ErrorIllustration from "./error-illustration.component";

const EmptyState: React.FC<ErrorStateProps> = props => {
  const { t } = useTranslation();

  return (
    <Tile light>
      <h1 className={styles.heading}>{props.headerTitle}</h1>
      <ErrorIllustration />
      <p className={styles.content}>
        <Trans i18nKey="errorStateText">Sorry, there was an error</Trans>
      </p>
      <p className={styles.errMessage}>Database does not exist for this tile</p>
    </Tile>
  );
};

export default EmptyState;

type ErrorStateProps = {
  headerTitle: string;
  displayText: string;
};
