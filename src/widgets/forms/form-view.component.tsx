import React from "react";
import CheckmarkFilled16 from "@carbon/icons-react/es/checkmark--filled/16";
import { switchTo } from "@openmrs/esm-extensions";
import { useTranslation } from "react-i18next";
import { Form } from "../types";
import styles from "./form-view.component.scss";

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
  const { t } = useTranslation();
  const launchFormEntry = form => {
    const url = `/patient/${patientUuid}/formentry`;
    switchTo("workspace", url, {
      title: t("formEntry", `${form.name}`),
      formUuid: form.uuid,
      encounterUuid: encounterUuid
    });
  };

  const CheckedComponent: React.FC<checkBoxProps> = ({ label, form }) => {
    return (
      <div
        tabIndex={0}
        role="button"
        onClick={() => launchFormEntry(form)}
        className={styles.customCheckBoxContainer}
      >
        <CheckmarkFilled16 />
        <div className={styles.label}>{label}</div>
      </div>
    );
  };

  return (
    <div className={styles.formContainer}>
      {forms.map((form, index) => (
        <CheckedComponent key={index} label={form.name} form={form} />
      ))}
    </div>
  );
};

export default FormView;
