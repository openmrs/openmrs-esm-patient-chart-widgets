import React, { useEffect, useRef, useState } from "react";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import styles from "./immunizations-form.css";
import { DataCaptureComponentProps } from "../shared-utils";
import { useTranslation } from "react-i18next";
import { savePatientImmunization } from "./immunizations.resource";
import { mapToFhirImmunizationResource } from "./immunization-mapper";
import { useCurrentPatient } from "@openmrs/esm-api";
import { useHistory } from "react-router-dom";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { getStartedVisit } from "../visit/visit-utils";
import useSessionUser from "../../utils/use-session-user";

export function ImmunizationsForm(props: ImmunizationsFormProps) {
  const [vaccineName, setVaccineName] = useState("");
  const [vaccineUuid, setVaccineUuid] = useState("");
  const [immunizationObsUuid, setImmunizationObsUuid] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState(null);
  const [immunizationSequences, setImmunizationSequences] = useState([]);
  const [currentDose, setCurrentDose] = useState<ImmunizationSequence>(
    {} as ImmunizationSequence
  );
  const [vaccinationExpiration, setVaccinationExpiration] = useState(null);
  const [lotNumber, setLotNumber] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [enableCreateButtons, setEnableCreateButtons] = useState(false);
  const [enableEditButtons, setEnableEditButtons] = useState(true);
  const [viewEditForm, setViewEditForm] = useState(true);
  const [formChanged, setFormChanged] = useState<Boolean>(false);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();
  const formRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation();
  const history = useHistory();
  const today = new Date().toISOString().split("T")[0];
  const currentUser = useSessionUser();

  useEffect(() => {
    if (vaccinationDate) {
      setEnableCreateButtons(true);
    } else {
      setEnableCreateButtons(false);
    }
  }, [vaccinationDate]);

  useEffect(() => {
    if (viewEditForm && formChanged) {
      setEnableEditButtons(true);
    } else {
      setEnableEditButtons(false);
    }
  }, [viewEditForm, formChanged]);

  useEffect(() => {
    if (props.match.params) {
      const {
        immunizationObsUuid,
        vaccineName,
        vaccineUuid,
        manufacturer,
        expirationDate,
        vaccinationDate,
        lotNumber,
        sequences,
        currentDose
      }: ImmunizationFormData = props.match.params[0];

      setImmunizationObsUuid(immunizationObsUuid);
      setVaccineName(vaccineName);
      setVaccineUuid(vaccineUuid);
      setManufacturer(manufacturer);
      setVaccinationDate(vaccinationDate);
      setVaccinationExpiration(expirationDate);
      setLotNumber(lotNumber);
      setViewEditForm(false);
      if (hasSequences(sequences)) {
        setImmunizationSequences(sequences);
      }
      if (vaccineName && vaccinationDate) {
        setViewEditForm(true);
        if (hasSequences(sequences)) {
          setCurrentDose(currentDose);
        }
      }
    }
  }, [props.match.params]);

  const handleFormSubmit = event => {
    event.preventDefault();
    const currentVisitUuid = getStartedVisit?.getValue()?.visitData?.uuid;
    const currentLocationUuid = currentUser?.sessionLocation?.uuid;
    const currentProviderUuid = currentUser?.currentProvider?.uuid;

    const immunization: ImmunizationFormData = {
      patientUuid,
      immunizationObsUuid,
      vaccineName,
      vaccineUuid,
      manufacturer,
      expirationDate: vaccinationExpiration,
      vaccinationDate,
      lotNumber,
      currentDose
    };
    const abortController = new AbortController();

    savePatientImmunization(
      mapToFhirImmunizationResource(
        immunization,
        currentVisitUuid,
        currentLocationUuid,
        currentProviderUuid
      ),
      patientUuid,
      immunizationObsUuid,
      abortController
    ).then(response => {
      response.status == 200 && navigate();
    }, createErrorHandler);
    return () => abortController.abort();
  };

  function navigate() {
    history.push(`/patient/${patientUuid}/chart/immunizations`);
    props.closeComponent();
  }

  function createForm() {
    const addFormHeader = t("add vaccine", "Add Vaccine") + ": " + vaccineName;
    const editFormHeader =
      t("edit vaccine", "Edit Vaccine") + ": " + vaccineName;
    return (
      <form
        onSubmit={handleFormSubmit}
        data-testid="immunization-form"
        onChange={() => {
          setFormChanged(true);
          return props.entryStarted();
        }}
        className={styles.immunizationsForm}
        ref={formRef}
      >
        <SummaryCard
          name={viewEditForm ? editFormHeader : addFormHeader}
          styles={{
            width: "100%",
            background: "var(--omrs-color-bg-medium-contrast)",
            height: "auto"
          }}
        >
          <div className={styles.immunizationsContainerWrapper}>
            <div style={{ flex: 1, margin: "0rem 0.5rem" }}>
              {hasSequences(immunizationSequences) && (
                <div className={styles.immunizationsInputContainer}>
                  <label htmlFor="sequence">{t("sequence", "Sequence")}</label>
                  <div className="omrs-select">
                    <select
                      id="sequence"
                      name="sequence"
                      value={currentDose.sequenceNumber}
                      onChange={onDoseSelect}
                      className={`immunizationSequenceSelect`}
                      required
                    >
                      <option value="DEFAULT">
                        {t("please select", "Please select")}
                      </option>
                      {immunizationSequences.map(s => {
                        return (
                          <option
                            key={s.sequenceNumber}
                            value={s.sequenceNumber}
                          >
                            {t(s.sequenceLabel, s.sequenceLabel)}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              )}
              <div className={styles.immunizationsInputContainer}>
                <label htmlFor="vaccinationDate">
                  {t("vaccination date", "Vaccination Date")}
                </label>
                <div className="omrs-datepicker">
                  <input
                    type="date"
                    name="vaccinationDate"
                    data-testid="vaccinationDateInput"
                    max={today}
                    required
                    defaultValue={vaccinationDate}
                    onChange={evt => setVaccinationDate(evt.target.value)}
                  />
                  <svg className="omrs-icon" role="img">
                    <use xlinkHref="#omrs-icon-calendar"></use>
                  </svg>
                </div>
              </div>
              <div className={styles.immunizationsInputContainer}>
                <label htmlFor="vaccinationExpiration">
                  {t("expiration date", "Expiration Date")}
                </label>
                <div className="omrs-datepicker">
                  <input
                    type="date"
                    name="vaccinationExpiration"
                    data-testid="vaccinationExpirationInput"
                    defaultValue={vaccinationExpiration}
                    onChange={evt => setVaccinationExpiration(evt.target.value)}
                  />
                  <svg className="omrs-icon" role="img">
                    <use xlinkHref="#omrs-icon-calendar"></use>
                  </svg>
                </div>
              </div>
              <div className={styles.immunizationsInputContainer}>
                <label htmlFor="lotNumber">
                  {t("lot number", "Lot Number")}
                </label>
                <div className="omrs-input-group">
                  <input
                    className="omrs-input-outlined"
                    type="number"
                    data-testid="lotNumberInput"
                    style={{ height: "2.75rem" }}
                    defaultValue={lotNumber}
                    onChange={evt => setLotNumber(evt.target.value)}
                  />
                </div>
              </div>
              <div className={styles.immunizationsInputContainer}>
                <label htmlFor="manufacturer">
                  {t("manufacturer", "Manufacturer")}
                </label>
                <div className="omrs-input-group">
                  <input
                    className="omrs-input-outlined"
                    type="text"
                    data-testid="manufacturerInput"
                    style={{ height: "2.75rem" }}
                    defaultValue={manufacturer}
                    onChange={evt => setManufacturer(evt.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </SummaryCard>
        <div
          className={
            enableCreateButtons || enableEditButtons
              ? `${styles.buttonStyles} ${styles.buttonStylesBorder}`
              : styles.buttonStyles
          }
        >
          <button
            type="button"
            className="omrs-btn omrs-outlined-neutral omrs-rounded"
            style={{ width: "50%" }}
            onClick={closeForm}
          >
            {t("cancel", "Cancel")}
          </button>
          <button
            type="submit"
            style={{ width: "50%" }}
            className={
              enableCreateButtons || enableEditButtons
                ? "omrs-btn omrs-filled-action omrs-rounded"
                : "omrs-btn omrs-outlined omrs-rounded"
            }
            disabled={viewEditForm ? !enableEditButtons : !enableCreateButtons}
          >
            {t("save", "Save")}
          </button>
        </div>
      </form>
    );
  }

  const closeForm = event => {
    let userConfirmed: boolean = false;
    if (formChanged) {
      userConfirmed = confirm(
        "There is ongoing work, are you sure you want to close this tab?"
      );
    }

    if (userConfirmed && formChanged) {
      props.entryCancelled();
      history.push(`/patient/${patientUuid}/chart/immunizations`);
      props.closeComponent();
    } else if (!formChanged) {
      props.entryCancelled();
      history.push(`/patient/${patientUuid}/chart/immunizations`);
      props.closeComponent();
    }
  };

  const onDoseSelect = event => {
    const currentDose =
      immunizationSequences.find(s => s.sequenceNumber == event.target.value) ||
      {};
    setCurrentDose(currentDose);
  };

  return <div>{createForm()}</div>;
}

ImmunizationsForm.defaultProps = {
  entryStarted: () => {},
  entryCancelled: () => {},
  entrySubmitted: () => {},
  closeComponent: () => {}
};

function hasSequences(sequences) {
  return sequences && sequences?.length > 0;
}

type ImmunizationsFormProps = DataCaptureComponentProps & {
  match: any;
};

type ImmunizationSequence = {
  sequenceLabel: string;
  sequenceNumber: number;
};

type ImmunizationFormData = {
  patientUuid: string;
  immunizationObsUuid: string;
  vaccineName: string;
  vaccineUuid: string;
  manufacturer: string;
  expirationDate: string;
  vaccinationDate: string;
  lotNumber: string;
  currentDose: ImmunizationSequence;
  sequences?: Array<ImmunizationSequence>;
};
