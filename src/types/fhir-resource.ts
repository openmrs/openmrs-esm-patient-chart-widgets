export type FHIRResource = {
  resource: {
    code: { coding: Array<Code> };
    effectiveDateTime: Date;
    encounter: {
      reference: string;
      type: string;
    };
    id: string;
    issued: Date;
    referenceRange: any;
    resourceType: string;
    status: string;
    subject: {
      display: string;
      identifier: { id: string; system: string; use: string; value: string };
      reference: string;
      type: string;
    };
    valueQuantity: {
      value: number;
    };
  };
};

type Code = {
  code: string;
  system: string;
};
