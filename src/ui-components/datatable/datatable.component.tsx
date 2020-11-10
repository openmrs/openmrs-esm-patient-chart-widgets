import React from "react";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Button,
  DataTable,
  PropTypes,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  Tile
} from "carbon-components-react";
import { Add16 } from "@carbon/icons-react";
import "./datatable.scss";

const WidgetDataTable = ({
  title,
  rows,
  headers,
  linkTo,
  addComponent,
  showComponent
}: WidgetDataTableProps) => {
  const { t } = useTranslation();

  return (
    <DataTable
      rows={rows}
      headers={headers}
      render={({
        rows,
        headers,
        getHeaderProps,
        getRowProps,
        getTableProps
      }) => (
        <TableContainer title={title}>
          <TableToolbar>
            <TableToolbarContent>
              {addComponent && (
                <Button
                  kind="ghost"
                  renderIcon={Add16}
                  iconDescription="Add"
                  onClick={() => showComponent(addComponent, name)}
                >
                  {t("add", "Add")}
                </Button>
              )}
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
              {/* TODO: Fix issue with cell width below */}
              {linkTo && (
                <TableRow>
                  <TableCell>
                    <Link to={linkTo}>{t("seeAll", "See all")}</Link>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    />
  );
};

export default WidgetDataTable;

type WidgetDataTableProps = {
  title: string;
  rows: any[];
  headers: any[];
  linkTo?: string;
  addComponent?: string | any;
  showComponent?: Function;
};
