import {
  openmrsObservableFetch,
  openmrsFetch,
  fhirBaseUrl
} from "@openmrs/esm-api";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { Vitals } from "./vitals-form.component";
import { FHIRResource } from "../../types/fhir-resource";

const SYSTOLIC_BLOOD_PRESSURE_CONCEPT = "5085AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
const DIASTOLIC_BLOOD_PRESSURE_CONCEPT = "5086AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
const PULSE_CONCEPT = "5087AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
const TEMPERATURE_CONCEPT = "5088AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
const OXYGENATION_CONCEPT = "5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
const HEIGHT_CONCEPT = "5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
const WEIGHT_CONCEPT = "5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
const VITALS_ENCOUNTER_TYPE = "67a71486-1a54-468f-ac3e-7091a9a79584";
const VITALS_FORM = "a000cb34-9ec1-4344-a1c8-f692232f6edd";
const DEFAULT_PAGE_SIZE = 100;
export type PatientVitals = {
  id: String;
  date: Date;
  systolic?: String;
  diastolic?: String;
  pulse?: String;
  temperature?: String;
  oxygenation?: String;
  height?: string;
  weight?: string;
};

export function performPatientsVitalsSearch(
  patientID: string
): Observable<PatientVitals[]> {
  return openmrsObservableFetch<VitalsFetchResponse>(
    `${fhirBaseUrl}/Observation?subject:Patient=${patientID}&code=${SYSTOLIC_BLOOD_PRESSURE_CONCEPT},${DIASTOLIC_BLOOD_PRESSURE_CONCEPT},${PULSE_CONCEPT},${TEMPERATURE_CONCEPT},${OXYGENATION_CONCEPT},${HEIGHT_CONCEPT},${WEIGHT_CONCEPT}&_count=${DEFAULT_PAGE_SIZE}`
  ).pipe(
    map(({ data }) => {
      return data.entry;
    }),
    map(entries => entries?.map(entry => entry.resource) ?? []),
    map(vitals => {
      return formatVitals(
        vitals.filter(vital =>
          vital.code.coding.some(
            sys => sys.code === SYSTOLIC_BLOOD_PRESSURE_CONCEPT
          )
        ),
        vitals.filter(vital =>
          vital.code.coding.some(
            sys => sys.code === DIASTOLIC_BLOOD_PRESSURE_CONCEPT
          )
        ),
        vitals.filter(vital =>
          vital.code.coding.some(sys => sys.code === PULSE_CONCEPT)
        ),
        vitals.filter(vital =>
          vital.code.coding.some(sys => sys.code === TEMPERATURE_CONCEPT)
        ),
        vitals.filter(vital =>
          vital.code.coding.some(sys => sys.code === OXYGENATION_CONCEPT)
        ),
        vitals.filter(vital =>
          vital.code.coding.some(sys => sys.code === HEIGHT_CONCEPT)
        ),
        vitals.filter(vital =>
          vital.code.coding.some(sys => sys.code === WEIGHT_CONCEPT)
        )
      );
    })
  );
}

function formatVitals(
  systolicBloodPressure,
  diastolicBloodPressure,
  pulseData,
  temperatureData,
  oxygenationData,
  heightData,
  weightData
): PatientVitals[] {
  let patientVitals: PatientVitals;
  const systolicDates = getDatesIssued(systolicBloodPressure);
  const diastolicDates = getDatesIssued(diastolicBloodPressure);

  const uniqueDates = Array.from(
    new Set(systolicDates?.concat(diastolicDates))
  ).sort(latestFirst);

  return uniqueDates.map(date => {
    const systolic = systolicBloodPressure.find(
      systolic => systolic.issued === date
    );
    const diastolic = diastolicBloodPressure.find(
      diastolic => diastolic.issued === date
    );
    const pulse = pulseData.find(pulse => pulse.issued === date);
    const temperature = temperatureData.find(
      temperature => temperature.issued === date
    );
    const oxygenation = oxygenationData.find(
      oxygenation => oxygenation.issued === date
    );
    const height = heightData.find(height => height.issued === date);
    const weight = weightData.find(weight => weight.issued === date);

    return (patientVitals = {
      id: systolic && systolic?.encounter?.reference.replace("Encounter/", ""),
      date: systolic && systolic.issued,
      systolic: systolic && systolic.valueQuantity.value,
      diastolic: diastolic && diastolic.valueQuantity.value,
      pulse: pulse && pulse.valueQuantity.value,
      temperature: temperature && temperature.valueQuantity.value,
      oxygenation: oxygenation && oxygenation.valueQuantity.value,
      weight: weight && weight.valueQuantity.value,
      height: height && height.valueQuantity.value
    });
  });
}

function getDatesIssued(vitalsArray): Array<string> {
  return vitalsArray.map(vitals => vitals.issued);
}

function latestFirst(a: string, b: string) {
  return new Date(b).getTime() - new Date(a).getTime();
}

export function getPatientsLatestVitals(
  patientUuuid: string,
  abortController: AbortController
) {
  return openmrsFetch(
    `/ws/rest/v1/encounter?patient=${patientUuuid}&v=custom:(uuid,encounterDatetime,obs:(uuid,value))`,
    { signal: abortController.signal }
  );
}

export function savePatientVitals(
  patientUuid: string,
  vitals: Vitals,
  encounterDatetime: Date,
  abortController: AbortController,
  location: string
) {
  return openmrsFetch(`/ws/rest/v1/encounter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    signal: abortController.signal,
    body: {
      patient: patientUuid,
      encounterDatetime: encounterDatetime,
      location: location,
      encounterType: VITALS_ENCOUNTER_TYPE,
      form: VITALS_FORM,
      obs: isVitalValid(vitals)
    }
  });
}

function isVitalValid(vitals: Vitals): any[] {
  return Object.entries(vitals)
    .filter(el => el[1] != null)
    .map(validVitals => {
      switch (validVitals[0]) {
        case "systolicBloodPressure":
          return {
            concept: SYSTOLIC_BLOOD_PRESSURE_CONCEPT,
            value: vitals.systolicBloodPressure
          };
        case "diastolicBloodPressure":
          return {
            concept: DIASTOLIC_BLOOD_PRESSURE_CONCEPT,
            value: vitals.diastolicBloodPressure
          };
        case "heartRate":
          return {
            concept: PULSE_CONCEPT,
            value: vitals.heartRate
          };
        case "oxygenSaturation":
          return {
            concept: OXYGENATION_CONCEPT,
            value: vitals.oxygenSaturation
          };
        case "temperature":
          return {
            concept: TEMPERATURE_CONCEPT,
            value: vitals.temperature
          };
        case "weight":
          return {
            concept: WEIGHT_CONCEPT,
            value: vitals.weight
          };
        case "height":
          return {
            concept: HEIGHT_CONCEPT,
            value: vitals.height
          };
        default:
          return null;
      }
    });
}

export function editPatientVitals(
  patientUuid: string,
  vitals: Vitals,
  encounterDatetime: Date,
  abortController: AbortController,
  encounterUuid: string,
  location: string
) {
  return openmrsFetch(`/ws/rest/v1/encounter/${encounterUuid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    signal: abortController.signal,
    body: {
      encounterDatetime: encounterDatetime,
      location: location,
      patient: patientUuid,
      obs: isVitalValid(vitals),
      orders: []
    }
  });
}

export function getSession(abortController: AbortController) {
  return openmrsFetch(`/ws/rest/v1/appui/session`, {
    signal: abortController.signal
  });
}

type VitalsFetchResponse = {
  entry: Array<FHIRResource>;
  id: string;
  resourceType: string;
  total: number;
  type: string;
};
