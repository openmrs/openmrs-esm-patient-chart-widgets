export type VitalsConfig = {
  triageFormConfig: TriageFormConfig;
  vitalsConcepts: VitalsConceptsConfig;
};

export type TriageFormConfig = {
  formUuid: string;
  encounterTypeUuid: string;
  display: string;
};

export type VitalsConceptsConfig = {
  SYSTOLIC_BLOOD_PRESSURE_CONCEPT: string;
  DIASTOLIC_BLOOD_PRESSURE_CONCEPT: string;
  PULSE_CONCEPT: string;
  TEMPERATURE_CONCEPT: string;
  OXYGENATION_CONCEPT: string;
  HEIGHT_CONCEPT: string;
  WEIGHT_CONCEPT: string;
};
