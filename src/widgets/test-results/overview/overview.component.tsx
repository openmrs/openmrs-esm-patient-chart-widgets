import React from "react";

import { Table16, ChartLine16 } from "@carbon/icons-react";
import {
  Button,
  DataTable,
  DataTableSkeleton,
  Table,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableToolbarContent,
  TableToolbar
} from "carbon-components-react";
import { useParams, useHistory } from "react-router";
import useOverviewData from "./useOverviewData";
import {
  Main,
  Card,
  headers,
  formatDate,
  InfoButton,
  TypedTableRow
} from "./helpers";
import { useCurrentPatient } from "@openmrs/esm-framework";

const testPatient = "8673ee4f-e2ab-4077-ba55-4980f408773e";

interface LabResultsProps {
  openTrendlineView: (uuid: string) => void;
  openTimelineView: (uuid: string) => void;
}

const LabResults: React.FC<LabResultsProps> = ({
  openTrendlineView = () => {},
  openTimelineView = () => {}
}) => {
  console.log("start rendering test results");

  //   const [isLoadingPatient, existingPatient, patientUuid, patientErr] = useCurrentPatient();
  // const { patientUuid = testPatient } = useParams<{ patientUuid: string }>();
  const [, , patientUuid] = useCurrentPatient();
  const history = useHistory();

  const { overviewData, loaded, error } = useOverviewData(patientUuid);

  return (
    <Main>
      {loaded ? (
        overviewData.map(([title, type, data, date, uuid]) => (
          <Card>
            <DataTable rows={data} headers={headers}>
              {({
                rows,
                headers,
                getHeaderProps,
                getRowProps,
                getTableProps,
                getTableContainerProps
              }) => (
                <TableContainer
                  title={title}
                  description={
                    <div>
                      {formatDate(date)}
                      <InfoButton />
                    </div>
                  }
                  {...getTableContainerProps()}
                >
                  <TableToolbar>
                    <TableToolbarContent>
                      {type === "Test" && (
                        <Button
                          kind="ghost"
                          renderIcon={ChartLine16}
                          onClick={() =>
                            history.push(
                              `/lab-results/${patientUuid}/trendline/${uuid}`
                            )
                          }
                        >
                          Trend
                        </Button>
                      )}
                      <Button
                        kind="ghost"
                        renderIcon={Table16}
                        onClick={() =>
                          history.push(
                            `/lab-results/${patientUuid}/timeline/${uuid}`
                          )
                        }
                      >
                        Timeline
                      </Button>
                    </TableToolbarContent>
                  </TableToolbar>
                  <Table {...getTableProps()} isSortable>
                    <colgroup>
                      <col span={1} style={{ width: "33%" }} />
                      <col span={1} style={{ width: "33%" }} />
                      <col span={1} style={{ width: "34%" }} />
                    </colgroup>
                    <TableHead>
                      <TableRow>
                        {headers.map(header => (
                          <TableHeader
                            key={header.key}
                            {...getHeaderProps({ header })}
                            isSortable
                          >
                            {header.header}
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, i) => (
                        <TypedTableRow
                          key={row.id}
                          interpretation={data[i].interpretation}
                          {...getRowProps({ row })}
                        >
                          {row.cells.map(cell => (
                            <TableCell key={cell.id}>{cell.value}</TableCell>
                          ))}
                        </TypedTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </DataTable>
          </Card>
        ))
      ) : (
        <Card>
          <DataTableSkeleton columnCount={3} />
        </Card>
      )}
    </Main>
  );
};

export default LabResults;
