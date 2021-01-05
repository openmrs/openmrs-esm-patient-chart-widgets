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
  groupName: "weight" | "height" | "bmi";
}

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
  const [chartData, setChartData] = React.useState([]);

  React.useEffect(() => {
    const chartData = patientBiometrics.map(biometric => {
      return {
        group: selectedBiometrics.groupName,
        key: dayjs(biometric.date).format("DD-MMM"),
        value: biometric[selectedBiometrics.value]
      };
    });
    setChartData(chartData);
  }, [patientBiometrics, selectedBiometrics]);

  const chartColors = {
    weight: "#6929c4",
    height: "#6929c4",
    bmi: "#6929c4"
  };
  const chartOptions: LineChartOptions = {
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
  return (
    <div className={styles.biometricChartContainer}>
      <div className={styles.biometricSignsArea} style={{ flex: 1 }}>
        <label className={styles.biometricSign} htmlFor="radio-button-group">
          Biometric Displayed
        </label>
        <RadioButtonGroup
          defaultSelected="weight"
          name="radio-button-group"
          valueSelected="weight"
          orientation="vertical"
          labelPosition="right"
        >
          <RadioButton
            id="weight"
            labelText={`Weight (${weightUnit})`}
            value="weight"
            className={styles.biometricSignsRadioButton}
            onClick={() =>
              setSelectedBiometrics({
                title: `weight (${weightUnit})`,
                value: "weight",
                groupName: "weight"
              })
            }
          />
          <RadioButton
            id="height"
            labelText={`Height (${heightUnit})`}
            value="oxygenSaturation"
            className={styles.biometricSignsRadioButton}
            onClick={() =>
              setSelectedBiometrics({
                title: `Height (${heightUnit})`,
                value: "height",
                groupName: "height"
              })
            }
          />
          <RadioButton
            id="bmi"
            labelText={`BMI (${bmiUnit})`}
            value="bmi"
            className={styles.biometricSignsRadioButton}
            onClick={() =>
              setSelectedBiometrics({
                title: `BMI (${bmiUnit})`,
                value: "bmi",
                groupName: "bmi"
              })
            }
          />
        </RadioButtonGroup>
      </div>
      <div className={styles.biometricSignsArea} style={{ flex: 4 }}>
        <LineChart data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default BiometricsChart;
