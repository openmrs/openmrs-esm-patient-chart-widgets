import { NumberInput, TextArea, TextInput } from "carbon-components-react";
import React from "react";
import styles from "./vitals-biometric-input.component.scss";

interface VitalsBiometricInputProps {
  title: string;
  onChange(evnt): void;
  textFields: Array<{
    name: string;
    separator?: string;
    type?: string | "text";
    value: number | string;
  }>;
  unitSymbol?: string;
  textFieldWidth?: string;
  textFieldStyles?: React.CSSProperties;
  placeholder?: string;
  disabled?: boolean;
}

const VitalsBiometricInput: React.FC<VitalsBiometricInputProps> = ({
  title,
  onChange,
  textFields,
  unitSymbol,
  textFieldStyles,
  textFieldWidth,
  placeholder,
  disabled
}) => {
  return (
    <div className={styles.inputContainer} style={{ width: textFieldWidth }}>
      <p className={styles.vitalsBiometricInputLabel01}>{title}</p>
      <div
        className={`${styles.inputFieldContainer} ${disabled &&
          styles.disableInput}`}
        style={{ ...textFieldStyles }}
      >
        <div className={styles.centerDiv}>
          {textFields.map(val => {
            return val.type === "text" ? (
              <>
                <TextInput
                  style={{ ...textFieldStyles }}
                  className={`${styles.inputField} ${disabled &&
                    styles.disableInput}`}
                  id={val.name}
                  name={val.name}
                  onChange={evnt => onChange(evnt)}
                  labelText={null}
                  value={val.value}
                />
                {val?.separator}
              </>
            ) : (
              <TextArea
                style={{ ...textFieldStyles }}
                className={styles.textArea}
                id={val.name}
                name={val.name}
                labelText={null}
                onChange={evnt => onChange(evnt)}
                rows={2}
                placeholder={placeholder}
                value={val.value}
              />
            );
          })}
        </div>
        <p className={styles.unitName}>{unitSymbol}</p>
      </div>
    </div>
  );
};

export default VitalsBiometricInput;
