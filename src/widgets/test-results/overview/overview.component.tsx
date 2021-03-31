import React from "react";
import DataTableSkeleton from "carbon-components-react/lib/components/DataTableSkeleton";
import { useParams } from "react-router-dom";
import useOverviewData from "./useOverviewData";
import { Main, Card } from "./helpers";
import withWorkspaceRouting from "../withWorkspaceRouting";
import CommonOverview from "./common-overview";

const LabResults: React.FC = () => {
  const { patientUuid } = useParams<{
    patientUuid: string;
    panelUuid: string;
  }>();

  const { overviewData, loaded, error } = useOverviewData(patientUuid);

  return (
    <Main>
      {loaded ? (
        <CommonOverview {...{ overviewData, patientUuid }} />
      ) : (
        <Card>
          <DataTableSkeleton columnCount={3} />
        </Card>
      )}
    </Main>
  );
};

export default withWorkspaceRouting(LabResults);
