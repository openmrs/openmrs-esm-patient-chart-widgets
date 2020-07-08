export type Code = {
  code: string;
  system: string;
  display: string;
};

export type FHIRImmunizationResource = {
  //FHIR Immunization type
  resource: {
    resourceType: "Immunization";
    status: "Completed";
    id: string;
    vaccineCode: { coding: Array<Code> };
    patient: { id: string };
    encounter: { id: string };
    occurrenceDateTime: Date;
    expirationDate: Date;
    location: { id: string };
    performer: { actor: { id: string } };
    manufacturer: { display: string };
    lotNumber: number;
    protocolApplied: [
      {
        doseNumberPositiveInt: number;
        series?: string;
      }
    ];
  };
};

export type FHIRImmunizationBundle = {
  resourceType: "Bundle";
  entry: Array<FHIRImmunizationResource>;
};

export type ImmunizationSequence = {
  sequenceLabel: string;
  sequenceNumber: number;
};

type ImmunizationSequenceDefinition = {
  vaccineConceptUuid: string;
  sequences: Array<ImmunizationSequence>;
};

export type ImmunizationWidgetConfigObject = {
  vaccinesConceptSet: string;
  sequenceDefinitions: Array<ImmunizationSequenceDefinition>;
};

export type ImmunizationFormData = {
  //Used to capture the Immunization form data
  patientUuid: string;
  immunizationObsUuid: string;
  vaccineName: string;
  vaccineUuid: string;
  manufacturer: string;
  expirationDate: string;
  vaccinationDate: string;
  lotNumber: number;
  currentDose: ImmunizationSequence;
  sequences?: Array<ImmunizationSequence>;
};

export type ImmunizationDoseData = {
  immunizationObsUuid: string;
  manufacturer: string;
  lotNumber: number;
  sequenceLabel: string;
  sequenceNumber: number;
  occurrenceDateTime: string;
  expirationDate: string;
};

/*This represents a single consolidated immunization used on the UI with below details
- Vaccine name and uuid
- Existing doese given to patient for that vaccine
- Sequences configured for that vaccine
  */
export type ImmunizationData = {
  vaccineName: string;
  vaccineUuid: string;
  existingDoses: Array<ImmunizationDoseData>;
  sequences?: Array<ImmunizationSequence>;
};
