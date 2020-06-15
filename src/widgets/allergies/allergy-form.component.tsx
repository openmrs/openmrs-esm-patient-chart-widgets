import React, { useEffect, useState, useRef, SyntheticEvent } from "react";
import { useHistory, match } from "react-router-dom";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import styles from "./allergy-form.css";
import {
  getAllergyAllergenByConceptUuid,
  getAllergicReactions,
  savePatientAllergy,
  deletePatientAllergy,
  getPatientAllergyByPatientUuid,
  updatePatientAllergy
} from "./allergy-intolerance.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-api";
import dayjs from "dayjs";
import { capitalize } from "lodash-es";
import { DataCaptureComponentProps } from "../shared-utils";
import { AllergyData, AllergicReaction, Allergen } from "../types";

export default function AllergyForm(props: AllergyFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [viewEditForm, setViewEditForm] = useState(false);
  const [patientAllergy, setPatientAllergy] = useState<AllergyData>(null);
  const [allergicReactions, setAllergicReactions] = useState<
    Array<AllergicReaction>
  >([]);
  const [selectedAllergicReactions, setSelectedAllergicReactions] = useState<
    SelectedAllergicReaction[]
  >([]);
  const [codedAllergenUuid, setCodedAllergenUuid] = useState<string>(null);
  const [allergenType, setAllergenType] = useState("");
  const [allergensArray, setAllergensArray] = useState<Array<Allergen>>(null);
  const [firstOnsetDate, setFirstOnsetDate] = useState<string>(null);
  const [enableCreateButtons, setEnableCreateButtons] = useState(true);
  const [enableEditButtons, setEnableEditButtons] = useState(true);
  const [comment, setComment] = useState("");
  const [selectedAllergyCategory, setSelectedAllergyCategory] = useState<
    string
  >(null);
  const [reactionSeverityUuid, setReactionSeverityUuid] = useState<string>(
    null
  );
  const [allergyComment, setAllergyComment] = useState<string>(null);
  const [updatedDate, setUpdatedDate] = useState<string>(null);
  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();
  const [formChanged, setFormChanged] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (props.match.params["allergyUuid"]) {
      setViewEditForm(true);
    }
  }, [props.match.params]);

  useEffect(() => {
    const abortController = new AbortController();
    if (patientUuid && !isLoadingPatient && viewEditForm) {
      getPatientAllergyByPatientUuid(
        patientUuid,
        props.match.params,
        abortController
      )
        .then(response => setPatientAllergy(response.data))
        .catch(createErrorHandler());

      return () => abortController.abort();
    }
  }, [patientUuid, isLoadingPatient, viewEditForm, props.match.params]);

  useEffect(() => {
    if (viewEditForm && patientAllergy) {
      setAllergyComment(patientAllergy.comment);
      setReactionSeverityUuid(patientAllergy.severity.uuid);
      setUpdatedDate(patientAllergy.auditInfo.dateCreated);
      setSelectedAllergicReactions(
        patientAllergy.reactions?.map(reaction => {
          return {
            display: reaction.reaction.display,
            uuid: reaction.reaction.uuid
          };
        })
      );
    }
  }, [viewEditForm, patientAllergy]);

  useEffect(() => {
    if (viewEditForm) {
      const getAllergicReactionsSub = getAllergicReactions().subscribe(
        (allergicReactions: Array<AllergicReaction>) =>
          setAllergicReactions(allergicReactions),
        createErrorHandler()
      );
      return () => {
        getAllergicReactionsSub.unsubscribe();
      };
    }
  }, [viewEditForm]);

  useEffect(() => {
    // allergenType is a required field in the Create form
    if (!viewEditForm && allergenType) {
      setEnableCreateButtons(true);
    } else {
      setEnableCreateButtons(false);
    }
  }, [allergenType, firstOnsetDate, viewEditForm]);

  useEffect(() => {
    if (viewEditForm && formChanged) {
      setEnableEditButtons(true);
    } else {
      setEnableEditButtons(false);
    }
  }, [formChanged, viewEditForm]);

  useEffect(() => {
    if (selectedAllergyCategory && !viewEditForm) {
      const getAllergensSub = getAllergyAllergenByConceptUuid(
        selectedAllergyCategory
      ).subscribe(data => setAllergensArray(data), createErrorHandler());
      const getAllergicReactionsSub = getAllergicReactions().subscribe(
        data => setAllergicReactions(data),
        createErrorHandler()
      );
      return () => {
        getAllergensSub.unsubscribe();
        getAllergicReactionsSub.unsubscribe();
      };
    }
  }, [selectedAllergyCategory, viewEditForm]);

  const handleAllergicReactionChange = (
    event: SyntheticEvent<HTMLInputElement, Event>
  ) => {
    if (event.currentTarget.checked === true) {
      // upon selecting a reaction
      selectedAllergicReactions.push({ uuid: event.currentTarget.value });
      setSelectedAllergicReactions(selectedAllergicReactions);
    } else {
      // upon deselecting a reaction
      const modifiedAllergicReactions = selectedAllergicReactions.filter(
        rxn => rxn.uuid !== event.currentTarget.value
      );
      setSelectedAllergicReactions(modifiedAllergicReactions);
    }
  };

  const handleCreateFormSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const patientAllergy: PatientAllergy = {
      allergenType: allergenType,
      codedAllergenUuid: codedAllergenUuid,
      severityUuid: reactionSeverityUuid,
      comment: comment,
      reactionUuids: selectedAllergicReactions
    };
    const abortController = new AbortController();
    savePatientAllergy(patientAllergy, patientUuid, abortController)
      .then(response => {
        response.status === 201 && navigate();
      })
      .catch(createErrorHandler());
    return () => abortController.abort();
  };

  const handleEditFormSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const allergy: PatientAllergy = {
      allergenType: patientAllergy?.allergen?.allergenType,
      codedAllergenUuid: patientAllergy?.allergen?.codedAllergen?.uuid,
      severityUuid: reactionSeverityUuid,
      comment: allergyComment,
      reactionUuids: selectedAllergicReactions
    };
    const abortController = new AbortController();
    updatePatientAllergy(
      allergy,
      patientUuid,
      props.match.params,
      abortController
    ).then(response => {
      response.status === 200 && navigate();
    }, createErrorHandler);
    return () => abortController.abort();
  };

  function navigate() {
    history.push(`/patient/${patientUuid}/chart/allergies`);
    props.closeComponent();
  }

  const setCheckedValue = uuid => {
    return patientAllergy?.reactions?.some(
      reaction => reaction?.reaction?.uuid === uuid
    );
  };

  const handleDeletePatientAllergy = () => {
    const abortController = new AbortController();
    deletePatientAllergy(patientUuid, props.match.params, abortController).then(
      response => {
        response.status === 204 && navigate();
      }
    );
  };

  const getAllergyType = (allergyConcept: string): string => {
    switch (allergyConcept) {
      case AllergyConcepts.DRUG_ALLERGEN:
        return "DRUG";
      case AllergyConcepts.FOOD_ALLERGEN:
        return "FOOD";
      case AllergyConcepts.ENVIRONMENTAL_ALLERGEN:
        return "ENVIRONMENT";
      default:
        "NO ALLERGEN";
    }
  };

  const handleAllergenChange = (
    event: SyntheticEvent<HTMLInputElement, Event>
  ) => {
    setAllergensArray(null);
    setAllergenType(getAllergyType(event.currentTarget.value));
    setSelectedAllergyCategory(event.currentTarget.value);
  };

  const closeForm = (event: SyntheticEvent<HTMLButtonElement, MouseEvent>) => {
    formRef.current.reset();
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

  function createForm() {
    return (
      <SummaryCard
        name="Add New Allergy"
        styles={{
          width: "100%",
          background: "var(--omrs-color-bg-medium-contrast)"
        }}
      >
        <form
          ref={formRef}
          onSubmit={handleCreateFormSubmit}
          onChange={() => {
            setFormChanged(true);
            return props.entryStarted();
          }}
        >
          <h4 className={`${styles.allergyHeader} omrs-bold`}>
            Category of reaction
          </h4>
          <div className={`${styles.container}`}>
            <div className="omrs-radio-button">
              <label>
                <input
                  id={AllergyConcepts.DRUG_ALLERGEN}
                  type="radio"
                  name="allergenType"
                  value={AllergyConcepts.DRUG_ALLERGEN}
                  onChange={handleAllergenChange}
                />
                <span>Drug</span>
              </label>
            </div>
            <div className="omrs-radio-button">
              <label>
                <input
                  id={AllergyConcepts.FOOD_ALLERGEN}
                  type="radio"
                  name="allergenType"
                  value={AllergyConcepts.FOOD_ALLERGEN}
                  onChange={handleAllergenChange}
                />
                <span>Food</span>
              </label>
            </div>
            <div className="omrs-radio-button">
              <label>
                <input
                  id={AllergyConcepts.ENVIRONMENTAL_ALLERGEN}
                  type="radio"
                  name="allergenType"
                  value={AllergyConcepts.ENVIRONMENTAL_ALLERGEN}
                  onChange={handleAllergenChange}
                />
                <span>Environmental</span>
              </label>
            </div>
            <div className="omrs-radio-button">
              <label>
                <input
                  id="no-allergies"
                  type="radio"
                  name="allergenType"
                  value="noAllergy"
                  onChange={handleAllergenChange}
                />
                <span>Patient has no allergies</span>
              </label>
            </div>
          </div>
          {allergensArray && (
            <div>
              <h4 className={`${styles.allergyHeader} omrs-bold`}>
                {capitalize(
                  getAllergyType(selectedAllergyCategory)?.toLowerCase()
                )}{" "}
                allergen
              </h4>
              <div className={styles.container}>
                {allergensArray.map((allergen, index) => (
                  <div className="omrs-radio-button" key={index}>
                    <label>
                      <input
                        id={allergen?.uuid}
                        type="radio"
                        name="allergen-name"
                        checked={codedAllergenUuid === allergen?.uuid}
                        value={allergen?.uuid}
                        onChange={evt => setCodedAllergenUuid(evt.target.value)}
                        required
                      />
                      <span>{allergen?.name?.display}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          {allergensArray && allergicReactions && (
            <div>
              <h4 className={`${styles.allergyHeader} omrs-bold`}>Reactions</h4>
              <h4 className={`${styles.allergyHeader} omrs-type-body-regular`}>
                Select all that apply
              </h4>
              <div className={styles.container}>
                {allergicReactions.map((reaction, index) => (
                  <div className="omrs-checkbox" key={index}>
                    <label>
                      <input
                        id="allergen-reaction"
                        type="checkbox"
                        name="reactionUuid"
                        value={reaction?.uuid}
                        onChange={handleAllergicReactionChange}
                      />
                      <span>{reaction?.name?.display}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          {allergensArray && (
            <div>
              <h4 className={`${styles.allergyHeader} omrs-bold`}>
                Severity of worst reaction
              </h4>
              <div className={styles.container}>
                <div className="omrs-radio-button">
                  <label>
                    <input
                      type="radio"
                      name="reactionSeverity"
                      value={AllergyConcepts.MILD_REACTION_SEVERITY}
                      onChange={evt =>
                        setReactionSeverityUuid(evt.target.value)
                      }
                    />
                    <span>Mild</span>
                  </label>
                </div>
                <div className="omrs-radio-button">
                  <label>
                    <input
                      type="radio"
                      name="reactionSeverity"
                      value={AllergyConcepts.MODERATE_REACTION_SEVERITY}
                      onChange={evt =>
                        setReactionSeverityUuid(evt.target.value)
                      }
                    />
                    <span>Moderate</span>
                  </label>
                </div>
                <div className="omrs-radio-button">
                  <label>
                    <input
                      type="radio"
                      name="reactionSeverity"
                      value={AllergyConcepts.SEVERE_REACTION_SEVERITY}
                      onChange={evt =>
                        setReactionSeverityUuid(evt.target.value)
                      }
                    />
                    <span>Severe</span>
                  </label>
                </div>
              </div>
              <h4 className={`${styles.allergyHeader} omrs-bold`}>
                Date of first onset
              </h4>
              <div className={styles.container}>
                <div className="omrs-datepicker">
                  <input
                    id="first-onset-date"
                    type="date"
                    name="firstOnsetDate"
                    onChange={evt => setFirstOnsetDate(evt.target.value)}
                  />
                  <svg className="omrs-icon" role="img">
                    <use xlinkHref="#omrs-icon-calendar"></use>
                  </svg>
                </div>
              </div>
              <h4 className={`${styles.allergyHeader} omrs-bold`}>Comments</h4>
              <div className={styles.allergyCommentContainer}>
                <textarea
                  className={`${styles.allergyCommentTextArea} omrs-type-body-regular`}
                  name="comment"
                  rows={6}
                  onChange={evt => setComment(evt.target.value)}
                ></textarea>
              </div>
            </div>
          )}
          <div
            className={
              enableCreateButtons
                ? styles.buttonStyles
                : `${styles.buttonStyles} ${styles.buttonStylesBorder}`
            }
            style={{ position: "sticky" }}
          >
            <button
              type="button"
              className="omrs-btn omrs-outlined-neutral omrs-rounded"
              onClick={closeForm}
              style={{ width: "50%" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ width: "50%" }}
              className={
                enableCreateButtons
                  ? "omrs-btn omrs-filled-action omrs-rounded"
                  : "omrs-btn omrs-outlined omrs-rounded"
              }
              disabled={!enableCreateButtons}
            >
              Sign & Save
            </button>
          </div>
        </form>
      </SummaryCard>
    );
  }

  function editForm() {
    return (
      <SummaryCard
        name="Edit Allergy"
        styles={{
          width: "100%",
          background: "var(--omrs-color-bg-medium-contrast)"
        }}
      >
        {!!(patientAllergy && allergicReactions?.length) && (
          <form
            ref={formRef}
            onSubmit={handleEditFormSubmit}
            onChange={() => {
              setFormChanged(true);
              return props.entryStarted();
            }}
          >
            <div>
              <div
                className={`${styles.allergyEditHeader} omrs-padding-bottom-28`}
              >
                <h4>Allergen</h4>
                <h3>
                  {patientAllergy?.allergen?.codedAllergen?.display}{" "}
                  <span>
                    ({patientAllergy?.allergen?.allergenType?.toLowerCase()})
                  </span>
                </h3>
              </div>
              <div>
                <h4 className={`${styles.allergyHeader} omrs-bold`}>
                  Reactions
                </h4>
                <h4
                  className={`${styles.allergyHeader} omrs-type-body-regular`}
                >
                  Select all that apply
                </h4>
                <div className={styles.container}>
                  {allergicReactions.map((reaction, index) => (
                    <div className="omrs-checkbox" key={index}>
                      <label>
                        <input
                          type="checkbox"
                          name="reactionUuid"
                          defaultValue={reaction?.uuid}
                          defaultChecked={setCheckedValue(reaction?.uuid)}
                          onChange={handleAllergicReactionChange}
                        />
                        <span>{reaction?.display}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className={`${styles.allergyHeader} omrs-bold`}>
                  Severity of worst reaction
                </h4>
                <div className={styles.container}>
                  <div className="omrs-radio-button">
                    <label>
                      <input
                        type="radio"
                        name="reactionSeverity"
                        defaultValue={AllergyConcepts.MILD_REACTION_SEVERITY}
                        defaultChecked={
                          patientAllergy?.severity?.uuid ===
                          AllergyConcepts.MILD_REACTION_SEVERITY
                        }
                        onChange={evt =>
                          setReactionSeverityUuid(evt.target.value)
                        }
                      />
                      <span>Mild</span>
                    </label>
                  </div>
                  <div className="omrs-radio-button">
                    <label>
                      <input
                        type="radio"
                        name="reactionSeverity"
                        defaultValue={
                          AllergyConcepts.MODERATE_REACTION_SEVERITY
                        }
                        defaultChecked={
                          patientAllergy?.severity?.uuid ===
                          AllergyConcepts.MODERATE_REACTION_SEVERITY
                        }
                        onChange={evt =>
                          setReactionSeverityUuid(evt.target.value)
                        }
                      />
                      <span>Moderate</span>
                    </label>
                  </div>
                  <div className="omrs-radio-button">
                    <label>
                      <input
                        type="radio"
                        name="reactionSeverity"
                        defaultValue={AllergyConcepts.SEVERE_REACTION_SEVERITY}
                        defaultChecked={
                          patientAllergy?.severity?.uuid ===
                          AllergyConcepts.SEVERE_REACTION_SEVERITY
                        }
                        onChange={evt =>
                          setReactionSeverityUuid(evt.target.value)
                        }
                      />
                      <span>Severe</span>
                    </label>
                  </div>
                </div>
                <h4 className={`${styles.allergyHeader} omrs-bold`}>
                  Date of first onset
                </h4>
                <div className={styles.container}>
                  <div className="omrs-datepicker">
                    <input
                      type="date"
                      name="firstDateOfOnset"
                      defaultValue={dayjs(
                        patientAllergy?.auditInfo?.dateCreated
                      ).format("YYYY-MM-DD")}
                      required
                      onChange={evt => setUpdatedDate(evt.target.value)}
                    />
                    <svg className="omrs-icon" role="img">
                      <use xlinkHref="#omrs-icon-calendar"></use>
                    </svg>
                  </div>
                </div>

                <h4 className={`${styles.allergyHeader} omrs-bold`}>
                  Comments
                </h4>
                <div className={styles.allergyCommentContainer}>
                  <textarea
                    className={`${styles.allergyCommentTextArea} omrs-type-body-regular`}
                    required
                    name="comment"
                    rows={6}
                    defaultValue={patientAllergy?.comment}
                    onChange={evt => setAllergyComment(evt.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
            <div
              className={
                enableEditButtons
                  ? styles.buttonStyles
                  : `${styles.buttonStyles} ${styles.buttonStylesBorder}`
              }
            >
              <button
                type="button"
                className="omrs-btn omrs-outlined-neutral omrs-rounded"
                style={{ width: "20%" }}
                onClick={handleDeletePatientAllergy}
              >
                Delete
              </button>
              <button
                type="button"
                className="omrs-btn omrs-outlined-neutral omrs-rounded"
                style={{ width: "30%" }}
                onClick={closeForm}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={
                  enableEditButtons
                    ? "omrs-btn omrs-filled-action omrs-rounded"
                    : "omrs-btn omrs-outlined omrs-rounded"
                }
                style={{ width: "50%" }}
                disabled={!enableEditButtons}
              >
                Sign & Save
              </button>
            </div>
          </form>
        )}
      </SummaryCard>
    );
  }

  return (
    <div className={styles.allergyForm}>
      {viewEditForm ? editForm() : createForm()}
    </div>
  );
}

AllergyForm.defaultProps = {
  entryStarted: () => {},
  entryCancelled: () => {},
  entrySubmitted: () => {},
  closeComponent: () => {}
};

enum AllergyConcepts {
  DRUG_ALLERGEN = "162552AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  ENVIRONMENTAL_ALLERGEN = "162554AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  FOOD_ALLERGEN = "162553AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  MILD_REACTION_SEVERITY = "1498AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  MODERATE_REACTION_SEVERITY = "1499AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  SEVERE_REACTION_SEVERITY = "1500AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
}

type AllergyFormProps = DataCaptureComponentProps & { match: match };

type PatientAllergy = {
  allergenType: string;
  codedAllergenUuid: string;
  severityUuid: string;
  comment: string;
  reactionUuids: SelectedAllergicReaction[];
};

type SelectedAllergicReaction = {
  display?: string;
  uuid: string;
};
