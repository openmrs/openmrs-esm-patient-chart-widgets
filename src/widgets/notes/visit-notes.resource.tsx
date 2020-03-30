import { openmrsFetch, openmrsObservableFetch } from "@openmrs/esm-api";
import { map } from "rxjs/operators";

export function fetchAllLoccations(abortController: AbortController) {
  return openmrsFetch("/ws/rest/v1/location?v=custom:(uuid,display)", {
    signal: abortController.signal
  });
}

export function fetchAllProviders(abortController: AbortController) {
  return openmrsFetch(
    "/ws/rest/v1/provider?v=custom:(person:(uuid,display),uuid)",
    {
      signal: abortController.signal
    }
  );
}

export function fetchDiagnosisByName(searchTerm: string) {
  return openmrsObservableFetch(
    `/coreapps/diagnoses/search.action?&term=${searchTerm}`
  ).pipe(
    map((response: any) => {
      return response.data.map(result => {
        return {
          concept: result.concept,
          conceptReferenceTerm: getConceptReferenceTermCode(
            result.concept.conceptMappings
          ).conceptReferenceTerm.code
        };
      });
    })
  );
}

export function fetchCurrentSessionData(abortController: AbortController) {
  return openmrsFetch(`/ws/rest/v1/appui/session`, {
    signal: abortController.signal
  });
}

function getConceptReferenceTermCode(conceptMapping: any[]): any {
  return conceptMapping.find(
    concept => concept.conceptReferenceTerm.conceptSource.name === "ICD-10-WHO"
  );
}
