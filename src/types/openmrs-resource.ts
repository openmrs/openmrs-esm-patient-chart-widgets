export interface OpenmrsResource {
  uuid: string;
  display?: string;
  [anythingElse: string]: any;
}

export type SessionUser = {
  allowedLocales: string[];
  authenticated: boolean;
  locale: string;
  sessionId: string;
  user: User;
  currentProvider: { uuid: string; identifier: string };
  sessionLocation: any | null;
};

type User = {
  display: string;
  link: string[];
  persion: any;
  priviliges: any;
  resourceVersion: any;
  roles: any[];
  userProperties: any;
  username: string;
  uuid: string;
};
