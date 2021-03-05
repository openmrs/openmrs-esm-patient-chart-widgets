import * as React from "react";

import usePatientResultsData from "../loadPatientTestData/usePatientResultsData";

const useOverviewData = (patientUuid: string) => {
  //   const [isLoadingPatient, existingPatient, patientUuid, patientErr] = useCurrentPatient();
  const { sortedObs, loaded, error } = usePatientResultsData(patientUuid);
  const [overviewData, setDisplayData] = React.useState([]);

  React.useEffect(() => {
    setDisplayData(
      Object.entries(sortedObs)
        .map(([panelName, { entries, type, uuid }]) => {
          const newestEntry = entries[0];

          let data;

          if (type === "Test") {
            data = [
              {
                id: newestEntry.id,
                name: panelName,
                range: newestEntry.meta?.range || "--",
                interpretation: newestEntry.meta.assessValue(newestEntry.value),
                value: newestEntry.value
              }
            ];
          } else {
            data = newestEntry.members.map(gm => ({
              id: gm.id,
              key: gm.id,
              name: gm.name,
              range: gm.meta?.range || "--",
              interpretation: gm.meta.assessValue(gm.value),
              value: gm.value
            }));
          }

          return [
            panelName,
            type,
            data,
            new Date(newestEntry.effectiveDateTime),
            uuid
          ];
        })
        .sort(([, , , date1], [, , , date2]) => date2 - date1)
    );
  }, [sortedObs]);

  return { overviewData, loaded, error };
};

export default useOverviewData;
