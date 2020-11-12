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
  TableCell
} from "carbon-components-react";
import "./empty-state.scss";

import { DataCaptureComponentProps } from "../../widgets/shared-utils";
import EmptyDataIllustration from "./empty-data-illustration.component";
import ErrorIllustration from "./error-illustration.component";

export default function EmptyState(props: EmptyStateProps) {
  const { t } = useTranslation();

  const EmptyDataView = () => (
    <>
      <EmptyDataIllustration />
      <p className="empty-state__content">
        <Trans
          i18nKey="emptyStateText"
          values={{ displayText: props.displayText.toLowerCase() }}
        >
          There are no {props.displayText.toLowerCase()} to display for this
          patient
        </Trans>
      </p>
      {props.showComponent && (
        <>
          <p>
            <Link
              className="empty-state__action"
              onClick={() =>
                props.showComponent(props.addComponent, props.name)
              }
            >
              {t("record", "Record")} {props.displayText.toLowerCase()}
            </Link>
          </p>
          <br />
        </>
      )}
    </>
  );

  const ErrorManagementView = () => (
    <>
      <ErrorIllustration />
      <p className="empty-state__heading">
        <Trans
          i18nKey="errorStateText"
          values={{ widgetName: props.name.toLowerCase() }}
        >
          Sorry, there was a server error.
        </Trans>
      </p>
    </>
  );

  return (
    <DataTable
      rows={[]}
      headers={[]}
      render={() => (
        <TableContainer title={props.name}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  {props.hasError ? <ErrorManagementView /> : <EmptyDataView />}
                </TableCell>
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
