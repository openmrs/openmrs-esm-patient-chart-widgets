import React from "react";

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

export default function ErrorState(props: ErrorStateProps) {
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
                  <p className="empty-state__heading">
                    Error loading {props.name}
                  </p>
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

type ErrorStateProps = {
  name: string;
};
