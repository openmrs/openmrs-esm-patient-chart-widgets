import React from "react";

import loadPatientData from "./loadPatientData";
import { PatientData } from "./types";

type LoadingState = {
  sortedObs: PatientData;
  loaded: boolean;
  error: Object | undefined;
};

const usePatientResultsData = (patientUuid: string): LoadingState => {
  const [state, setState] = React.useState<LoadingState>({
    sortedObs: {},
    loaded: false,
    error: undefined
  });

  React.useEffect(() => {
    if (patientUuid)
      loadPatientData(patientUuid)
        .then(sortedObs =>
          setState({ sortedObs, loaded: true, error: undefined })
        )
        .catch(error => setState({ ...state, loaded: true, error }));
  }, [patientUuid]);

  return state;
};

export default usePatientResultsData;
