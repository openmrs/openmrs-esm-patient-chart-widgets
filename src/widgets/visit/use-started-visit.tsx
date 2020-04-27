import React, { useState, useEffect } from "react";
import { Subscription } from "rxjs";
import dayjs, { Dayjs } from "dayjs";
import { getCurrentPatientUuid } from "@openmrs/esm-api";

import { getVisitsForPatient, Visit } from "./visit.resource";

export default function useStartedVisit(props: StartedVisitProps) {
  const [startedVisit, setStartedVisit] = useState<Visit>();

  useEffect(() => {
    const getRequiredVisit = (visits: Array<Visit>) => {
      if (visits.length === 0) {
        setStartedVisit(null);
        return;
      }
      const today = dayjs(new Date());
      const todayVisitsForPassedType = visits.filter(visit => {
        return (
          visit.visitType.uuid === props.visitTypeUuid &&
          dayjs(visit.startDatetime).isSame(today, "date")
        );
      });
      if (todayVisitsForPassedType.length > 0) {
        setStartedVisit(todayVisitsForPassedType[0]);
      } else {
        setStartedVisit(null);
      }
    };
    let patientSub: Subscription;
    let visitSub: Subscription;
    patientSub = getCurrentPatientUuid().subscribe(patientUuid => {
      visitSub = getVisitsForPatient(
        patientUuid,
        new AbortController()
      ).subscribe(
        visits => {
          getRequiredVisit(visits.data.results);
        },
        error => {
          console.error("error" + error);
        }
      );
    });

    return () => {
      if (patientSub) {
        patientSub.unsubscribe();
      }
      if (visitSub) {
        visitSub.unsubscribe();
      }
    };
  }, [props.visitTypeUuid]);
  return [startedVisit, setStartedVisit];
}

export type StartedVisitProps = {
  visitTypeUuid: string;
};
