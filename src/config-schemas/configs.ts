import { VitalsConfig } from "./vitals-config";
export * from "./vitals-config";

export type WidgetCommonConfig = {
  vitalsConfig: VitalsConfig;
};

export type PatientChartConfig = {
  widgetCommonConfig: WidgetCommonConfig;
  [anythingElse: string]: any;
};
