/* eslint-disable no-console */
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

import { fetchDiagnosisByName, Diagnosis } from "./visit-notes.resource";
import styles from "./visit-notes-form.scss";

const VisitNotes: React.FC = () => {
  const searchTimeout = 300;
  const [clinicalNote, setClinicalNote] = React.useState("");
  const [error, setError] = React.useState(null);
  const [diagnoses, setDiagnoses] = React.useState<Array<Diagnosis>>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<Array<Diagnosis>>(
    null
  );
  const [selectedDiagnoses, setSelectedDiagnoses] = React.useState<
    Array<Diagnosis>
  >([]);
  const [visitDate, setVisitDate] = React.useState<any>(new Date());
  const searchInputRef = React.useRef<any | null>(null);

  // if (selectedDiagnoses)
  //   console.log("selected diagnoses are: ", selectedDiagnoses);

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

  const handleSearchTermChange = debounce(searchTerm => {
    setSearchTerm(searchTerm);
  }, searchTimeout);

  interface DiagnosisSearchResultsProps {
    results: Array<Diagnosis>;
  }

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
                // onKeyDown={}
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

  const DiagnosisSearchResults: React.FC<DiagnosisSearchResultsProps> = ({
    results
  }) => {
    return <>{results ? <RenderSearchResults /> : <SearchSkeleton />}</>;
  };

  const handleSubmit = $event => {
    $event.preventDefault();
    // console.log('form payload: ', {  })
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
              allowInput={false}
              dateFormat="d/m/Y"
              datePickerType="single"
              light={true}
              maxDate={new Date()}
              onChange={([date]) => setVisitDate(date)}
            >
              <DatePickerInput
                id="visitDatePicker"
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
                  {selectedDiagnoses.map((diagnosis, i) => (
                    <Tag
                      filter
                      onClose={() => handleRemoveDiagnosis(diagnosis)}
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
                placeHolderText="Enter diagnosis"
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
              style={{ width: "50%" }}
              onClick={() => {}}
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

export default VisitNotes;
