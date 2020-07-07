type Code = {
  code: string;
  system: string;
  display: string;
};

export type FHIRImmunizationResource = {
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
    performer: { actor: { id: { string } } };
    manufacturer: { display: string };
    lotNumber: number;
    protocolApplied: [
      {
        doseNumberPositiveInt: number;
        series: string;
      }
    ];
  };
};

export type FhirImmunizationBundle = {
  resourceType: "Bundle";
  entry: Array<FHIRImmunizationResource>;
};

export type ImmunizationSequence = {
  sequenceLabel: string;
  sequenceNumber: number;
};

export type ImmunizationFormData = {
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
