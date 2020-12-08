import React from "react";

import { Tile } from "carbon-components-react";
import { Trans, useTranslation } from "react-i18next";

import styles from "./error-state.scss";

const EmptyState: React.FC<ErrorStateProps> = ({ error, headerTitle }) => {
  const { t } = useTranslation();

  return (
    <Tile light>
      <h1 className={styles.heading}>{headerTitle}</h1>
      <p className={styles.errorMessage}>
        Error {`${error.response.status}: `}
        {error.response.statusText}
      </p>
      <p className={styles.errorCopy}>
        Sorry, there was a problem displaying this information. You can try to
        reload this page, or contact the site administrator and quote the error
        code above.
      </p>
    </Tile>
  );
};

export default EmptyState;

type ErrorStateProps = {
  error: any;
  headerTitle: string;
  displayText: string;
};
