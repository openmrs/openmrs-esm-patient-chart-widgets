import { VitalsConfig } from "./vitals-config";
import { WidgetCommonConfig, PatientChartConfig } from "./configs";
import { useConfig } from "@openmrs/esm-module-config";

export function useVitalsConfig(): VitalsConfig {
  const widgetConf = useConfig<PatientChartConfig>()
    .widgetCommonConfig as WidgetCommonConfig;
  const vitalsConf = widgetConf.vitalsConfig;
  return vitalsConf;
}
