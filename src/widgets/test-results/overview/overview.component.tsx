import React from "react";

import Table16 from "@carbon/icons-react/es/table/16";
import ChartLine16 from "@carbon/icons-react/es/chart--line/16";
import Button from "carbon-components-react/lib/components/Button";
import DataTable from "carbon-components-react/lib/components/DataTable";
import DataTableSkeleton from "carbon-components-react/lib/components/DataTableSkeleton";
import Table from "carbon-components-react/lib/components/DataTable/Table";
import TableContainer from "carbon-components-react/lib/components/DataTable/TableContainer";
import TableHead from "carbon-components-react/lib/components/DataTable/TableHead";
import TableHeader from "carbon-components-react/lib/components/DataTable/TableHeader";
import TableRow from "carbon-components-react/lib/components/DataTable/TableRow";
import TableCell from "carbon-components-react/lib/components/DataTable/TableCell";
import TableBody from "carbon-components-react/lib/components/DataTable/TableBody";
import TableToolbarContent from "carbon-components-react/lib/components/DataTable/TableToolbarContent";
import TableToolbar from "carbon-components-react/lib/components/DataTable/TableToolbar";
import { useHistory } from "react-router-dom";
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
