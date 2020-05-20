import {
  openmrsObservableFetch,
  openmrsFetch,
  fhirConfig
} from "@openmrs/esm-api";
import { Observable } from "rxjs";
import { map, take, filter } from "rxjs/operators";
import { OrderMedication } from "./medication-orders-utils";
import dayjs from "dayjs";
import { toOmrsDateString } from "../../utils/omrs-dates";
import { FetchResponse } from "@openmrs/esm-api/dist/openmrs-fetch";

const CARE_SETTING: string = "6f0c9a92-6f24-11e3-af88-005056821db0";
const DURATION_UNITS_CONCEPT: string = "1732AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
const NEW_MEDICATION_ACTION: string = "NEW";
const REVISE_MEDICATION_ACTION: string = "REVISE";
const DISCONTINUE_MEDICATION_ACTION: string = "DISCONTINUE";
type PatientMedications = {
  results: {
    uuid: number;
    action: string;
    asNeed: boolean;
    asNeededCondition?: string;
    autoExpireDate: Date;
    brandName?: string;
    careSetting: { uuid: string; display: string };
    commentToFulfiller: string;
    dateActivated: Date;
    dateStopped?: Date | null;
    dispenseAsWritten: boolean;
    dose: number;
    doseUnits: { uuid: string; display: string };
    dosingInstructions: string | null;
    drug: {
      name: string;
      strenght: string;
      concept: { uuid: string; display: string };
    };
    duration: number;
    durationUnits: { uuid: string; display: string };
    encounter: { uuid: string; display: string };
    frequency: { uuid: string; display: string };
    instructions?: string | null;
    numRefills: number;
    orderNumber: string;
    orderReason: string | null;
    orderType: {
      conceptClasses: Array<any>;
      description: string;
      display: string;
      name: string;
      parent: string | null;
      retired: boolean;
      uuid: string;
    };
    orderer: { uuid: string; display: string };
    patient: { uuid: string; display: string };
    previousOrder: { uuid: string; type: string; display: string } | null;
    quantity: number;
    quantityUnits: { uuid: string; display: string };
    route: { uuid: string; display: string };
    scheduleDate: null;
    urgency: string;
  };
};

export function performPatientMedicationsSearch(
  patientID: string
): Observable<PatientMedications[]> {
  return openmrsObservableFetch(
    `${fhirConfig.baseUrl}/MedicationRequest?patient=${patientID}`
  ).pipe(
    map(({ data }) => data["entry"]),
    map((entries: any) => entries.map(entry => entry.resource)),
    take(3)
  );
}

export function fetchPatientMedications(
  patientID: string,
  status: string = "ACTIVE"
): Observable<PatientMedications[]> {
  return openmrsObservableFetch<FetchResponse<PatientMedications>>(
    `/ws/rest/v1/order?patient=${patientID}&careSetting=${CARE_SETTING}&status=${status}&v=custom:(uuid,orderNumber,accessionNumber,patient:ref,action,careSetting:ref,previousOrder:ref,dateActivated,scheduledDate,dateStopped,autoExpireDate,orderType:ref,encounter:ref,orderer:ref,orderReason,orderType,urgency,instructions,commentToFulfiller,drug:(name,strength,concept),dose,doseUnits:ref,frequency:ref,asNeeded,asNeededCondition,quantity,quantityUnits:ref,numRefills,dosingInstructions,duration,durationUnits:ref,route:ref,brandName,dispenseAsWritten)`
  ).pipe(
    map(({ data }) => {
      const meds: Array<PatientMedications> = [];
      data["results"].map(result => {
        if (result.orderType.display === "Drug Order") {
          meds.push(result);
        }
      });
      return meds;
    })
  );
}
export function fetchPatientPastMedications(
  patientID: string,
  status: string
): Observable<PatientMedications[]> {
  return openmrsObservableFetch<FetchResponse<PatientMedications>>(
    `/ws/rest/v1/order?patient=${patientID}&careSetting=${CARE_SETTING}&status=${status}&v=custom:(uuid,orderNumber,accessionNumber,patient:ref,action,careSetting:ref,previousOrder:ref,dateActivated,scheduledDate,dateStopped,autoExpireDate,orderType:ref,encounter:ref,orderer:ref,orderReason,orderType,urgency,instructions,commentToFulfiller,drug:(name,strength,concept),dose,doseUnits:ref,frequency:ref,asNeeded,asNeededCondition,quantity,quantityUnits:ref,numRefills,dosingInstructions,duration,durationUnits:ref,route:ref,brandName,dispenseAsWritten)`
  ).pipe(
    map(({ data }) => {
      const meds: Array<PatientMedications> = [];
      data["results"].map(result => {
        if (result.orderType.display === "Drug Order") {
          meds.push(result);
        }
      });
      return meds;
    })
  );
}

export function getDrugByName(
  drugName: string,
  abortController: AbortController
) {
  return openmrsFetch(
    `/ws/rest/v1/drug?q=${drugName}&v=custom:(uuid,name,strength,dosageForm:(display,uuid),concept)`,
    {
      signal: abortController.signal
    }
  );
}

export function getPatientEncounterID(
  patientUuid: string,
  abortController: AbortController
) {
  return openmrsFetch(
    `/ws/rest/v1/encounter?patient=${patientUuid}&order=desc&limit=1&v=custom:(uuid)`,
    { signal: abortController.signal }
  );
}

export function saveNewDrugOrder(
  abortController: AbortController,
  drugOrder: OrderMedication
) {
  if (drugOrder.action === NEW_MEDICATION_ACTION) {
    return openmrsFetch(`/ws/rest/v1/order`, {
      method: "POST",
      signal: abortController.signal,
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        patient: drugOrder.patientUuid,
        careSetting: drugOrder.careSetting,
        orderer: drugOrder.orderer,
        encounter: drugOrder.encounterUuid,
        drug: drugOrder.drugUuid,
        dose: drugOrder.dose,
        doseUnits: drugOrder.doseUnitsConcept,
        route: drugOrder.route,
        frequency: drugOrder.frequencyUuid,
        asNeeded: drugOrder.asNeeded,
        numRefills: drugOrder.numRefills,
        action: drugOrder.action,
        quantity: drugOrder.quantity,
        quantityUnits: drugOrder.quantityUnits,
        type: drugOrder.type,
        duration: drugOrder.duration,
        durationUnits: drugOrder.durationUnits,
        dosingInstructions: drugOrder.dosingInstructions,
        concept: drugOrder.concept,
        dateActivated: toOmrsDateString(drugOrder.dateActivated)
      }
    });
  } else if (drugOrder.action === REVISE_MEDICATION_ACTION) {
    return openmrsFetch(`/ws/rest/v1/order`, {
      method: "POST",
      signal: abortController.signal,
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        patient: drugOrder.patientUuid,
        careSetting: drugOrder.careSetting,
        orderer: drugOrder.orderer,
        encounter: drugOrder.encounterUuid,
        drug: drugOrder.drugUuid,
        dose: drugOrder.dose,
        doseUnits: drugOrder.doseUnitsConcept,
        route: drugOrder.route,
        frequency: drugOrder.frequencyUuid,
        asNeeded: drugOrder.asNeeded,
        numRefills: drugOrder.numRefills,
        action: drugOrder.action,
        quantity: drugOrder.quantity,
        quantityUnits: drugOrder.quantityUnits,
        type: drugOrder.type,
        duration: drugOrder.duration,
        durationUnits: drugOrder.durationUnits,
        previousOrder: drugOrder.previousOrder,
        dosingInstructions: drugOrder.dosingInstructions,
        dateActivated: toOmrsDateString(drugOrder.dateActivated),
        concept: drugOrder.concept
      }
    });
  } else if (drugOrder.action === DISCONTINUE_MEDICATION_ACTION) {
    return openmrsFetch(`/ws/rest/v1/order`, {
      signal: abortController.signal,
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: {
        type: drugOrder.type,
        action: drugOrder.action,
        previousOrder: drugOrder.previousOrder,
        patient: drugOrder.patientUuid,
        careSetting: drugOrder.careSetting,
        encounter: drugOrder.encounterUuid,
        orderReasonNonCoded: drugOrder.orderReasonNonCoded,
        orderer: drugOrder.orderer,
        concept: drugOrder.concept,
        drug: drugOrder.drugUuid
      }
    });
  }
}

export function getPatientDrugOrderDetails(
  abortController: AbortController,
  orderUuid: string
) {
  return openmrsFetch(
    `/ws/rest/v1/order/${orderUuid}?v=custom:(uuid,orderNumber,patient:(uuid),action,careSetting:(uuid),previousOrder:(uuid),dateActivated,encounter:(uuid),frequency,asNeeded,quantity,quantityUnits:(uuid,display),numRefills,dosingInstructions,duration,durationUnits:(uuid,display),route:(uuid,display),dose,doseUnits:(uuid,display),drug:(name,strength,uuid,concept:(uuid)),orderer:(uuid),concept)`,
    {
      signal: abortController.signal
    }
  );
}

export function getDurationUnits(abortController: AbortController) {
  return openmrsFetch(
    `/ws/rest/v1/concept/${DURATION_UNITS_CONCEPT}?v=custom:(answers:(uuid,display))`,
    abortController
  );
}

export function getMedicationByUuid(
  abortController: AbortController,
  orderUuid: string
) {
  return openmrsFetch(
    `/ws/rest/v1/order/${orderUuid}?v=custom:(uuid,route:(uuid,display),action,urgency,display,drug:(display,strength),frequency:(display),dose,doseUnits:(display),orderer,dateStopped,dateActivated,previousOrder,numRefills,duration,durationUnits:(display),dosingInstructions)`,
    {
      signal: abortController.signal
    }
  );
}
