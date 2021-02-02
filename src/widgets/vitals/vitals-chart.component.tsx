import React from "react";
import styles from "./vitals-chart.component.scss";
import "@carbon/charts/styles.css";
import { RadioButtonGroup, RadioButton } from "carbon-components-react";
import { PatientVitals } from "./vitals-biometrics.resource";
import { LineChart } from "@carbon/charts-react";
import { LineChartOptions } from "@carbon/charts/interfaces/charts";
import { ScaleTypes } from "@carbon/charts/interfaces/enums";
import dayjs from "dayjs";

interface vitalsChartData {
  title: string;
  value: number | string;
  groupName:
    | "Blood Pressure"
    | "Oxygen Saturation"
    | "Temperature"
    | "Respiratory Rate";
}

interface VitalsChartProps {
  patientVitals: Array<PatientVitals>;
  conceptsUnits: Array<string>;
}

const VitalsChart: React.FC<VitalsChartProps> = ({
  patientVitals,
  conceptsUnits
}) => {
  const [chartData, setChartData] = React.useState([]);
  const [
    bloodPressureUnit,
    ,
    temperatureUnit,
    ,
    ,
    ,
    oxygenSaturationUnit,
    ,
    respiratoryRateUnit
  ] = conceptsUnits;
  const [selectedVitalSign, setSelecteVitalsSign] = React.useState<
    vitalsChartData
  >({
    title: `BP (${bloodPressureUnit})`,
    value: "systolic",
    groupName: "Blood Pressure"
  });

  React.useEffect(() => {
    const chartData = patientVitals.map(vitals => {
      return vitals[selectedVitalSign.value]
        ? {
            group: selectedVitalSign.groupName,
            key: dayjs(vitals.date).format("DD-MMM"),
            value: vitals[selectedVitalSign.value]
          }
        : {};
    });
    setChartData(chartData);
  }, [patientVitals, selectedVitalSign]);

  const chartColors = {
    "Blood Pressure": "#6929c4",
    "Oxygen Saturation": "#6929c4",
    Temperature: "#6929c4",
    "Respiratory Rate": "#6929c4"
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
        title: selectedVitalSign.title,
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
    <div className={styles.vitalsChartContainer}>
      <div className={styles.vitalSignsArea} style={{ flex: 1 }}>
        <label className={styles.vitalsSign} htmlFor="radio-button-group">
          Vital Sign Displayed
        </label>
        <RadioButtonGroup
          defaultSelected="bloodPressure"
          name="radio-button-group"
          valueSelected="bloodPressure"
          orientation="vertical"
          labelPosition="right"
        >
          <RadioButton
            id="radio-1"
            labelText={`BP ${bloodPressureUnit}`}
            value="bloodPressure"
            className={styles.vitalsSignsRadioButton}
            onClick={() =>
              setSelecteVitalsSign({
                title: `BP (${bloodPressureUnit})`,
                value: "systolic",
                groupName: "Blood Pressure"
              })
            }
          />
          <RadioButton
            id="radio-2"
            labelText={`SPO2 (${oxygenSaturationUnit})`}
            value="oxygenSaturation"
            className={styles.vitalsSignsRadioButton}
            onClick={() =>
              setSelecteVitalsSign({
                title: `SPO2 (${oxygenSaturationUnit})`,
                value: "oxygenSaturation",
                groupName: "Oxygen Saturation"
              })
            }
          />
          <RadioButton
            id="radio-3"
            labelText={`Temp (${temperatureUnit})`}
            value="temperature"
            className={styles.vitalsSignsRadioButton}
            onClick={() => {
              setSelecteVitalsSign({
                title: `Temp (${temperatureUnit})`,
                value: "temperature",
                groupName: "Temperature"
              });
            }}
          />
          <RadioButton
            id="radio-4"
            labelText={`R.Rate (${respiratoryRateUnit})`}
            value="respiratoryRate"
            className={styles.vitalsSignsRadioButton}
            onClick={() => {
              setSelecteVitalsSign({
                title: `R.Rate ${oxygenSaturationUnit}`,
                value: "respiratoryRate",
                groupName: "Respiratory Rate"
              });
            }}
          />
        </RadioButtonGroup>
      </div>
      <div className={styles.vitalsChartArea} style={{ flex: 4 }}>
        <LineChart data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default VitalsChart;
