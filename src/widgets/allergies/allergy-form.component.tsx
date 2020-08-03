import React, { useEffect, useState, useRef, SyntheticEvent } from "react";
import dayjs from "dayjs";
import { capitalize } from "lodash-es";
import { useHistory, match } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import { DataCaptureComponentProps } from "../shared-utils";
import { AllergyData, AllergicReaction, Allergen } from "../types";

export default function AllergyForm(props: AllergyFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const createFormOnsetDateRef = useRef<HTMLInputElement>(null);
  const editFormOnsetDateRef = useRef<HTMLInputElement>(null);
  const [isEditFormActive, setIsEditFormActive] = useState(false);
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
  const [updatedOnsetDate, setUpdatedOnsetDate] = useState<string>(null);
  const [isLoadingPatient, , patientUuid] = useCurrentPatient();
  const [formChanged, setFormChanged] = useState(false);
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    if (props.match.params["allergyUuid"]) {
      setIsEditFormActive(true);
    }
  }, [props.match.params]);

  useEffect(() => {
    const abortController = new AbortController();
    if (patientUuid && !isLoadingPatient && isEditFormActive) {
      getPatientAllergyByPatientUuid(
        patientUuid,
        props.match.params,
        abortController
      )
        .then(response => setPatientAllergy(response.data))
        .catch(createErrorHandler());

      return () => abortController.abort();
    }
  }, [patientUuid, isLoadingPatient, isEditFormActive, props.match.params]);

  useEffect(() => {
    if (isEditFormActive && patientAllergy) {
      setAllergyComment(patientAllergy.comment);
      setReactionSeverityUuid(patientAllergy.severity.uuid);
      setUpdatedOnsetDate(patientAllergy.auditInfo.dateCreated);
      setSelectedAllergicReactions(
        patientAllergy.reactions?.map(reaction => {
          return {
            display: reaction.reaction.display,
            uuid: reaction.reaction.uuid
          };
        })
      );
    }
  }, [isEditFormActive, patientAllergy]);

  useEffect(() => {
    if (isEditFormActive) {
      const getAllergicReactionsSub = getAllergicReactions().subscribe(
        (allergicReactions: Array<AllergicReaction>) =>
          setAllergicReactions(allergicReactions),
        createErrorHandler()
      );
      return () => {
        getAllergicReactionsSub.unsubscribe();
      };
    }
  }, [isEditFormActive]);

  useEffect(() => {
    // allergenType is a required field in the Create form
    if (!isEditFormActive && allergenType) {
      setEnableCreateButtons(true);
    } else {
      setEnableCreateButtons(false);
    }
  }, [isEditFormActive, allergenType]);

  useEffect(() => {
    if (firstOnsetDate && createFormOnsetDateRef.current?.validity?.valid) {
      setEnableCreateButtons(true);
    } else {
      setEnableCreateButtons(false);
    }
  }, [firstOnsetDate]);

  useEffect(() => {
    if (isEditFormActive && formChanged) {
      setEnableEditButtons(true);
    } else {
      setEnableEditButtons(false);
    }
  }, [isEditFormActive, updatedOnsetDate, formChanged]);

  useEffect(() => {
    if (editFormOnsetDateRef.current?.validity?.valid) {
      setEnableEditButtons(true);
    } else {
      setEnableEditButtons(false);
    }
  }, [updatedOnsetDate]);

  useEffect(() => {
    if (selectedAllergyCategory && !isEditFormActive) {
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
  }, [selectedAllergyCategory, isEditFormActive]);

  const handleAllergicReactionChange = (
    event: SyntheticEvent<HTMLInputElement, Event>
  ) => {
    const eventTarget = event.currentTarget;
    setSelectedAllergicReactions((reactions: SelectedAllergicReaction[]) => {
      if (eventTarget.checked === true) {
        reactions.push({ uuid: eventTarget.value });
        return reactions;
      } else {
        return reactions.filter(
          reaction => reaction.uuid !== eventTarget.value
        );
      }
    });
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

  const allergyHasReaction = uuid => {
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
      case AllergyConcept.DRUG_ALLERGEN:
        return "DRUG";
      case AllergyConcept.FOOD_ALLERGEN:
        return "FOOD";
      case AllergyConcept.ENVIRONMENTAL_ALLERGEN:
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

  function createAllergy() {
    return (
      <SummaryCard
        name={t("Record a new allergy", "Record a new allergy")}
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
            {t("Category of reaction", "Category of reaction")}
          </h4>
          <div className={`${styles.container}`}>
            <div className="omrs-radio-button">
              <label>
                <input
                  id={AllergyConcept.DRUG_ALLERGEN}
                  type="radio"
                  name="allergenType"
                  value={AllergyConcept.DRUG_ALLERGEN}
                  onChange={handleAllergenChange}
                  required
                />
                <span>{t("Drug", "Drug")}</span>
              </label>
            </div>
            <div className="omrs-radio-button">
              <label>
                <input
                  id={AllergyConcept.FOOD_ALLERGEN}
                  type="radio"
                  name="allergenType"
                  value={AllergyConcept.FOOD_ALLERGEN}
                  onChange={handleAllergenChange}
                />
                <span>{t("Food", "Food")}</span>
              </label>
            </div>
            <div className="omrs-radio-button">
              <label>
                <input
                  id={AllergyConcept.ENVIRONMENTAL_ALLERGEN}
                  type="radio"
                  name="allergenType"
                  value={AllergyConcept.ENVIRONMENTAL_ALLERGEN}
                  onChange={handleAllergenChange}
                />
                <span>{t("Environmental", "Environmental")}</span>
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
                <span>
                  {t(
                    "Patient has no known allergies",
                    "Patient has no known allergies"
                  )}
                </span>
              </label>
            </div>
          </div>
          {allergensArray && (
            <div>
              <h4 className={`${styles.allergyHeader} omrs-bold`}>
                {capitalize(
                  getAllergyType(selectedAllergyCategory)?.toLowerCase()
                )}{" "}
                {t("allergen", "allergen")}
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
              <h4 className={`${styles.allergyHeader} omrs-bold`}>
                {t("Reactions", "Reactions")}
              </h4>
              <h4 className={`${styles.allergyHeader} omrs-type-body-regular`}>
                {t("Select all that apply", "Select all that apply")}
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
                {t("Severity of worst reaction", "Severity of worst reaction")}
              </h4>
              <div className={styles.container}>
                <div className="omrs-radio-button">
                  <label>
                    <input
                      type="radio"
                      name="reactionSeverity"
                      value={AllergyConcept.MILD_REACTION_SEVERITY}
                      onChange={evt =>
                        setReactionSeverityUuid(evt.target.value)
                      }
                    />
                    <span>{t("Mild", "Mild")}</span>
                  </label>
                </div>
                <div className="omrs-radio-button">
                  <label>
                    <input
                      type="radio"
                      name="reactionSeverity"
                      value={AllergyConcept.MODERATE_REACTION_SEVERITY}
                      onChange={evt =>
                        setReactionSeverityUuid(evt.target.value)
                      }
                    />
                    <span>{t("Moderate", "Moderate")}</span>
                  </label>
                </div>
                <div className="omrs-radio-button">
                  <label>
                    <input
                      type="radio"
                      name="reactionSeverity"
                      value={AllergyConcept.SEVERE_REACTION_SEVERITY}
                      onChange={evt =>
                        setReactionSeverityUuid(evt.target.value)
                      }
                    />
                    <span>{t("Severe", "Severe")}</span>
                  </label>
                </div>
              </div>
              <h4 className={`${styles.allergyHeader} omrs-bold`}>
                <label htmlFor="first-onset-date">
                  {t("Date of first onset", "Date of first onset")}
                </label>
              </h4>
              <div className={styles.dateContainer}>
                <div className="omrs-datepicker">
                  <input
                    ref={createFormOnsetDateRef}
                    id="first-onset-date"
                    type="date"
                    name="firstOnsetDate"
                    max={dayjs(new Date().toUTCString()).format("YYYY-MM-DD")}
                    onChange={evt => setFirstOnsetDate(evt.target.value)}
                  />
                  <svg className="omrs-icon" role="img">
                    <use xlinkHref="#omrs-icon-calendar"></use>
                  </svg>
                </div>
                {createFormOnsetDateRef?.current &&
                  !createFormOnsetDateRef.current?.validity?.valid && (
                    <div className={styles.dateError}>
                      <span>
                        <svg className="omrs-icon" role="img">
                          <use xlinkHref="#omrs-icon-important-notification"></use>
                        </svg>
                        Please enter a date that is either on or before today.
                      </span>
                      <br />
                    </div>
                  )}
              </div>
              <h4 className={`${styles.allergyHeader} omrs-bold`}>
                {t("Comments", "Comments")}
              </h4>
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
              {t("Cancel", "Cancel")}
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
              {t("Sign & Save", "Sign & Save")}
            </button>
          </div>
        </form>
      </SummaryCard>
    );
  }

  function editAllergy() {
    return (
      <SummaryCard
        name={t("Edit existing allergy", "Edit existing allergy")}
        styles={{
          width: "100%",
          background: "var(--omrs-color-bg-medium-contrast)"
        }}
      >
        {patientAllergy && allergicReactions?.length && (
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
                <h4>{t("Allergen", "Allergen")}</h4>
                <h3>
                  {patientAllergy?.allergen?.codedAllergen?.display}{" "}
                  <span>
                    ({patientAllergy?.allergen?.allergenType?.toLowerCase()})
                  </span>
                </h3>
              </div>
              <div>
                <h4 className={`${styles.allergyHeader} omrs-bold`}>
                  {t("Reactions", "Reactions")}
                </h4>
                <h4
                  className={`${styles.allergyHeader} omrs-type-body-regular`}
                >
                  {t("Select all that apply", "Select all that apply")}
                </h4>
                <div className={styles.container}>
                  {allergicReactions.map((reaction, index) => (
                    <div className="omrs-checkbox" key={index}>
                      <label>
                        <input
                          type="checkbox"
                          name="reactionUuid"
                          defaultValue={reaction?.uuid}
                          defaultChecked={allergyHasReaction(reaction?.uuid)}
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
                  {t(
                    "Severity of worst reaction",
                    "Severity of worst reaction"
                  )}
                </h4>
                <div className={styles.container}>
                  <div className="omrs-radio-button">
                    <label>
                      <input
                        type="radio"
                        name="reactionSeverity"
                        defaultValue={AllergyConcept.MILD_REACTION_SEVERITY}
                        defaultChecked={
                          patientAllergy?.severity?.uuid ===
                          AllergyConcept.MILD_REACTION_SEVERITY
                        }
                        onChange={evt =>
                          setReactionSeverityUuid(evt.target.value)
                        }
                      />
                      <span>{t("Mild", "Mild")}</span>
                    </label>
                  </div>
                  <div className="omrs-radio-button">
                    <label>
                      <input
                        type="radio"
                        name="reactionSeverity"
                        defaultValue={AllergyConcept.MODERATE_REACTION_SEVERITY}
                        defaultChecked={
                          patientAllergy?.severity?.uuid ===
                          AllergyConcept.MODERATE_REACTION_SEVERITY
                        }
                        onChange={evt =>
                          setReactionSeverityUuid(evt.target.value)
                        }
                      />
                      <span>{t("Moderate", "Moderate")}</span>
                    </label>
                  </div>
                  <div className="omrs-radio-button">
                    <label>
                      <input
                        type="radio"
                        name="reactionSeverity"
                        defaultValue={AllergyConcept.SEVERE_REACTION_SEVERITY}
                        defaultChecked={
                          patientAllergy?.severity?.uuid ===
                          AllergyConcept.SEVERE_REACTION_SEVERITY
                        }
                        onChange={evt =>
                          setReactionSeverityUuid(evt.target.value)
                        }
                      />
                      <span>{t("Severe", "Severe")}</span>
                    </label>
                  </div>
                </div>
                <h4 className={`${styles.allergyHeader} omrs-bold`}>
                  <label htmlFor="first-onset-date">
                    {t("Date of first onset", "Date of first onset")}
                  </label>
                </h4>
                <div className={styles.dateContainer}>
                  <div className="omrs-datepicker">
                    <input
                      ref={editFormOnsetDateRef}
                      id="first-onset-date"
                      type="date"
                      name="firstOnsetDate"
                      defaultValue={dayjs(
                        patientAllergy?.auditInfo?.dateCreated
                      ).format("YYYY-MM-DD")}
                      max={dayjs(new Date().toUTCString()).format("YYYY-MM-DD")}
                      onChange={evt => setUpdatedOnsetDate(evt.target.value)}
                    />
                    <svg className="omrs-icon" role="img">
                      <use xlinkHref="#omrs-icon-calendar"></use>
                    </svg>
                  </div>
                  {editFormOnsetDateRef?.current &&
                    !editFormOnsetDateRef.current?.validity?.valid && (
                      <div className={styles.dateError}>
                        <span>
                          <svg className="omrs-icon" role="img">
                            <use xlinkHref="#omrs-icon-important-notification"></use>
                          </svg>
                          Please enter a date that is either on or before today.
                        </span>
                        <br />
                      </div>
                    )}
                </div>
                <h4 className={`${styles.allergyHeader} omrs-bold`}>
                  {t("Comments", "Comments")}
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
                {t("Delete", "Delete")}
              </button>
              <button
                type="button"
                className="omrs-btn omrs-outlined-neutral omrs-rounded"
                style={{ width: "30%" }}
                onClick={closeForm}
              >
                {t("Cancel", "Cancel")}
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
                {t("Sign & Save", "Sign & Save")}
              </button>
            </div>
          </form>
        )}
      </SummaryCard>
    );
  }

  return (
    <div className={styles.allergyForm}>
      {isEditFormActive ? editAllergy() : createAllergy()}
    </div>
  );
}

AllergyForm.defaultProps = {
  entryStarted: () => {},
  entryCancelled: () => {},
  entrySubmitted: () => {},
  closeComponent: () => {}
};

enum AllergyConcept {
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
