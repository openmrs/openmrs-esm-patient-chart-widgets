import React from "react";
import CheckmarkFilled16 from "@carbon/icons-react/es/checkmark--filled/16";
import RadioButton16 from "@carbon/icons-react/es/radio-button/16";
import { switchTo } from "@openmrs/esm-framework";
import { useTranslation } from "react-i18next";
import { Form } from "../types";
import styles from "./form-view.component.scss";
import { getStartedVisit, visitItem } from "../visit/visit-utils";
import { startVisitPrompt } from "../visit/start-visit-prompt.component";
import Search from "carbon-components-react/es/components/Search";
import RadioButtonGroup from "carbon-components-react/lib/components/RadioButtonGroup/RadioButtonGroup";
import RadioButton from "carbon-components-react/lib/components/RadioButton/RadioButton";
import debounce from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import { filterFormsByName } from "./forms-utils";
import EmptyDataIllustration from "../../ui-components/empty-state/empty-data-illustration.component";
import { Tile } from "carbon-components-react/es/components/Tile";

interface FormViewProps {
  forms: Array<Form>;
  patientUuid: string;
  encounterUuid?: string;
}

interface checkBoxProps {
  label: string;
  form: Form;
}

const FormView: React.FC<FormViewProps> = ({
  forms,
  patientUuid,
  encounterUuid
}) => {
  const searchTimeout = 300;
  const { t } = useTranslation();
  const [activeVisit, setActiveVisit] = React.useState<visitItem>();
  const [searchTerm, setSearchTerm] = React.useState<string>(null);
  const [allForms, setAllForms] = React.useState<Array<Form>>(forms);

  const handleSearch = debounce(searchTerm => {
    setSearchTerm(searchTerm);
  }, searchTimeout);

  React.useEffect(() => {
    const updatedForms = !isEmpty(searchTerm)
      ? filterFormsByName(searchTerm, forms)
      : forms;
    setAllForms(updatedForms);
  }, [searchTerm, forms]);

  const launchFormEntry = form => {
    if (activeVisit) {
      const url = `/patient/${patientUuid}/formentry`;
      switchTo("workspace", url, {
        title: t("formEntry", `${form.name}`),
        formUuid: form.uuid,
        encounterUuid: encounterUuid
      });
    } else {
      startVisitPrompt();
    }
  };

  React.useEffect(() => {
    const sub = getStartedVisit.subscribe(visit => {
      setActiveVisit(visit);
    });
    return () => sub.unsubscribe();
  }, []);

  const CheckedComponent: React.FC<checkBoxProps> = ({ label, form }) => {
    return (
      <div
        tabIndex={0}
        role="button"
        onClick={() => launchFormEntry(form)}
        className={styles.customCheckBoxContainer}
      >
        {form.checked ? <CheckmarkFilled16 /> : <RadioButton16 />}
        <div className={styles.label}>{label}</div>
      </div>
    );
  };

  return (
    <div className={styles.formContainer}>
      <Search
        id="searchInput"
        className={styles.formSearchInput}
        placeholder={t("searchForForm", "Search for a form")}
        onChange={evnt => handleSearch(evnt.target.value)}
      />
      <>
        {!isEmpty(searchTerm) && !isEmpty(allForms) && (
          <p className={styles.formResultsLabel}>
            {allForms.length} {t("matchFound", "match found")}
          </p>
        )}
        {isEmpty(allForms) && !isEmpty(searchTerm) && (
          <Tile light className={styles.formTile}>
            <EmptyDataIllustration />
            <p className={styles.content}>
              {t(
                "sorryNoFormsHaveBeenFound",
                "Sorry, no forms have been found"
              )}
            </p>
            <p className={styles.action}>
              {t(
                "trySearchingForTheFormUsingAnAlternativeNameorKeyword",
                "Try searching for the form using an alternative name or keyword"
              )}
            </p>
          </Tile>
        )}
        <div className={styles.formCheckBoxContainer}>
          {allForms.map((form, index) => (
            <CheckedComponent key={index} label={form.name} form={form} />
          ))}
        </div>
      </>
    </div>
  );
};

export default FormView;
