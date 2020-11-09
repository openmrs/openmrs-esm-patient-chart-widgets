import React, { useState } from "react";

import { Trans, useTranslation } from "react-i18next";
import {
  DataTable,
  Link,
  TableContainer,
  Table,
  TableRow,
  TableBody,
  Tile,
  Pagination
} from "carbon-components-react";

export default function EmptyState(props: EmptyStateProps) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const ErrorManagementView = () => <p>Error loading {props.name} data.</p>;

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
              {/* <br />
              <br /> */}
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
};
