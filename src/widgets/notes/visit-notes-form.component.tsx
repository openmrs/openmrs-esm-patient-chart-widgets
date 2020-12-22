import React from "react";

import debounce from "lodash-es/debounce";
import {
  Button,
  Column,
  DatePicker,
  DatePickerInput,
  Form,
  FormGroup,
  Grid,
  Row,
  Search,
  SearchSkeleton,
  Tag,
  TextArea,
  Tile
} from "carbon-components-react";

import { switchTo } from "@openmrs/esm-extensions";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-react-utils";
import { ConfigObject } from "../../config-schema";
import withConfig from "../../with-config";

import {
  convertToObsPayLoad,
  obs,
  Diagnosis,
  VisitNotePayload
} from "./visit-note.util";
import {
  fetchDiagnosisByName,
  fetchLocationByUuid,
  fetchProviderByUuid,
  fetchCurrentSessionData,
  saveVisitNote
} from "./visit-notes.resource";
import styles from "./visit-notes-form.scss";

const VisitNotesForm: React.FC<{
  closeWorkspace?: Function;
  config?: ConfigObject;
}> = ({ closeWorkspace, config }) => {
  const searchTimeout = 300;
  const {
    clinicianEncounterRole,
    encounterNoteConceptUuid,
    encounterTypeUuid,
    formConceptUuid
  } = config["visitNoteConfig"];
  const [, , patientUuid] = useCurrentPatient();
  const [clinicalNote, setClinicalNote] = React.useState("");
  const [error, setError] = React.useState(null);
  const [
    currentSessionProviderUuid,
    setCurrentSessionProviderUuid
  ] = React.useState<string | null>("");
  const [
    currentSessionLocationUuid,
    setCurrentSessionLocationUuid
  ] = React.useState("");
  const [locationUuid, setLocationUuid] = React.useState<string | null>(null);
  const [providerUuid, setProviderUuid] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<Array<Diagnosis>>(
    null
  );
  const [selectedDiagnoses, setSelectedDiagnoses] = React.useState<
    Array<Diagnosis>
  >([]);
  const [visitDateTime, setVisitDateTime] = React.useState(new Date());
  const searchInputRef = React.useRef(null);
  closeWorkspace = closeWorkspace ?? (() => switchTo("workspace", ""));

  React.useEffect(() => {
    if (searchTerm) {
      const sub = fetchDiagnosisByName(searchTerm).subscribe(
        results => {
          setSearchResults(results);
        },
        error => {
          setError(error);
          createErrorHandler();
        }
      );
      return () => sub.unsubscribe();
    } else {
      setSearchResults(null);
    }
  }, [searchTerm]);

  React.useEffect(() => {
    const ac = new AbortController();
    fetchCurrentSessionData(ac).then(({ data }) => {
      const { currentProvider, sessionLocation } = data;
      if (currentProvider.uuid) {
        setCurrentSessionProviderUuid(currentProvider.uuid);
      }
      if (sessionLocation.uuid) {
        setCurrentSessionLocationUuid(sessionLocation.uuid);
      }
    });
    return () => ac.abort();
  }, []);

  React.useEffect(() => {
    const ac = new AbortController();
    if (currentSessionProviderUuid) {
      fetchProviderByUuid(ac, currentSessionProviderUuid).then(({ data }) =>
        setProviderUuid(data.uuid)
      );
    }
  }, [currentSessionProviderUuid]);

  React.useEffect(() => {
    const ac = new AbortController();
    if (currentSessionLocationUuid) {
      fetchLocationByUuid(ac, currentSessionLocationUuid).then(({ data }) =>
        setLocationUuid(data.uuid)
      );
    }
  }, [currentSessionLocationUuid]);

  const handleCancel = () => {
    closeWorkspace();
  };
  const handleSearchTermChange = debounce(searchTerm => {
    setSearchTerm(searchTerm);
  }, searchTimeout);

  const resetSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleAddDiagnosis = (diagnosisToAdd: Diagnosis) => {
    resetSearch();
    setSelectedDiagnoses(selectedDiagnoses => [
      diagnosisToAdd,
      ...selectedDiagnoses
    ]);
  };

  const handleRemoveDiagnosis = (diagnosisToRemove: Diagnosis) => {
    setSelectedDiagnoses(
      selectedDiagnoses.filter(
        diagnosis => diagnosis.concept.id !== diagnosisToRemove.concept.id
      )
    );
  };

  const RenderSearchResults: React.FC = () => {
    if (searchResults.length) {
      return (
        <>
          {searchResults.map((diagnosis, index) => (
            <ul className={styles.diagnosisList}>
              <li
                role="menuitem"
                className={styles.diagnosis}
                key={index}
                onClick={() => handleAddDiagnosis(diagnosis)}
              >
                {diagnosis.concept.preferredName}
              </li>
            </ul>
          ))}
        </>
      );
    }
    return (
      <Tile light className={styles.emptyResultsText}>
        <span>No matching diagnoses have been found</span>
      </Tile>
    );
  };

  const DiagnosisSearchResults: React.FC<{ results: Array<Diagnosis> }> = ({
    results
  }) => {
    return <>{results ? <RenderSearchResults /> : <SearchSkeleton />}</>;
  };

  const handleSubmit = $event => {
    $event.preventDefault();
    let obs: Array<obs> = [];
    obs = convertToObsPayLoad(selectedDiagnoses);
    if (clinicalNote) {
      obs = [
        {
          concept: encounterNoteConceptUuid,
          value: clinicalNote
        },
        ...obs
      ];
    }

    let visitNotePayload: VisitNotePayload = {
      encounterDatetime: visitDateTime,
      patient: patientUuid,
      location: locationUuid,
      encounterProviders: [
        {
          encounterRole: clinicianEncounterRole,
          provider: providerUuid
        }
      ],
      encounterType: encounterTypeUuid,
      form: formConceptUuid,
      obs: obs
    };
    const ac = new AbortController();
    saveVisitNote(ac, visitNotePayload).then(response => {
      response.status === 201 && closeWorkspace();
      response.status !== 201 && createErrorHandler();
    });
    return () => ac.abort();
  };

  return (
    <Form className={styles.visitNoteForm}>
      <h2 className={styles.heading}>Add a Visit Note</h2>
      <Grid>
        <Row style={{ marginTop: "0.5rem", marginBottom: "2.75rem" }}>
          <Column sm={1}>
            <span className={styles.columnLabel}>Date</span>
          </Column>
          <Column sm={3}>
            <DatePicker
              dateFormat="d/m/Y"
              datePickerType="single"
              light={true}
              maxDate={new Date().toISOString()}
              value={visitDateTime}
              onChange={([date]) => setVisitDateTime(date)}
            >
              <DatePickerInput
                id="visitDateTimePicker"
                labelText="Visit Date"
                placeholder="dd/mm/yyyy"
              />
            </DatePicker>
          </Column>
        </Row>
        <Row style={{ marginTop: "0.5rem", marginBottom: "2.75rem" }}>
          <Column sm={1}>
            <span className={styles.columnLabel}>Diagnosis</span>
          </Column>
          <Column sm={3}>
            <p
              className={styles.diagnosesText}
              style={{ marginBottom: "1.188rem" }}
            >
              {selectedDiagnoses && selectedDiagnoses.length ? (
                <>
                  {selectedDiagnoses.map((diagnosis, index) => (
                    <Tag
                      filter
                      onClose={() => handleRemoveDiagnosis(diagnosis)}
                      style={{ marginRight: "0.5rem" }}
                      type={
                        index === selectedDiagnoses.length - 1 ? "red" : "blue"
                      }
                    >
                      {diagnosis.concept.preferredName}
                    </Tag>
                  ))}
                </>
              ) : (
                <span>
                  No diagnosis selected &mdash; Enter a diagnosis below
                </span>
              )}
            </p>
            <FormGroup legendText="Search for a diagnosis">
              <Search
                id="diagnosisSearch"
                light={true}
                labelText="Enter diagnoses"
                placeHolderText="Choose primary diagnosis first, then secondary diagnoses"
                onChange={e =>
                  handleSearchTermChange(e.currentTarget.value ?? "")
                }
                ref={searchInputRef}
              />
              {!!searchTerm && (
                <DiagnosisSearchResults results={searchResults} />
              )}
            </FormGroup>
          </Column>
        </Row>
        <Row style={{ marginTop: "0.5rem", marginBottom: "2.75rem" }}>
          <Column sm={1}>
            <span className={styles.columnLabel}>Note</span>
          </Column>
          <Column sm={3}>
            <TextArea
              id="additionalNote"
              light={true}
              labelText="Write an additional note"
              placeholder="Write any additional points here"
              onChange={$event => setClinicalNote($event.currentTarget.value)}
            />
          </Column>
        </Row>
        <Row style={{ marginTop: "0.5rem", marginBottom: "2.75rem" }}>
          <Column sm={1}>
            <span className={styles.columnLabel}>Image</span>
          </Column>
          <Column sm={3}>
            <FormGroup legendText="Add an image to this visit">
              <p className={styles.imgUploadHelperText}>
                Upload an image or use this device's camera to capture an image
              </p>
              <Button
                style={{ marginTop: "1rem" }}
                kind="tertiary"
                onClick={() => {}}
              >
                Add Image
              </Button>
            </FormGroup>
          </Column>
        </Row>
        <Row>
          <Column>
            <Button
              kind="secondary"
              onClick={handleCancel}
              style={{ width: "50%" }}
            >
              Cancel
            </Button>
            <Button
              kind="primary"
              onClick={handleSubmit}
              style={{ width: "50%" }}
              type="submit"
            >
              Save & Close
            </Button>
          </Column>
        </Row>
      </Grid>
    </Form>
  );
};

export default withConfig(VisitNotesForm);
