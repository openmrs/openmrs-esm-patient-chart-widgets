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
import useOverviewData from "./useOverviewData";
import {
  RecentResultsGrid,
  Card,
  Separator,
  headers,
  formatDate,
  InfoButton,
  TypedTableRow
} from "./helpers";
import styles from "./lab-results.scss";
import { switchTo, useCurrentPatient } from "@openmrs/esm-framework";

const testPatient = "8673ee4f-e2ab-4077-ba55-4980f408773e";
const RECENT_COUNT = 2;

interface LabResultsProps {
  openTrendlineView: (uuid: string) => void;
  openTimelineView: (uuid: string) => void;
}

const LabResults: React.FC<LabResultsProps> = ({
  openTrendlineView = () => {},
  openTimelineView = () => {}
}) => {
  const [, , patientUuid] = useCurrentPatient();

  const { overviewData, loaded, error } = useOverviewData(patientUuid);

  return (
    <RecentResultsGrid>
      <div className={styles["recent-overview-header-container"]}>
        <h4 className={`${styles.productiveHeading03} ${styles.text02}`}>
          Recent Results ({RECENT_COUNT})
        </h4>
      </div>
      {loaded ? (
        overviewData
          .slice(0, RECENT_COUNT)
          .map(([title, type, data, date, uuid]) => (
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
                            onClick={() => {}}
                          >
                            Trend
                          </Button>
                        )}
                        <Button
                          kind="ghost"
                          renderIcon={Table16}
                          onClick={() => {
                            const url = `/patient/${patientUuid}/testresults/timeline/${uuid}`;
                            switchTo("workspace", url, {
                              title: "Timeline"
                            });
                          }}
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
          .reduce((acc, val, i, { length }) => {
            acc.push(val);
            if (i < length - 1) acc.push(<Separator />);
            return acc;
          }, [])
      ) : (
        <Card>
          <DataTableSkeleton columnCount={3} />
        </Card>
      )}
    </RecentResultsGrid>
  );
};

export default LabResults;
