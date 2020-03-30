import React, { useState, useEffect, useRef } from "react";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import styles from "./visit-note.css";
import {
  fetchAllLoccations,
  fetchAllProviders,
  fetchDiagnosisByName,
  fetchCurrentSessionData
} from "./visit-notes.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { isEmpty, divide } from "lodash-es";

export default function VisitNotes(props: VisitNotesProp) {
  const searchTimeOut = 300;
  const [locations, SetLocations] = useState([]);
  const [providers, setProviders] = useState([]);
  const [visitDate, setVisitDate] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState(null);
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState<{
    conceptReferenceTerm: string;
    concept: any;
  }>();
  const searchTermRef = useRef<HTMLInputElement>();
  const [secondaryDiagnosis, setSecondaryDiagnosis] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    fetchAllLoccations(abortController).then(
      ({ data }) => SetLocations(data.results),
      createErrorHandler()
    );
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchAllProviders(abortController).then(
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
        setSearchResults(data);
      });
    }
  }, [searchTerm]);

  const handleDiagnosisSelected = result => {
    setSearchResults([]);
    setSearchTerm(null);
    searchTermRef.current.value = "";
    isEmpty(primaryDiagnosis)
      ? setPrimaryDiagnosis(result)
      : setSecondaryDiagnosis(result);
  };

  return (
    <SummaryCard name="Visit Note">
      {selectedLocation && selectedProvider && (
        <form className={styles.visitNoteFormContainer} autoComplete="off">
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
                onChange={$event => setSelectedProvider($event.target.value)}
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
              <label htmlFor="date">Date</label>
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
                          onClick={$event => handleDiagnosisSelected(result)}
                          onKeyPress={$event => handleDiagnosisSelected(result)}
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
                ></textarea>
              </div>
            </div>

            <div className={styles.diagnosisContainer}>
              <div>
                <span>Primary Diagnosis:</span>
                <hr />
                {!isEmpty(primaryDiagnosis) ? (
                  <div className={styles.primaryDiagnosisContainer}>
                    <div
                      className={styles.primaryDiagnosis}
                      style={{ flex: 10 }}
                    >
                      {primaryDiagnosis && (
                        <div className={styles.diagnosisHeader}>
                          <label>
                            {primaryDiagnosis.concept.preferredName}
                          </label>
                          <label>{primaryDiagnosis.conceptReferenceTerm}</label>
                        </div>
                      )}
                      <div>
                        <div className={styles.diagnosisCheckBoxContainer}>
                          <div>
                            <input
                              type="checkbox"
                              name="primary"
                              id="primary"
                            />
                            <label htmlFor="primary">Primary</label>
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              name="confirmed"
                              id="confirmed"
                            />
                            <label htmlFor="confirmed">Confirmed</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ flex: 1 }} className={styles.closeButton}>
                      <svg
                        style={{ height: "1rem", width: "1rem" }}
                        onClick={$event => setPrimaryDiagnosis(null)}
                      >
                        <use xlinkHref="#omrs-icon-close"></use>
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginBottom: "1.625rem" }}>Not chosen</div>
                )}
              </div>
              <div>
                <span>Secondary Diagnos:</span>
                <hr />
                {!isEmpty(secondaryDiagnosis) ? (
                  <div className={styles.primaryDiagnosisContainer}>
                    <div
                      className={styles.primaryDiagnosis}
                      style={{ flex: 10 }}
                    >
                      {secondaryDiagnosis && (
                        <div className={styles.diagnosisHeader}>
                          <label>
                            {secondaryDiagnosis.concept.preferredName}
                          </label>
                          <label>
                            {secondaryDiagnosis.conceptReferenceTerm}
                          </label>
                        </div>
                      )}
                      <div>
                        <div className={styles.diagnosisCheckBoxContainer}>
                          <div>
                            <input
                              type="checkbox"
                              name="primary"
                              id="primary"
                            />
                            <label htmlFor="primary">Primary</label>
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              name="confirmed"
                              id="confirmed"
                            />
                            <label htmlFor="confirmed">Confirmed</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ flex: 1 }} className={styles.closeButton}>
                      <svg
                        style={{ height: "1rem", width: "1rem" }}
                        onClick={$event => setSecondaryDiagnosis(null)}
                      >
                        <use xlinkHref="#omrs-icon-close"></use>
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginBottom: "1.625rem" }}>None</div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.visitNoteButtonContainer}>
            <button className="omrs-btn omrs-outlined-neutral">Cancel</button>
            <button className="omrs-btn omrs-filled-action">Save</button>
          </div>
        </form>
      )}
    </SummaryCard>
  );
}

type VisitNotesProp = {};
