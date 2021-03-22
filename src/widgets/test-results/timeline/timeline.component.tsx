import * as React from "react";
import useScrollIndicator from "./useScroll";
import { useTimelineData } from "./useTimelineData";
import {
  Main,
  PaddingContainer,
  TimeSlots,
  Grid,
  RowStartCell,
  GridItems,
  ShadowBox
} from "./helpers";
import { ObsRecord } from "../loadPatientTestData/types";
import { MemoryRouter, Route, useParams } from "react-router-dom";

const PanelNameCorner: React.FC<{ panelName: string }> = ({ panelName }) => (
  <TimeSlots
    style={{
      gridRow: "span 1",
      position: "sticky",
      left: "0px",
      top: "0px",
      zIndex: 3
    }}
  >
    {panelName}
  </TimeSlots>
);

const DateHeaderGrid = ({
  timeColumns,
  yearColumns,
  dayColumns,
  displayShadow
}) => (
  <Grid
    dataColumns={timeColumns.length}
    style={{
      gridTemplateRows: "repeat(3, 24px)",
      position: "sticky",
      top: "0px",
      zIndex: 2,
      boxShadow: displayShadow ? "8px 0 20px 0 rgba(0,0,0,0.15)" : undefined
    }}
  >
    {yearColumns.map(({ year, size }) => {
      return (
        <TimeSlots key={year} style={{ gridColumn: `${size} span` }}>
          {year}
        </TimeSlots>
      );
    })}
    {dayColumns.map(({ day, size }) => {
      return (
        <TimeSlots key={day} style={{ gridColumn: `${size} span` }}>
          {day}
        </TimeSlots>
      );
    })}
    {timeColumns.map((time, i) => {
      return (
        <TimeSlots
          key={time + i}
          style={{ scrollSnapAlign: "start", fontWeight: 400 }}
        >
          {time}
        </TimeSlots>
      );
    })}
  </Grid>
);

const LoadingDisplay: React.FC = () => (
  <Main>
    <h1>Loading</h1>
  </Main>
);

const DataRows: React.FC<{
  rowData: Record<string, Array<ObsRecord>>;
  timeColumns: Array<string>;
  sortedTimes: Array<string>;
  displayShadow: boolean;
}> = ({ timeColumns, rowData, sortedTimes, displayShadow }) => (
  <Grid
    dataColumns={timeColumns.length}
    padding
    style={{ gridColumn: "span 2" }}
  >
    {Object.entries(rowData).map(([title, obs]) => {
      const {
        meta: { unit = "", range = "" },
        conceptClass
      } = obs.find(x => !!x);
      return (
        <React.Fragment key={conceptClass}>
          <RowStartCell {...{ unit, range, title, shadow: displayShadow }} />
          <GridItems {...{ sortedTimes, obs }} />
        </React.Fragment>
      );
    })}
  </Grid>
);

const withRouting = WrappedComponent => props => {
  return (
    <MemoryRouter
      initialEntries={[props._extensionContext.actualExtensionSlotName]}
    >
      <Route path={props._extensionContext.attachedExtensionSlotName}>
        <WrappedComponent {...props} />
      </Route>
    </MemoryRouter>
  );
};

const Timeline = () => {
  const { patientUuid, panelUuid } = useParams<{
    patientUuid: string;
    panelUuid: string;
  }>();

  const [xIsScrolled, yIsScrolled, containerRef] = useScrollIndicator(0, 32);

  const {
    data: {
      parsedTime: { yearColumns, dayColumns, timeColumns, sortedTimes },
      rowData,
      panelName
    },
    loaded
  } = useTimelineData(patientUuid, panelUuid);

  if (!loaded) return <LoadingDisplay />;

  return (
    <PaddingContainer ref={containerRef}>
      <PanelNameCorner panelName={panelName} />
      <DateHeaderGrid
        {...{
          timeColumns,
          yearColumns,
          dayColumns,
          displayShadow: yIsScrolled
        }}
      />
      <DataRows
        {...{ timeColumns, rowData, sortedTimes, displayShadow: xIsScrolled }}
      />
      <ShadowBox />
    </PaddingContainer>
  );
};

export default withRouting(Timeline);
