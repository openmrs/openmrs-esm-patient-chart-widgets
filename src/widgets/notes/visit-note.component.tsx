import React, { useState, useEffect, useRef, Fragment } from "react";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import styles from "./visit-note.css";
import {
  fetchAllLoccations,
  fetchAllProviders,
  fetchDiagnosisByName,
  fetchCurrentSessionData,
  saveVisitNote
} from "./visit-notes.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { isEmpty, remove } from "lodash-es";
import { useCurrentPatient } from "@openmrs/esm-api";
import {
  diagnosisType,
  obs,
  visitNotePayload,
  convertToObsPayLoad
} from "./visit-note.util";

const FORM_CONCEPT: string = "c75f120a-04ec-11e3-8780-2b40bef9a44b";
const ENCOUNTER_TYPE: string = "d7151f82-c1f3-4152-a605-2f9ea7414a79";
const ENCOUNTER_NOTE_CONCEPT: string = "162169AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
const CLINICIAN_ENCOUNTER_ROLE: string = "240b26f9-dd88-4172-823d-4a8bfeb7841f";

export default function VisitNotes(props: VisitNotesProp) {
  const searchTimeOut = 300;
  const [locations, setLocations] = useState([]);
  const [providers, setProviders] = useState([]);
  const [visitDate, setVisitDate] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState(null);
  const searchTermRef = useRef<HTMLInputElement>();
  const [currentSession, setCurrentSession] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [diagnosisArray, setDiagnosisArray] = useState<diagnosisType[]>([]);
  const [hasChanged, setHasChanged] = useState<boolean>();
  const [clinicalNote, setClinicalNote] = useState<string>("");
  const [isLoadingPatient, patient, patientUuid] = useCurrentPatient();
  const [formChanged, setFormChanged] = useState<Boolean>(false);

  useEffect(() => {
    const abortController = new AbortController();
    fetchAllLoccations(abortController).then(
      ({ data }) => setLocations(data.results),
      createErrorHandler()
    );

    const abortController1 = new AbortController();
    fetchAllProviders(abortController1).then(
      ({ data }) => setProviders(data.results),
      createErrorHandler()
    );
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchCurrentSessionData(abortController).then(({ data }) => {
      setCurrentSession(data);
    });
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
    setHasChanged(!hasChanged);
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
    setHasChanged(!hasChanged);
  };

  const handleSubmit = e => {
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
    saveVisitNote(abortController, visitNotePayLoad).then(({ data }) => {},
    createErrorHandler());
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
    setHasChanged(!hasChanged);
  };

  return (
    <SummaryCard name="Visit Note">
      {selectedLocation && selectedProvider && (
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
              <label htmlFor="provider">Provider</label>
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
              <label htmlFor="location">Location</label>
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
                Date{" "}
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
              <input
                type="date"
                name="date"
                id="date"
                value={visitDate}
                onChange={$event =>
                  setVisitDate(
                    dayjs(new Date($event.target.value)).format("YYYY-MM-DD")
                  )
                }
                min={`${dayjs(new Date())
                  .subtract(10, "day")
                  .format("YYYY-MM-DD")}`}
                max={`${dayjs(new Date()).format("YYYY-MM-DD")}`}
              />
            </div>
          </div>
          <div className={styles.visitNotesContainer}>
            <div
              className={styles.visitNotesContainer}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div className={styles.visitNotesInputContainer}>
                <label htmlFor="diagnosis">
                  Add presumed or confirmed diagnosis (required):
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
                      searchResults.map(result => (
                        <div
                          key={result.concept.uuid}
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
                <label htmlFor="clinicalNote">Clinical Note</label>
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
                <span>Primary Diagnosis:</span>
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
                                    <label htmlFor="primary">Primary</label>
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
                                    <label htmlFor="confirmed">Confirmed</label>
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
                  <div style={{ marginBottom: "1.625rem" }}>Not chosen</div>
                )}
              </div>
              <div>
                <span>Secondary Diagnoses:</span>
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
                                      <label htmlFor="primary">Primary</label>
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
                                        Confirmed
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
                  <div style={{ marginBottom: "1.625rem" }}>None</div>
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
              Cancel
            </button>
            <button type="submit" className="omrs-btn omrs-filled-action">
              Save
            </button>
          </div>
        </form>
      )}
    </SummaryCard>
  );
}

type VisitNotesProp = DataCaptureComponentProps & {};

type DataCaptureComponentProps = {
  entryStarted: Function;
  entrySubmitted: Function;
  entryCancelled: Function;
  closeComponent: Function;
};

VisitNotes.defaultProps = {
  entryStarted: () => {},
  entryCancelled: () => {},
  entrySubmitted: () => {},
  closeComponent: () => {}
};
