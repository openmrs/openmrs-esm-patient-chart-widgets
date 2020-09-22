import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useCurrentPatient } from "@openmrs/esm-api";
import { FetchResponse } from "@openmrs/esm-api/dist/openmrs-fetch";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { DisplayMetadata, Links } from "../types";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import {
  getDrugByName,
  getPatientEncounterID,
  getPatientDrugOrderDetails,
  getDurationUnits
} from "./medications.resource";
import { setDefaultValues, OrderMedication } from "./medication-orders-utils";
import commonMedicationJson from "./common-medication.json";
import styles from "./medication-order.css";

export default function MedicationOrder(props: MedicationOrderProps) {
  const [commonMedication, setCommonMedication] = useState<Array<Medication>>(
    []
  );
  const [drugUuid, setDrugUuid] = useState("");
  const [drugName, setDrugName] = useState("");
  const [encounterUuid, setEncounterUuid] = useState("");
  const [dose, setDose] = useState<number>(null);
  const [doseUnits, setDoseUnits] = useState("");
  const [dosageForm, setDosageForm] = useState("");
  const [frequencyUuid, setFrequencyUuid] = useState("");
  const [frequencyName, setFrequencyName] = useState("");
  const [routeUuid, setRouteUuid] = useState<string>(
    MedicationOrderConcepts.ORAL_ROUTE
  );
  const [routeName, setRouteName] = useState<string>(null);
  const [asNeeded, setAsNeeded] = useState(false);
  const [numRefills, setNumRefills] = useState(0);
  const [action, setAction] = useState("NEW");
  const [quantity, setQuantity] = useState<string>(null);
  const [duration, setDuration] = React.useState(0);
  const [durationUnit, setDurationUnit] = React.useState<string>(
    MedicationOrderConcepts.DAYS_DURATION_UNIT
  );
  const [durationUnitsArray, setDurationUnitArray] = useState([]);
  const [dosingInstructions, setDosingInstructions] = useState<string>();
  const [drugStrength, setDrugStrength] = useState<string>(null);
  const [startDate, setStartDate] = React.useState<Date>(new Date());
  const [endDate, setEndDate] = React.useState<Date>(new Date());
  const [, , patientUuid] = useCurrentPatient();
  const [previousOrder, setPreviousOrder] = useState<string>(null);
  const [concept, setConcept] = useState<string>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const abortcontroller = new AbortController();
    if (patientUuid) {
      getDrugByName(props.drugName, abortcontroller).then(
        ({
          data: {
            results: [result]
          }
        }: FetchResponse<{ results: [Drug] }>) => {
          setCommonMedication(getDrugMedication(result.uuid));
          setDrugName(result.name);
          setDrugUuid(result.uuid);
          setDoseUnits(result.dosageForm.uuid);
          setDosageForm(result.dosageForm.display);
          setDrugStrength(result.strength);
          setConcept(result.concept.uuid);
        },
        createErrorHandler
      );

      getPatientEncounterID(patientUuid, abortcontroller).then(
        ({ data }) => setEncounterUuid(data.results[0].uuid),
        createErrorHandler()
      );

      getDurationUnits(abortcontroller).then(({ data }) => {
        setDurationUnitArray(data.answers);
      }, createErrorHandler());
    }
    return () => abortcontroller.abort();
  }, [props.drugName, patientUuid]);

  useEffect(() => {
    if (startDate && durationUnitsArray) {
      let durationPeriod = durationUnitsArray.filter(duration => {
        return duration.uuid === durationUnit;
      });
      if (durationPeriod.length > 0) {
        let durationName: any = durationPeriod[0].display.substring(
          0,
          durationPeriod[0].display.lastIndexOf("s")
        );
        setEndDate(
          new Date(
            dayjs(startDate)
              .add(duration, durationName)
              .toDate()
          )
        );
      } else {
        setEndDate(
          dayjs(startDate)
            .add(duration, "day")
            .toDate()
        );
      }
    }
  }, [startDate, durationUnit, durationUnitsArray, duration]);

  useEffect(() => {
    if (
      commonMedication.length > 0 &&
      props.editProperty.length === 0 &&
      props.orderEdit.orderEdit === false
    ) {
      const [defaults] = setDefaultValues(commonMedication);
      setDoseUnits(defaults.drugUnits);
      setFrequencyUuid(defaults.frequencyConcept);
      setDose(defaults.dose);
      setRouteUuid(defaults.routeConcept);
      setRouteName(defaults.routeName);
    }
    if (props.editProperty.length > 0) {
    }
  }, [commonMedication, props.editProperty.length, props.orderEdit.orderEdit]);

  // Edit default values
  useEffect(() => {
    const ac = new AbortController();
    if (props.editProperty.length > 0) {
      getPatientDrugOrderDetails(ac, props.editProperty[0].orderUuid).then(
        ({ data }) => {
          setEncounterUuid(data.encounter.uuid);
          setStartDate(dayjs(data.dateActivated).toDate());
          setDosingInstructions(data.dosingInstructions);
          setDoseUnits(data.doseUnits.uuid);
          setDosageForm(data.doseUnits.display);
          setRouteUuid(data.route.uuid);
          setRouteName(data.route.display);
          setDose(data.dose);
          setDuration(data.duration);
          setFrequencyName(data.frequency.display);
          setFrequencyUuid(data.frequency.concept.uuid);
          setAction("REVISE");
          setNumRefills(data.numRefills);
          data.previousOrder === null
            ? setPreviousOrder(data.uuid)
            : setPreviousOrder(data.previousOrder.uuid);
        }
      );
      return () => ac.abort();
    }
  }, [props.editProperty]);

  useEffect(() => {
    if (
      frequencyUuid &&
      commonMedication.length > 0 &&
      props.editProperty.length === 0
    ) {
      setFrequencyName(
        commonMedication[0].commonFrequencies.find(
          el => el.conceptUuid === frequencyUuid
        ).name
      );
    }
  }, [commonMedication, frequencyUuid, props.editProperty]);

  useEffect(() => {
    if (props.orderEdit.orderEdit) {
      const order = props.orderEdit.order;
      setEncounterUuid(order.encounterUuid);
      setStartDate(order.dateActivated);
      setDosingInstructions(order.dosingInstructions);
      setDoseUnits(order.doseUnitsConcept);
      setDosageForm(order.dosageForm);
      setRouteUuid(order.route);
      setRouteName(order.routeName);
      setDose(Number(order.dose));
      setDuration(Number(order.duration));
      setFrequencyName(order.frequencyName);
      setFrequencyUuid(order.frequencyUuid);
      setAction(order.action);
      setNumRefills(Number(order.numRefills));
      setPreviousOrder(order.previousOrder);
    }
  }, [props.orderEdit]);

  useEffect(() => {}, [props.orderEdit]);

  const getDrugMedication = (drugUuid: string): Medication[] => {
    return commonMedicationJson.filter(
      medication => medication.uuid === drugUuid
    );
  };

  const handleIncreaseRefillClick = event => {
    setNumRefills(numRefills + 1);
  };

  const handleDecreaseRefillClick = event => {
    if (numRefills > 0) {
      setNumRefills(numRefills - 1);
    }
  };

  const handleSubmit = $event => {
    props.resetParams();
    $event.preventDefault();
    if (action === "NEW") {
      props.setOrderBasket([
        ...props.orderBasket,
        {
          patientUuid: patientUuid,
          careSetting: MedicationOrderUuids.CARE_SETTINGS,
          orderer: MedicationOrderUuids.ORDERER,
          encounterUuid: encounterUuid,
          drugUuid: drugUuid,
          dose: dose,
          doseUnitsConcept: doseUnits,
          route: routeUuid,
          frequencyUuid: frequencyUuid,
          asNeeded: asNeeded,
          numRefills: numRefills,
          action: "NEW",
          quantity: 1,
          quantityUnits: "162396AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          type: "drugorder",
          drugName: drugName,
          duration: duration,
          durationUnits: durationUnit,
          routeName: routeName,
          dosageForm: dosageForm,
          frequencyName: frequencyName,
          drugStrength: drugStrength,
          dosingInstructions: dosingInstructions,
          dateStopped: endDate,
          concept: concept,
          dateActivated: startDate
        }
      ]);
    } else {
      props.setOrderBasket([
        ...props.orderBasket,
        {
          patientUuid: patientUuid,
          careSetting: MedicationOrderUuids.CARE_SETTINGS,
          orderer: MedicationOrderUuids.ORDERER,
          encounterUuid: encounterUuid,
          drugUuid: drugUuid,
          dose: dose,
          doseUnitsConcept: doseUnits,
          route: routeUuid,
          frequencyUuid: frequencyUuid,
          asNeeded: asNeeded,
          numRefills: numRefills,
          action: "REVISE",
          quantity: 1,
          quantityUnits: "162396AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          type: "drugorder",
          drugName: drugName,
          previousOrder: previousOrder,
          duration: duration,
          durationUnits: durationUnit,
          routeName: routeName,
          dosageForm: dosageForm,
          frequencyName: frequencyName,
          drugStrength: drugStrength,
          dosingInstructions: dosingInstructions,
          dateActivated: startDate,
          dateStopped: endDate
        }
      ]);
    }
    props.hideModal();
  };

  const handleDurationChange = $event => {
    setDuration(Number($event));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.medicationOrderWrapper}>
      <SummaryCard
        name={t("orderMedication", "Order Medication")}
        styles={{
          width: "100%",
          borderRadius: "0px",
          borderBottom: "0.0625rem solid var(--omrs-color-bg-low-contrast)"
        }}
      >
        <div className={styles.medicationHeaderSummary}>
          <table>
            <tbody>
              <tr>
                <td>{drugName} &#x2013; </td>
                <td>{routeName} &#x2013; </td>
                <td>{dosageForm} &#x2013;</td>
                <td
                  style={{
                    textTransform: "uppercase"
                  }}
                >
                  {t("dose", "Dose")} <span>{`${dose} ${dosageForm}`}</span>{" "}
                  &#x2013;
                </td>
                <td>{frequencyName}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </SummaryCard>
      <div className={styles.medicationOrderDetailsContainer}>
        <div
          className={styles.medicationContainer}
          style={{
            borderRadius: "0px"
          }}
        >
          <div className={styles.doseAndFrequency}>
            <div className={styles.medicationOrderRadio}>
              <span>{t("dose", "Dose")}</span>
            </div>
            {commonMedication.length > 0 &&
              dose &&
              commonMedication[0].commonDosages.map(dosage => {
                return (
                  <div
                    className={styles.medicationOrderRadio}
                    key={dosage.dosage}
                  >
                    <input
                      type="radio"
                      name="doseUnits"
                      id={dosage.dosage}
                      defaultValue={dosage.numberOfPills}
                      defaultChecked={dose === dosage.numberOfPills}
                      onChange={$event => {
                        setDose(Number($event.target.value));
                      }}
                    />
                    <label htmlFor={dosage.dosage}>{dosage.dosage}</label>
                  </div>
                );
              })}
            <div className={styles.medicationOrderRadio}>
              <input type="radio" name="doseUnits" id="doseUnits1" />
              <label htmlFor="doseUnits1">other</label>
            </div>
          </div>
          <div className={styles.doseAndFrequency}>
            <div className={styles.medicationOrderRadio}>
              <span>{t("frequency", "Frequency")}</span>
            </div>
            {commonMedication.length > 0 &&
              frequencyUuid &&
              commonMedication[0].commonFrequencies.map(frequency => {
                return (
                  <div
                    className={styles.medicationOrderRadio}
                    key={frequency.conceptUuid}
                  >
                    <input
                      type="radio"
                      name="frequency"
                      id={frequency.name}
                      defaultValue={frequency.conceptUuid}
                      defaultChecked={frequency.conceptUuid === frequencyUuid}
                      onChange={$event => setFrequencyUuid($event.target.value)}
                    />
                    <label htmlFor={frequency.name}>{frequency.name}</label>
                  </div>
                );
              })}
            <div className={styles.medicationOrderRadio}>
              <input type="radio" name="frequency" id="otherFrequency" />
              <label htmlFor="otherFrequency">{t("other", "Other")}</label>
            </div>
          </div>
        </div>
        <div>
          <div
            className={styles.medicationContainer}
            style={{
              width: "100%",
              flexDirection: "column",
              borderRadius: "0px"
            }}
          >
            <div className={styles.medicationOrderInput}>
              <label htmlFor="startDate">{t("startDate", "Start date")}</label>
              <div className="omrs-datepicker">
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  required
                  value={toISODatePickerFormat(startDate)}
                  onChange={evt => setStartDate(evt.target.valueAsDate)}
                />
                <svg className="omrs-icon" role="img">
                  <use xlinkHref="#omrs-icon-calendar"></use>
                </svg>
              </div>
            </div>
            <div
              className={styles.medicationOrderInput}
              style={{
                flexDirection: "row",
                margin: "0.625rem 0rem"
              }}
            >
              <div
                style={{
                  flex: 1
                }}
                className={styles.omrsSelectOptions}
              >
                <label htmlFor="duration">{t("duration", "Duration")}</label>
                <label htmlFor="option">
                  <select
                    id="option"
                    onChange={$event => setDurationUnit($event.target.value)}
                    defaultChecked={true}
                    value={durationUnit}
                  >
                    {durationUnitsArray &&
                      durationUnitsArray.map(durationUnit => {
                        return (
                          <option
                            key={durationUnit.uuid}
                            value={durationUnit.uuid}
                          >
                            {durationUnit.display}
                          </option>
                        );
                      })}
                  </select>
                </label>
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "flex-end"
                }}
              >
                <div className="omrs-increment-buttons">
                  <div>
                    <button
                      type="button"
                      className="omrs-btn-icon-medium"
                      onClick={$event => {
                        if (duration > 0) {
                          setDuration(duration - 1);
                        }
                      }}
                    >
                      <svg>
                        <use xlinkHref="#omrs-icon-remove"></use>
                      </svg>
                    </button>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={duration}
                      onChange={$event =>
                        handleDurationChange($event.target.value)
                      }
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      className="omrs-btn-icon-medium"
                      onClick={$event => setDuration(duration + 1)}
                    >
                      <svg>
                        <use xlinkHref="#omrs-icon-add"></use>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
            <div className={styles.medicationOrderInput}>
              <label htmlFor="endDate">{t("endDate", "End date")}</label>
              <div className="omrs-datepicker">
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  required
                  value={toISODatePickerFormat(endDate)}
                  onChange={evt => setEndDate(evt.target.valueAsDate)}
                />
                <svg className="omrs-icon" role="img">
                  <use xlinkHref="#omrs-icon-calendar"></use>
                </svg>
              </div>
            </div>

            <div
              className={styles.medicationOrderInput}
              style={{
                margin: "1.25rem 0rem 1.0625rem 0rem",
                border: "0.0625rem solid var(--omrs-color-bg-low-contrast)"
              }}
            ></div>
            <div
              className={styles.medicationOrderInput}
              style={{
                width: "50%"
              }}
            >
              <label htmlFor="refills">{t("refills", "Refills")}</label>
              <div id="refills" className="omrs-increment-buttons">
                <div>
                  <svg
                    className="omrs-icon"
                    onClick={handleDecreaseRefillClick}
                  >
                    <use xlinkHref="#omrs-icon-remove"></use>
                  </svg>
                </div>
                <div>
                  <span>
                    <input
                      type="number"
                      value={numRefills}
                      onChange={$event =>
                        setNumRefills(Number($event.target.value))
                      }
                    />
                  </span>
                </div>
                <div>
                  <svg
                    className="omrs-icon"
                    onClick={handleIncreaseRefillClick}
                  >
                    <use xlinkHref="#omrs-icon-add"></use>
                  </svg>
                </div>
              </div>
              <label htmlFor="lastDateOfRefill">
                {t("lastDateWithRefills", "Last date with refills")}
              </label>
            </div>
          </div>
          <div
            className={styles.medicationContainer}
            style={{
              width: "100%"
            }}
          >
            <div className={styles.medicationOrderInput}>
              <label htmlFor="dosingInstructions">
                {t("dosingInstructions", "Dosing instructions")}
              </label>
              <textarea
                name="dosingInstruction"
                id="dosingInstructionTextArea"
                rows={6}
                defaultValue={dosingInstructions}
                onChange={$event => setDosingInstructions($event.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.medicationOrderFooter}>
        <button className="omrs-btn omrs-outlined-neutral">
          {t("cancel", "Cancel")}
        </button>
        <button className="omrs-btn omrs-filled-action" disabled={false}>
          {t("save", "Save")}
        </button>
      </div>
    </form>
  );
}

enum MedicationOrderUuids {
  CARE_SETTINGS = "6f0c9a92-6f24-11e3-af88-005056821db0",
  ORDERER = "e89cae4a-3cb3-40a2-b964-8b20dda2c985"
}

enum MedicationOrderConcepts {
  ORAL_ROUTE = "160240AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  DAYS_DURATION_UNIT = "1072AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
}

interface Drug {
  name: string;
  strength: string;
  uuid: string;
  dosageForm: {
    display: string;
    uuid: string;
  };
  concept: {
    conceptClass: DisplayMetadata;
    dataType: DisplayMetadata;
    display: string;
    uuid: string;
    name: {
      display: string;
      name: string;
      locale: string;
      localePreferred: boolean;
      links: Links[];
      resourceVersion: string;
      uuid: string;
    };
    set: boolean;
    version: string;
    retired: boolean;
    names: DisplayMetadata[];
  };
}

interface MedicationDetails {
  name: string;
  conceptUuid: string;
  selected?: boolean;
}

interface Medication {
  name: string;
  uuid: string;
  strength: string;
  dosageUnits: Array<{
    name: string;
    selected?: boolean;
    uuid: string;
  }>;
  route: Array<MedicationDetails>;
  commonDosages: Array<{
    dosage: string;
    numberOfPills: number;
    selected?: boolean;
  }>;
  commonFrequencies: Array<MedicationDetails>;
}

type MedicationOrderProps = {
  drugName: string;
  orderBasket?: OrderMedication[];
  setOrderBasket?: any;
  hideModal?: any;
  action?: any;
  orderUuid?: any;
  editProperty?: EditProperty[];
  resetParams?: any;
  orderEdit?: { orderEdit: Boolean; order?: OrderMedication };
};

export type EditProperty = {
  action?: string;
  drugName?: string;
  orderUuid?: string;
};

function toISODatePickerFormat(date: Date): string {
  return dayjs(date).format("YYYY-MM-DD");
}
