import React from "react";

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
          There are no {props.displayText} to display for this patient.
        </Trans>
      </p>
      <br />
      {props.showComponent && (
        <Link
          onClick={() => props.showComponent(props.addComponent, props.name)}
        >
          {t("record", "Record")} {props.displayText.toLowerCase()}
        </Link>
      )}
    </>
  );

  const ErrorManagementView = () => (
    <>
      <p className="empty-state__heading">
        <Trans
          i18nKey="errorStateText"
          values={{ widgetName: props.name.toLowerCase() }}
        >
          Sorry, there was a server error.
        </Trans>
        <br />
        Database does not exist for this tile.
      </p>
      <br />
    </>
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
                  <br />
                </Tile>
              </TableRow>
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
  showComponent?: Function;
};

type RouteBasedComponentProps = {
  basePath?: string;
  match?: match;
};
