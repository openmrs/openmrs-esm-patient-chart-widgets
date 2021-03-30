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
import {
  createErrorHandler,
  navigate,
  useCurrentPatient
} from "@openmrs/esm-framework";
import { fetchAllForms, fetchPatientEncounters } from "./forms.resource";
import { filterAvailableAndCompletedForms } from "./forms-utils";
import { Encounter, Form } from "../types";
import DataTableSkeleton from "carbon-components-react/lib/components/DataTableSkeleton";

enum formView {
  recommended = 0,
  completed,
  all
}

const Forms: React.FC = () => {
  const { t } = useTranslation();
  const displayText = t("forms", "Forms");
  const headerTitle = t("forms", "Forms");
  const [error, setError] = React.useState(null);
  const [forms, setForms] = React.useState<Array<Form>>([]);
  const [encounters, setEncounters] = React.useState<Array<Encounter>>([]);
  const [completedForms, setCompletedForms] = React.useState<Array<Form>>([]);
  const [selectedFormView, setSelectedFormView] = React.useState<formView>(
    formView.all
  );
  const [filledForms, setFilledForms] = React.useState<Array<Form>>([]);
  const [, , patientUuid] = useCurrentPatient();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  function latestFirst(a: Encounter, b: Encounter) {
    return (
      new Date(b.encounterDateTime).getTime() -
      new Date(a.encounterDateTime).getTime()
    );
  }
  React.useEffect(() => {
    fetchAllForms().subscribe(
      forms => {
        setForms(forms);
        setIsLoading(false);
      },
      error => {
        setIsLoading(false);
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
        setIsLoading(false);
      }
    );
  }, [patientUuid]);

  React.useEffect(() => {
    if (forms) {
      const sub = fetchPatientEncounters(patientUuid).subscribe(
        encounters => {
          const filteredForms = forms.map(forms => {
            encounters.sort(latestFirst).some(encounter => {
              if (forms.uuid === encounter.form?.uuid) {
                forms.lastCompleted = encounter.encounterDateTime;
                return true;
              }
            });
            return forms;
          });
          setFilledForms(filteredForms);
        },
        error => {
          createErrorHandler();
          setError(error);
        }
      );
      return () => sub.unsubscribe();
    }
  }, [forms]);

  React.useEffect(() => {
    const availableForms = filterAvailableAndCompletedForms(forms, encounters);
    const completedForms = availableForms.completed.map(encounters => {
      encounters.form.complete = true;
      encounters.form.lastCompleted = encounters.encounterDateTime;
      return encounters.form;
    });
    setCompletedForms(completedForms);
  }, [forms, encounters]);

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
              forms={filledForms}
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
      {isLoading ? (
        <DataTableSkeleton rowCount={5} />
      ) : filledForms.length > 0 ? (
        <RenderForm />
      ) : (
        <EmptyState
          displayText={displayText}
          headerTitle={headerTitle}
          launchForm={() => {
            navigate({ to: "/formbuilder/#/forms" });
          }}
        />
      )}
      {error && <ErrorState error={error} headerTitle={headerTitle} />}
    </>
  );
};

export default Forms;
