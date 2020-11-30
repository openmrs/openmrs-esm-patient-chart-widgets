import React from "react";

import dayjs from "dayjs";

import {
  DataTable,
  Pagination,
  Tile,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow
} from "carbon-components-react";

import { useCurrentPatient } from "@openmrs/esm-react-utils";
import { getVisitsForPatient } from "../visit/visit.resource";
import { paginate } from "../../utils/paginate";
import styles from "./visit-actions.scss";

function PastVisitActions() {
  const [, , patientUuid] = useCurrentPatient();
  const [pastVisits, setPastVisits] = React.useState<any>(null);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [currentPage] = paginate(pastVisits, page, pageSize);

  const tableHeaders = [
    {
      key: "date",
      header: "Date"
    },
    {
      key: "time",
      header: "Time"
    },
    {
      key: "location",
      header: "Location"
    },
    {
      key: "type",
      header: "Type"
    }
  ];

  React.useEffect(() => {
    if (patientUuid) {
      const ac = new AbortController();
      const sub = getVisitsForPatient(patientUuid, ac).subscribe(
        ({ data: { results } }) => {
          const pastVisits = results.sort((a, b) =>
            a.startDatetime < b.startDatetime ? 1 : -1
          );
          setPastVisits(pastVisits);
        }
      );
      return () => sub.unsubscribe();
    }
  }, [patientUuid]);

  const getRowItems = rows =>
    rows.map(row => ({
      id: row.uuid,
      date: dayjs(row.startDatetime).format("DD - MM - YYYY"),
      time: dayjs(row.startDatetime).format("HH:mm"),
      location: row.location.name,
      type: row.visitType.name
    }));

  const RenderPastVisits = () => {
    if (pastVisits.length) {
      const rows = getRowItems(currentPage);
      return (
        <DataTable
          rows={rows}
          headers={tableHeaders}
          isSortable
          render={({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getTableProps
          }) => (
            <TableContainer>
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
              <Pagination
                page={page}
                pageSize={pageSize}
                pageSizes={[5, 10, 15, 20, 25]}
                totalItems={pastVisits.length}
                onChange={({ page, pageSize }) => {
                  setPage(page);
                  setPageSize(pageSize);
                }}
              />
            </TableContainer>
          )}
        />
      );
    }
  };

  return (
    <Tile className={styles.visitTile}>
      <h1 className={styles.heading}>Past Visits</h1>
      {pastVisits ? <RenderPastVisits /> : <p>No past visits to display</p>}
    </Tile>
  );
}

export default PastVisitActions;
