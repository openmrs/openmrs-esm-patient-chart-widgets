import React, { useState } from "react";

import { Trans, useTranslation } from "react-i18next";
import { match } from "react-router-dom";
import {
  DataTable,
  Link,
  TableContainer,
  Table,
  TableRow,
  TableBody,
  Tile
} from "carbon-components-react";

import { DataCaptureComponentProps } from "../../widgets/shared-utils";

export default function EmptyState(props: EmptyStateProps) {
  const { t } = useTranslation();

  const NoDataView = () => (
    <>
      <p className="empty-state__heading">
        <Trans
          i18nKey="emptyStateText"
          values={{ displayText: props.displayText.toLowerCase() }}
        >
          This patient has no {props.displayText} recorded in the system.
        </Trans>
      </p>
      <br />
      <Link>
        {t("add", "Add")} {props.displayText.toLowerCase()}
      </Link>
    </>
  );

  const ErrorManagementView = () => (
    <p className="empty-state__heading">
      There was a problem loading {props.name.toLowerCase()} data.
    </p>
  );

  return (
    <DataTable
      rows={[]}
      headers={[]}
      render={({}) => (
        <TableContainer title={props.name}>
          <Table>
            <TableBody>
              <TableRow>
                <Tile>
                  {props.hasError ? <ErrorManagementView /> : <NoDataView />}
                </Tile>
              </TableRow>
              <br />
            </TableBody>
          </Table>
        </TableContainer>
      )}
    />
  );
}

type EmptyStateProps = {
  hasError?: boolean;
  name: string;
  displayText: string;
  styles?: React.CSSProperties;
  addComponent?: React.FC<RouteBasedComponentProps | DataCaptureComponentProps>;
  showComponent?: () => void;
};

type RouteBasedComponentProps = {
  basePath?: string;
  match?: match;
};
