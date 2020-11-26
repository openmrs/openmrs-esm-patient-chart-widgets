import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { isEmpty, remove } from "lodash-es";
import { useTranslation } from "react-i18next";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-react-utils";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import {
  fetchAllLocations,
  fetchAllProviders,
  fetchDiagnosisByName,
  fetchCurrentSessionData,
  saveVisitNote
} from "./visit-notes.resource";
import {
  diagnosisType,
  obs,
  visitNotePayload,
  convertToObsPayLoad
} from "./visit-note.util";
import { DataCaptureComponentProps } from "../shared-utils";
import styles from "./visit-note.css";

const FORM_CONCEPT: string = "c75f120a-04ec-11e3-8780-2b40bef9a44b";
const ENCOUNTER_TYPE: string = "d7151f82-c1f3-4152-a605-2f9ea7414a79";
const ENCOUNTER_NOTE_CONCEPT: string = "162169AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
const CLINICIAN_ENCOUNTER_ROLE: string = "240b26f9-dd88-4172-823d-4a8bfeb7841f";

export default function VisitNotes(props: VisitNotesProp) {
  const { t } = useTranslation();
  const searchTimeOut = 300;
  const searchTermRef = useRef<HTMLInputElement>();
  const [locations, setLocations] = useState([]);
  const [providers, setProviders] = useState([]);
  const [visitDate, setVisitDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [diagnosisArray, setDiagnosisArray] = useState<diagnosisType[]>([]);
  const [diagnosisChanged, setDiagnosisChanged] = useState<boolean>();
  const [clinicalNote, setClinicalNote] = useState<string>("");
  const [, , patientUuid] = useCurrentPatient();
  const [formChanged, setFormChanged] = useState<Boolean>(false);
  const [saveButtonStatus, setSaveButtonStatus] = useState<boolean>(false);

  useEffect(() => {
    const abortController = new AbortController();
    fetchAllLocations(abortController).then(
      ({ data }) => setLocations(data.results),
      createErrorHandler()
    );

    const abortController1 = new AbortController();
    fetchAllProviders(abortController1).then(
      ({ data }) => setProviders(data.results),
      createErrorHandler()
    );

    return () => {
      abortController1.abort();
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchCurrentSessionData(abortController).then(({ data }) => {
      setCurrentSession(data);
    });
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    if (providers && currentSession) {
      setSelectedProvider(
        providers.find(provider => {
          if (provider.uuid === currentSession.currentProvider.uuid) {
            return provider;
          }
        })
      );
    }
  }, [providers, currentSession]);

  useEffect(() => {
    if (isEmpty(diagnosisArray) && isEmpty(clinicalNote)) {
      setSaveButtonStatus(true);
    } else {
      setSaveButtonStatus(false);
    }
  }, [clinicalNote, diagnosisArray, diagnosisChanged]);

  useEffect(() => {
    if (providers && currentSession) {
      setSelectedLocation(
        locations.find(
          location => location.uuid === currentSession.sessionLocation.uuid
        )
      );
    }
  }, [locations, currentSession, providers]);

  const handleSearchTermChange = debounce(searchterm => {
    setSearchTerm(searchterm);
  }, searchTimeOut);

  useEffect(() => {
    if (searchTerm) {
      fetchDiagnosisByName(searchTerm).subscribe(data => {
        setSearchResults([]);
        setSearchResults(data);
      });
    }
  }, [searchTerm]);

  useEffect(() => {
    if (isEmpty(searchTerm)) {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleDiagnosisSelected = result => {
    setSearchResults([]);
    setSearchTerm(null);
    searchTermRef.current.value = "";
    if (isEmpty(diagnosisArray)) {
      result.primary = true;
      setDiagnosisArray([result, ...diagnosisArray]);
    } else {
      setDiagnosisArray([result, ...diagnosisArray]);
    }
  };

  const handlePrimaryChange = (changedDiagnosis: diagnosisType) => {
    let value = diagnosisArray.find(
      diagnosis => diagnosis.concept.uuid === changedDiagnosis.concept.uuid
    );
    value.primary = !value.primary;
    let valueIndex = diagnosisArray.findIndex(
      diagnosis => diagnosis.concept.uuid === changedDiagnosis.concept.uuid
    );
    diagnosisArray[valueIndex] = value;
    setDiagnosisArray(diagnosisArray);
    setDiagnosisChanged(!diagnosisChanged);
  };

  const handleDiagnosisChange = (changedDiagnosis: diagnosisType) => {
    let value = diagnosisArray.find(
      diagnosis => diagnosis.concept.uuid === changedDiagnosis.concept.uuid
    );
    value.confirmed = !value.confirmed;
    let valueIndex = diagnosisArray.findIndex(
      diagnosis => diagnosis.concept.uuid === changedDiagnosis.concept.uuid
    );
    diagnosisArray[valueIndex] = value;
    setDiagnosisArray(diagnosisArray);
    setDiagnosisChanged(!diagnosisChanged);
  };

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    let observation: obs[] = [];
    observation = convertToObsPayLoad(diagnosisArray);
    if (clinicalNote) {
      observation = [
        {
          concept: ENCOUNTER_NOTE_CONCEPT,
          value: clinicalNote
        },
        ...observation
      ];
    }
    let visitNotePayLoad: visitNotePayload = {
      patient: patientUuid,
      location: selectedLocation.uuid,
      encounterProviders: [
        {
          provider: selectedProvider.uuid,
          encounterRole: CLINICIAN_ENCOUNTER_ROLE
        }
      ],
      encounterDatetime: visitDate,
      form: FORM_CONCEPT,
      encounterType: ENCOUNTER_TYPE,
      obs: observation
    };
    const abortController = new AbortController();
    saveVisitNote(abortController, visitNotePayLoad).then(response => {
      if (response.status === 201) props.closeComponent();
    }, createErrorHandler());
  };

  const exitForm = () => {
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

  const handleRemoveDiagnosis = (diagnosisToRemove: diagnosisType) => {
    remove(
      diagnosisArray,
      diagnosis => diagnosis.concept.uuid == diagnosisToRemove.concept.uuid
    );
    setDiagnosisArray(diagnosisArray);
    setDiagnosisChanged(!diagnosisChanged);
  };

  return (
    <SummaryCard name={t("visitNote", "Visit Note")}>
      {selectedLocation && (
        <form
          className={styles.visitNoteFormContainer}
          autoComplete="off"
          onSubmit={handleSubmit}
          onChange={() => {
            setFormChanged(true);
            return props.entryStarted();
          }}
        >
          <div
            className={styles.visitNotesContainer}
            style={{ marginBottom: "1.5rem" }}
          >
            <div className={styles.visitNotesInputContainer}>
              <label htmlFor="provider">{t("provider", "Provider")}</label>
              <select
                name="provider"
                id="provider"
                value={selectedProvider.uuid}
                onChange={$event => {
                  setSelectedProvider(
                    providers.find(
                      provider => provider.uuid === $event.target.value
                    )
                  );
                }}
                data-testid="provider"
              >
                {providers &&
                  providers.map(provider => {
                    return (
                      <option key={provider.uuid} value={provider.uuid}>
                        {provider.person.display}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className={styles.visitNotesInputContainer}>
              <label htmlFor="location">{t("location", "Location")}</label>
              <select
                name="location"
                id="location"
                value={selectedLocation.uuid}
                onChange={$event => setSelectedLocation($event.target.value)}
                data-testid="location"
              >
                {locations &&
                  locations.map(location => {
                    return (
                      <option key={location.uuid} value={location.uuid}>
                        {location.display}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className={styles.visitNotesInputContainer}>
              <label htmlFor="date">
                {t("date", "Date")}{" "}
                <small
                  style={{
                    fontWeight: "normal",
                    fontSize: "0.8rem",
                    fontStyle: "italic"
                  }}
                >
                  (mm/dd/yyyy)
                </small>
              </label>
              <div className="omrs-datepicker">
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={dayjs(visitDate).format("YYYY-MM-DD")}
                  onChange={$event => setVisitDate($event.target.valueAsDate)}
                  min={`${dayjs(new Date())
                    .subtract(10, "day")
                    .format("YYYY-MM-DD")}`}
                  max={`${dayjs(new Date()).format("YYYY-MM-DD")}`}
                />
                <svg className="omrs-icon" role="img">
                  <use xlinkHref="#omrs-icon-calendar"></use>
                </svg>
              </div>
            </div>
          </div>
          <div className={styles.visitNotesContainer}>
            <div
              className={styles.visitNotesContainer}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div className={styles.visitNotesInputContainer}>
                <label htmlFor="diagnosis">
                  {t(
                    "addDiagnosis",
                    "Add presumed or confirmed diagnosis (required):"
                  )}
                </label>
                <input
                  type="text"
                  name="diagnosis"
                  id="diagnosis"
                  onChange={$event =>
                    handleSearchTermChange($event.target.value)
                  }
                  ref={searchTermRef}
                  data-testid="diagnosis"
                />
                <div
                  className={`${styles.searchResultsContainer} ${
                    isEmpty(searchResults) ? styles.inVisible : ""
                  }`}
                >
                  <div className={styles.searchResults}>
                    {searchResults &&
                      searchResults.map((result, index) => (
                        <div
                          key={index}
                          onClick={() => handleDiagnosisSelected(result)}
                          onKeyPress={() => handleDiagnosisSelected(result)}
                          role="button"
                          tabIndex={0}
                        >
                          {result.conceptReferenceTerm}
                          <b>{` ${result.concept.preferredName}`}</b>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className={styles.visitNotesInputContainer}>
                <label htmlFor="clinicalNote">
                  {t("clinicalNote", "Clinical Note")}
                </label>
                <textarea
                  name="clinicalNote"
                  id="clinicalNote"
                  rows={5}
                  value={clinicalNote}
                  onChange={$event => setClinicalNote($event.target.value)}
                ></textarea>
              </div>
            </div>
            <div className={styles.diagnosisContainer}>
              <div>
                <span>{t("primaryDiagnosis", "Primary Diagnosis:")}</span>
                <hr />
                {!isEmpty(
                  diagnosisArray.filter(diagnosis => diagnosis.primary === true)
                ) ? (
                  <div>
                    {diagnosisArray &&
                      diagnosisArray
                        .filter(diagnosis => diagnosis.primary === true)
                        .map((diagnosis, index) => (
                          <div
                            key={index}
                            className={styles.primaryDiagnosisContainer}
                          >
                            <div
                              className={styles.primaryDiagnosis}
                              style={{ flex: 10 }}
                            >
                              <div className={styles.diagnosisHeader}>
                                <label>{diagnosis.concept.preferredName}</label>
                                <label>
                                  {diagnosis.conceptReferenceTermCode}
                                </label>
                              </div>
                              <div>
                                <div
                                  className={styles.diagnosisCheckBoxContainer}
                                >
                                  <div>
                                    <input
                                      type="checkbox"
                                      name="primary"
                                      id="primary"
                                      checked={diagnosis.primary}
                                      onChange={() =>
                                        handlePrimaryChange(diagnosis)
                                      }
                                    />
                                    <label htmlFor="primary">
                                      {t("primary", "Primary")}
                                    </label>
                                  </div>
                                  <div>
                                    <input
                                      type="checkbox"
                                      name="confirmed"
                                      id="confirmed"
                                      checked={diagnosis.confirmed}
                                      onChange={() =>
                                        handleDiagnosisChange(diagnosis)
                                      }
                                    />
                                    <label htmlFor="confirmed">
                                      {t("confirmed", "Confirmed")}
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              style={{ flex: 1 }}
                              className={styles.closeButton}
                            >
                              <svg
                                style={{ height: "1rem", width: "1rem" }}
                                onClick={() => handleRemoveDiagnosis(diagnosis)}
                              >
                                <use xlinkHref="#omrs-icon-close"></use>
                              </svg>
                            </div>
                          </div>
                        ))}
                  </div>
                ) : (
                  <div style={{ marginBottom: "1.625rem" }}>
                    {t("notChosen", "Not chosen")}
                  </div>
                )}
              </div>
              <div>
                <span>{t("secondaryDiagnoses", "Secondary Diagnoses:")}</span>
                <hr />
                {!isEmpty(
                  diagnosisArray.filter(
                    diagnosis => diagnosis.primary === false
                  )
                ) ? (
                  <>
                    {diagnosisArray &&
                      diagnosisArray
                        .filter(diagnosis => diagnosis.primary === false)
                        .map((diagnosis, index) => {
                          return (
                            <div
                              key={index}
                              className={styles.primaryDiagnosisContainer}
                            >
                              <div
                                className={styles.primaryDiagnosis}
                                style={{ flex: 10 }}
                              >
                                <div className={styles.diagnosisHeader}>
                                  <label>
                                    {diagnosis.concept.preferredName}
                                  </label>
                                  <label>
                                    {diagnosis.conceptReferenceTermCode}
                                  </label>
                                </div>
                                <div>
                                  <div
                                    className={
                                      styles.diagnosisCheckBoxContainer
                                    }
                                  >
                                    <div>
                                      <input
                                        type="checkbox"
                                        name="primary"
                                        id="primary"
                                        checked={diagnosis.primary}
                                        onChange={$event =>
                                          handlePrimaryChange(diagnosis)
                                        }
                                      />
                                      <label htmlFor="primary">
                                        {t("primary", "Primary")}
                                      </label>
                                    </div>
                                    <div>
                                      <input
                                        type="checkbox"
                                        name="confirmed"
                                        id="confirmed"
                                        checked={diagnosis.confirmed}
                                        onChange={() =>
                                          handleDiagnosisChange(diagnosis)
                                        }
                                      />
                                      <label htmlFor="confirmed">
                                        {t("confirmed", "Confirmed")}
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                style={{ flex: 1 }}
                                className={styles.closeButton}
                              >
                                <svg
                                  style={{ height: "1rem", width: "1rem" }}
                                  onClick={() =>
                                    handleRemoveDiagnosis(diagnosis)
                                  }
                                >
                                  <use xlinkHref="#omrs-icon-close"></use>
                                </svg>
                              </div>
                            </div>
                          );
                        })}
                  </>
                ) : (
                  <div style={{ marginBottom: "1.625rem" }}>
                    {t("none", "None")}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.visitNoteButtonContainer}>
            <button
              type="button"
              onClick={exitForm}
              className="omrs-btn omrs-outlined-neutral"
            >
              {t("cancel", "Cancel")}
            </button>
            <button
              type="submit"
              className={`${
                saveButtonStatus
                  ? "omrs-btn omrs-outlined-neutral"
                  : "omrs-btn omrs-filled-action"
              }`}
              disabled={saveButtonStatus}
            >
              {t("save", "Save")}
            </button>
          </div>
        </form>
      )}
    </SummaryCard>
  );
}

type VisitNotesProp = DataCaptureComponentProps & {};

VisitNotes.defaultProps = {
  entryStarted: () => {},
  entryCancelled: () => {},
  entrySubmitted: () => {},
  closeComponent: () => {}
};
