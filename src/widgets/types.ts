export interface PatientProgram {
  uuid: string;
  patient?: {
    uuid?: string;
    display?: string;
    links: Links;
  };
  program: {
    uuid: string;
    name: string;
    allWorkflows: Array<{
      uuid: string;
      concept: {
        uuid: string;
        display: string;
        links: Links;
      };
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
    person: {
      uuid: string;
      display: string;
      links: Links;
    };
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
  privileges: Array<{
    uuid: string;
    display: string;
    links: Links;
  }>;
  roles: Array<{
    uuid: string;
    display: string;
    links: Links;
  }>;
  retired: false;
  links: Links;
}

type Links = Array<{
  rel: string;
  uri: string;
}>;
