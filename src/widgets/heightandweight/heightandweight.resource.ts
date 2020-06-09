import { openmrsObservableFetch, fhirBaseUrl } from "@openmrs/esm-api";
import { map } from "rxjs/operators";
import { formatDate, calculateBMI } from "./heightandweight-helper";
import { VitalsConfig } from "../../config-schemas/vitals-config";
import { FHIRResource } from "../../types/fhir-resource";

export function getDimensions(vitalsConfig: VitalsConfig, patientId: string) {
  return getDimensionsObservations(vitalsConfig, patientId).pipe(
    map(data => (data ? formatDimensions(data.weights, data.heights) : []))
  );
}

function getDimensionsObservations(
  vitalsConfig: VitalsConfig,
  patientId: string
) {
  const HEIGHT_CONCEPT = vitalsConfig.vitalsConcepts.HEIGHT_CONCEPT;
  const WEIGHT_CONCEPT = vitalsConfig.vitalsConcepts.WEIGHT_CONCEPT;
  const DEFAULT_PAGE_SIZE = 100;
  return openmrsObservableFetch<DimensionFetchResponse>(
    `${fhirBaseUrl}/Observation?subject:Patient=${patientId}&code=${WEIGHT_CONCEPT},${HEIGHT_CONCEPT}&_count=${DEFAULT_PAGE_SIZE}`
  ).pipe(
    map(({ data }) => data.entry),
    map(entries => entries?.map(entry => entry.resource)),
    map(dimensions => {
      return {
        heights: dimensions?.filter(dimension =>
          dimension.code.coding.some(sys => sys.code === HEIGHT_CONCEPT)
        ),
        weights: dimensions?.filter(dimension =>
          dimension.code.coding.some(sys => sys.code === WEIGHT_CONCEPT)
        )
      };
    })
  );
}

function formatDimensions(weights, heights) {
  const weightDates = getDatesIssued(weights);
  const heightDates = getDatesIssued(heights);
  const uniqueDates = Array.from(
    new Set(weightDates?.concat(heightDates))
  ).sort(latestFirst);

  return uniqueDates.map(date => {
    const weight = weights.find(weight => weight.issued === date);
    const height = heights.find(height => height.issued === date);
    return {
      id: weight && weight?.encounter?.reference?.replace("Encounter/", ""),
      weight: weight ? weight.valueQuantity.value : weight,
      height: height ? height.valueQuantity.value : height,
      date: formatDate(date),
      bmi:
        weight && height
          ? calculateBMI(weight.valueQuantity.value, height.valueQuantity.value)
          : null,
      obsData: {
        weight: weight,
        height: height
      }
    };
  });
}

function latestFirst(a, b) {
  return new Date(b).getTime() - new Date(a).getTime();
}

function getDatesIssued(dimensionArray): string[] {
  return dimensionArray?.map(dimension => dimension.issued);
}

type DimensionFetchResponse = {
  entry: Array<FHIRResource>;
  id: string;
  resourceType: string;
  total: number;
  type: string;
};
