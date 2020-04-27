import { useState, useEffect } from "react";
import { VisitType, getVisitTypes } from "./visit-type.resource";

export default function useVisitTypes() {
  const [visitTypes, setVisitTypes] = useState<Array<VisitType>>([]);
  useEffect(() => {
    const visitTypesSub = getVisitTypes().subscribe(
      visitTypes => {
        setVisitTypes(visitTypes);
      },
      error => {
        console.error(error);
      }
    );
    return () => visitTypesSub.unsubscribe();
  }, []);
  return [visitTypes];
}
