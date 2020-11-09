import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import {
  Button,
  DataTable,
  Link,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent
} from "carbon-components-react";
import { Add16 } from "@carbon/icons-react";
import "./datatable.scss";

export const getRowItems = rows =>
  rows.map(row => ({
    ...row
  }));

const WidgetDataTable = ({ title, rows, headers, itemCount }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <DataTable
      rows={rows}
      headers={headers}
      render={({
        rows,
        headers,
        // pageSizes,
        getHeaderProps,
        getRowProps,
        getTableProps
      }) => (
        <TableContainer title={title}>
          <TableToolbar>
            <TableToolbarContent>
              <Button kind="ghost" renderIcon={Add16} iconDescription="Add">
                {t("add", "Add")}
              </Button>
            </TableToolbarContent>
          </TableToolbar>
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map(header => (
                  <TableHeader
                    style={{ textAlign: "right" }}
                    key={header.key}
                    {...getHeaderProps({ header })}
                  >
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.id} {...getRowProps({ row })}>
                  {row.cells.map(cell => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* <Pagination
            page={page}
            pageSize={pageSize}
            pageSizes={[5]}
            totalItems={itemCount}
            onChange={({ page, pageSize }) => {
              setPage(page);
              setPageSize(pageSize);
            }}
          >
            <Link>See all</Link>
          </Pagination> */}
        </TableContainer>
      )}
    />
  );
};

export default WidgetDataTable;
