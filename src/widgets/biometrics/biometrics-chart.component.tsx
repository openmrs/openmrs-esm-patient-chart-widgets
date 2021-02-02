import React from "react";
import styles from "./biometrics-chart.component.scss";
import { LineChart } from "@carbon/charts-react";
import { useConfig } from "@openmrs/esm-react-utils";
import { RadioButton, RadioButtonGroup } from "carbon-components-react";
import { PatientBiometrics } from "./biometrics-overview.component";
import { LineChartOptions } from "@carbon/charts/interfaces/charts";
import { ScaleTypes } from "@carbon/charts/interfaces/enums";
import dayjs from "dayjs";

interface BiometricsChartProps {
  patientBiometrics: Array<PatientBiometrics>;
  conceptsUnits: Array<string>;
}

interface biometricChartData {
  title: string;
  value: number | string;
  groupName: "weight" | "height" | "bmi" | string;
}

const chartColors = { weight: "#6929c4", height: "#6929c4", bmi: "#6929c4" };

const BiometricsChart: React.FC<BiometricsChartProps> = ({
  patientBiometrics,
  conceptsUnits
}) => {
  const config = useConfig();
  const { bmiUnit } = config.biometrics;
  const [, , , heightUnit, weightUnit] = conceptsUnits;
  const [selectedBiometrics, setSelectedBiometrics] = React.useState<
    biometricChartData
  >({
    title: `Weight (${weightUnit})`,
    value: "weight",
    groupName: "weight"
  });

  const chartData = React.useMemo(
    () =>
      patientBiometrics.map(biometric => {
        return biometric[selectedBiometrics.value]
          ? {
              group: selectedBiometrics.groupName,
              key: dayjs(biometric.date).format("DD-MMM"),
              value: biometric[selectedBiometrics.value]
            }
          : {};
      }),
    [patientBiometrics, selectedBiometrics]
  );

  const chartOptions: LineChartOptions = React.useMemo(() => {
    return {
      axes: {
        bottom: {
          title: "Date",
          mapsTo: "key",
          scaleType: ScaleTypes.LABELS
        },
        left: {
          mapsTo: "value",
          title: selectedBiometrics.title,
          scaleType: ScaleTypes.LINEAR,
          includeZero: false
        }
      },
      legend: {
        enabled: false
      },
      color: {
        scale: chartColors
      }
    };
  }, [selectedBiometrics]);
  return (
    <div className={styles.biometricChartContainer}>
      <div className={styles.biometricSignsArea}>
        <label
          className={styles.biometricSign}
          htmlFor="biometrics-chart-radio-group"
        >
          Biometric Displayed
        </label>
        <RadioButtonGroup
          defaultSelected="weight"
          name="biometrics-chart-radio-group"
          valueSelected="weight"
          orientation="vertical"
          labelPosition="right"
        >
          {[
            { id: "weight", label: `Weight (${weightUnit})` },
            { id: "height", label: `Height (${heightUnit})` },
            { id: "bmi", label: `BMI (${bmiUnit})` }
          ].map(({ id, label }) => (
            <RadioButton
              id={id}
              labelText={label}
              value={id}
              className={styles.biometricSignsRadioButton}
              onClick={() =>
                setSelectedBiometrics({
                  title: label,
                  value: id,
                  groupName: id
                })
              }
            />
          ))}
        </RadioButtonGroup>
      </div>
      <div className={styles.biometricChartArea}>
        <LineChart data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default BiometricsChart;
