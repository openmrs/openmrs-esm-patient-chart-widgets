export interface PatientProgram {
  uuid: string;
  patient?: DisplayMetadata;
  program: {
    uuid: string;
    name: string;
    allWorkflows: Array<{
      uuid: string;
      concept: DisplayMetadata;
      retired: boolean;
      states: Array<{}>;
      links?: Links;
    }>;
    links: Links;
  };
  display: string;
  dateEnrolled: Date;
  dateCompleted: Date | null;
  location?: {
    uuid: string;
    display: string;
    links: Links;
  };
  voided?: boolean;
  outcome?: null;
  states?: [];
  links: Links;
  resourceVersion?: string;
}

export interface Program {
  uuid: string;
  display: string;
  allWorkflows: Array<{
    links?: Links;
  }>;
  concept: {
    uuid: string;
    display: string;
  };
}

export interface LocationData {
  display: string;
  uuid: string;
}

export interface SessionData {
  authenticated: boolean;
  locale: string;
  currentProvider: {
    uuid: string;
    display: string;
    person: DisplayMetadata;
    identifier: string;
    attributes: Array<{}>;
    retired: boolean;
    links: Links;
    resourceVersion: string;
  };
  sessionLocation: {
    uuid: string;
    display: string;
    name: string;
    description: string | null;
  };
  user: {
    uuid: string;
    display: string;
    username: string;
  };
  privileges: Array<DisplayMetadata>;
  roles: Array<DisplayMetadata>;
  retired: false;
  links: Links;
}

export type RESTPatientNote = {
  uuid: string;
  display: string;
  encounterDatetime: string;
  location: { uuid: string; display: string; name: string };
  encounterType: { name: string; uuid: string };
  auditInfo: {
    creator: any;
    uuid: string;
    display: string;
    links: any;
    dateCreated: Date;
    changedBy?: any;
    dateChanged?: Date;
  };
  encounterProviders: [{ provider: { person: { display: string } } }];
};

export interface FHIRAllergy {
  category: string[];
  clinicalStatus: {
    coding: CodingData[];
    text: string;
  };
  code: {
    coding: CodingData[];
  };
  criticality: string;
  id: string;
  meta?: {
    lastUpdated: string;
  };
  note?: [
    {
      text: string;
    }
  ];
  patient: {
    display: string;
    identifier: {
      id: string;
      system: string;
      use: string;
      value: string;
    };
    reference: string;
    type: string;
  };
  reaction: FHIRAllergicReaction[];
  recordedDate: string;
  recorder: {
    display: string;
    reference: string;
    type: string;
  };
  resourceType: string;
  text: {
    div: string;
    status: string;
  };
  type: string;
}

export interface FHIRCondition {
  clinicalStatus: {
    coding: CodingData[];
    display: String;
  };
  code: {
    coding: CodingData[];
  };
  id: string;
  onsetDateTime: string;
  recordedDate: string;
  recorder: {
    display: string;
    reference: string;
    type: string;
  };
  resourceType: string;
  subject: {
    display: string;
    reference: string;
    type: string;
  };
  text: {
    div: string;
    status: string;
  };
}

interface FHIRAllergicReaction {
  manifestation: FHIRAllergyManifestation[];
  severity: string;
  substance: {
    coding: CodingData[];
  };
}

interface FHIRAllergyManifestation {
  coding: CodingData;
}

interface CodingData {
  code: string;
  display: string;
  extension?: ExtensionData[];
  system?: string;
}

interface ExtensionData {
  extension: [];
  url: string;
}

export interface AllergyData {
  allergen: {
    allergenType: string;
    codedAllergen: {
      answers: [];
      attrributes: [];
      conceptClass: DisplayMetadata;
      display: string;
      links: Links;
      mappings: DisplayMetadata[];
      name: {
        conceptNameType: string;
        display: string;
        locale: string;
        name: string;
        uuid: string;
      };
      names: DisplayMetadata[];
      setMembers: [];
      uuid: string;
    };
  };
  auditInfo: {
    changedBy: DisplayMetadata;
    creator: DisplayMetadata;
    dateCreated: string;
    dateChanged: string;
  };
  comment: string;
  display: string;
  links: Links;
  reactions: [
    {
      reaction: AllergicReaction;
    }
  ];
  severity: {
    name: {
      conceptNameType: string;
      display: string;
      locale: string;
      name: string;
      uuid: string;
    };
    names: DisplayMetadata[];
    uuid: string;
  };
}

export type Allergen = {
  answers: [];
  attributes: [];
  conceptClass: DisplayMetadata;
  dataType: DisplayMetadata;
  descriptions: [];
  display: string;
  links: Links;
  mappings: Array<DisplayMetadata>;
  name: {
    display: string;
    links: Links;
    uuid: string;
    conceptTypeName: string | null;
    locale: string;
    localePreferred: boolean;
    name: string;
    resourceVersion: string;
  };
  names: DisplayMetadata[];
  setMembers: [];
  uuid: string;
};

export type AllergicReaction = {
  answers: [];
  attributes: [];
  conceptClass: DisplayMetadata;
  datatype: DisplayMetadata;
  descriptions: DisplayMetadata[];
  name: {
    display: string;
  };
  display: string;
  uuid: string;
};

export type ObsData = {
  height: {
    category: {
      coding: CodingData[];
    };
  };
  code: {
    coding: CodingData[];
  };
  effectiveDateTime: string;
  encounter: {
    reference: string;
    type: string;
  };
  id: string;
  issued: string;
  resourceType: string;
  status: string;
  subject: {
    display: string;
    reference: string;
    type: string;
  };
  text: {
    div: string;
    status: string;
  };
  valueQuantity: {
    value: number;
  };
};

type Links = Array<{
  rel: string;
  uri: string;
}>;

type DisplayMetadata = {
  display?: string;
  links?: Links;
  uuid?: string;
};
