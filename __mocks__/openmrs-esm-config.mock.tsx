export function defineConfigSchema() {}

export const validators = {
  isBoolean: jest.fn(),
  isString: jest.fn(),
  isUuid: jest.fn(),
  isObject: jest.fn()
};
