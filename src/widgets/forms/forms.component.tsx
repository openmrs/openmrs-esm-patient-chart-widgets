import React from "react";
import dayjs from "dayjs";
import first from "lodash-es/first";
import ContentSwitcher from "carbon-components-react/es/components/ContentSwitcher";
import Switch from "carbon-components-react/es/components/Switch";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import FormView from "./form-view.component";
import ErrorState from "../../ui-components/error-state/error-state.component";
import styles from "./forms.component.scss";
import { useTranslation } from "react-i18next";
import { createErrorHandler, useCurrentPatient } from "@openmrs/esm-framework";
import { fetchAllForms, fetchPatientEncounters } from "./forms.resource";
import { filterAvailableAndCompletedForms } from "./forms-utils";
import { Encounter, Form } from "../types";

enum formView {
  recommended = 0,
  completed,
  all
}

const Forms: React.FC<any> = () => {
  const { t } = useTranslation();
  const displayText = t("forms", "Forms");
  const headerTitle = t("forms", "Forms");
  const [error, setError] = React.useState(null);
  const [allForms, setAllForms] = React.useState<Array<Form>>([]);
  const [encounters, setEncounters] = React.useState<Array<Encounter>>([]);
  const [completedForms, setCompletedForms] = React.useState<Array<Form>>([]);
  const [selectedFormView, setSelectedFormView] = React.useState<formView>(
    formView.all
  );
  const [checkedForms, setCheckedForms] = React.useState<Array<Form>>([]);
  const [, , patientUuid] = useCurrentPatient();

  React.useEffect(() => {
    fetchAllForms().subscribe(
      forms => setAllForms(forms),
      error => {
        createErrorHandler();
        setError(error);
      }
    );
  }, []);

  React.useEffect(() => {
    const fromDate = dayjs(new Date()).startOf("day");
    const toDate = dayjs(new Date()).endOf("day");
    fetchPatientEncounters(
      patientUuid,
      fromDate.toDate(),
      toDate.toDate()
    ).subscribe(
      encounters => setEncounters(encounters),
      error => {
        createErrorHandler(), setError(error);
      }
    );
  }, [patientUuid]);

  React.useEffect(() => {
    const availableForms = filterAvailableAndCompletedForms(
      allForms,
      encounters
    );
    const completedForms = availableForms.completed.map(
      encounters => encounters.form
    );
    setCompletedForms(completedForms);
  }, [allForms, encounters]);

  React.useEffect(() => {
    const checkedForms = allForms.map(form => {
      let checkedForm: Form;
      completedForms.map(completeForm => {
        if (completeForm.uuid === form.uuid) {
          completeForm.checked = true;
          checkedForm = completeForm;
        }
      });
      return checkedForm ? checkedForm : form;
    });
    setCheckedForms(checkedForms);
  }, [allForms, completedForms]);

  const RenderForm = () => {
    return (
      <div className={styles.formsWidgetContainer}>
        <div className={styles.formsHeaderContainer}>
          <h4 className={`${styles.productiveHeading03} ${styles.text02}`}>
            {headerTitle}
          </h4>
          <div className={styles.contextSwitcherContainer}>
            <ContentSwitcher
              className={styles.contextSwitcherWidth}
              onChange={event => setSelectedFormView(event.name as any)}
              selectedIndex={selectedFormView}
            >
              <Switch name={formView.recommended} text="Recommended" />
              <Switch name={formView.completed} text="Completed" />
              <Switch name={formView.all} text="All" />
            </ContentSwitcher>
          </div>
        </div>
        <div style={{ width: "100%" }}>
          {selectedFormView === formView.completed && (
            <FormView
              forms={completedForms}
              patientUuid={patientUuid}
              encounterUuid={first<Encounter>(encounters)?.uuid}
            />
          )}
          {selectedFormView === formView.all && (
            <FormView
              forms={checkedForms}
              patientUuid={patientUuid}
              encounterUuid={first<Encounter>(encounters)?.uuid}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {allForms ? (
        <RenderForm />
      ) : error ? (
        <ErrorState error={error} headerTitle={headerTitle} />
      ) : (
        <EmptyState displayText={displayText} headerTitle={headerTitle} />
      )}
    </>
  );
};

export default Forms;
