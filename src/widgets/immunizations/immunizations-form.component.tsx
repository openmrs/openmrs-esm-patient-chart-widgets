import React, { useEffect, useRef, useState } from "react";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import styles from "./immunizations-form.css";
import { DataCaptureComponentProps } from "../shared-utils";
import { useTranslation } from "react-i18next";
import { savePatientImmunization } from "./immunizations.resource";
import { mapToFhirImmunizationResource } from "./immunization-mapper";
import { useCurrentPatient } from "@openmrs/esm-api";
import { useHistory, match } from "react-router-dom";

export function ImmunizationsForm(props: ImmunizationsFormProps) {
  const [vaccineName, setVaccineName] = useState("");
  const [vaccineUuid, setVaccineUuid] = useState("");
  const [encounterUuid, setEncounterUuid] = useState("");
  const [immunizationObsUuid, setImmunizationObsUuid] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState(null);
  const [isSeries, setIsSeriesFlag] = useState(true);
  const [immunizationSeries, setImmunizationSeries] = useState([]);
  const [currentDose, setCurrentDose] = useState<ImmunizationDose>(
    {} as ImmunizationDose
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
        encounterUuid,
        immunizationObsUuid,
        vaccineName,
        vaccineUuid,
        manufacturer,
        expirationDate,
        vaccinationDate,
        lotNumber,
        isSeries,
        series,
        currentDose
      }: Immunization = props.match.params[0];

      setImmunizationObsUuid(immunizationObsUuid);
      setEncounterUuid(encounterUuid);
      setVaccineName(vaccineName);
      setVaccineUuid(vaccineUuid);
      setManufacturer(manufacturer);
      setVaccinationDate(vaccinationDate);
      setVaccinationExpiration(expirationDate);
      setLotNumber(lotNumber);
      setIsSeriesFlag(isSeries);
      setViewEditForm(false);
      if (isSeries) {
        setImmunizationSeries(series);
      }
      if (vaccineName && vaccinationDate) {
        setViewEditForm(true);
        if (isSeries) {
          setCurrentDose(currentDose);
        }
      }
    }
  }, [props.match.params]);

  const handleCreateFormSubmit = event => {
    event.preventDefault();
    const immunization: Immunization = {
      patientUuid: patientUuid,
      encounterUuid: encounterUuid,
      immunizationObsUuid: immunizationObsUuid,
      vaccineName: vaccineName,
      vaccineUuid: vaccineUuid,
      manufacturer: manufacturer,
      expirationDate: vaccinationExpiration,
      vaccinationDate: vaccinationDate,
      lotNumber: lotNumber,
      currentDose: currentDose,
      isSeries: isSeries,
      series: immunizationSeries
    };
    const abortController = new AbortController();

    savePatientImmunization(
      mapToFhirImmunizationResource(immunization),
      patientUuid,
      immunizationObsUuid,
      abortController
    ).then(response => {
      response.status == 200 && navigate();
    });
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
        onSubmit={handleCreateFormSubmit}
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
              {isSeries && (
                <div className={styles.immunizationsInputContainer}>
                  <label htmlFor="series">{t("series", "Series")}</label>
                  <div className="omrs-select">
                    <select
                      id="series"
                      name="series"
                      value={currentDose.value}
                      onChange={onDoseSelect}
                      className={`immunizationSeriesSelect`}
                      required
                    >
                      <option value="DEFAULT">
                        {t("please select", "Please select")}
                      </option>
                      {immunizationSeries.map(s => {
                        return (
                          <option key={s.value} value={s.value}>
                            {s.label}
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
      props.closeComponent();
    } else if (!formChanged) {
      props.entryCancelled();
      props.closeComponent();
    }
  };

  const handleEditSubmit = event => {
    event.preventDefault();
  };
  const onDoseSelect = event => {
    const currentSeries =
      immunizationSeries.find(s => s.value == event.target.value) || {};
    setCurrentDose(currentSeries);
  };

  return <div>{createForm()}</div>;
}

ImmunizationsForm.defaultProps = {
  entryStarted: () => {},
  entryCancelled: () => {},
  entrySubmitted: () => {},
  closeComponent: () => {}
};

type ImmunizationsFormProps = DataCaptureComponentProps & {
  match: any;
};

type ImmunizationDose = {
  label: string;
  value: number;
};

type Immunization = {
  patientUuid: string;
  encounterUuid: string;
  immunizationObsUuid: string;
  vaccineName: string;
  vaccineUuid: string;
  manufacturer: string;
  expirationDate: string;
  vaccinationDate: string;
  lotNumber: string;
  currentDose: ImmunizationDose;
  isSeries: boolean;
  series: Array<ImmunizationDose>;
};
