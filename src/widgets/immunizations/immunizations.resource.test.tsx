import React from "react";
import { cleanup } from "@testing-library/react";
import { openmrsFetch } from "@openmrs/esm-api";
import { getImmunizationsConceptSet } from "./immunizations.resource";

const mockOpenmrsFetch = openmrsFetch as jest.Mock;

jest.mock("@openmrs/esm-api", () => ({
  openmrsFetch: jest.fn()
}));

describe("<ImmunizationResource />", () => {
  afterEach(() => {
    cleanup;
  });

  beforeEach(mockOpenmrsFetch.mockReset);

  it("should fetch immunization concept set by concept uuid", async () => {
    mockOpenmrsFetch.mockResolvedValueOnce({
      data: {
        uuid: "conceptSetUuid",
        display: "conceptSetName"
      }
    });

    const abortController = new AbortController();
    const immunizationsConceptSet = await getImmunizationsConceptSet(
      "conceptSetUuid",
      abortController
    );

    expect(mockOpenmrsFetch).toHaveBeenCalledTimes(1);
    const mockCalls = mockOpenmrsFetch.mock.calls[0];
    expect(mockCalls[0]).toBe("/ws/rest/v1/concept/conceptSetUuid?v=full");
  });

  it("should fetch immunization concept set by mapping", async () => {
    mockOpenmrsFetch.mockResolvedValueOnce({
      data: {
        results: [
          {
            uuid: "conceptSetUuid",
            display: "conceptSetName"
          }
        ]
      }
    });

    const abortController = new AbortController();
    const immunizationsConceptSet = await getImmunizationsConceptSet(
      "CIEL:12345",
      abortController
    );

    expect(mockOpenmrsFetch).toHaveBeenCalledTimes(1);
    const mockCalls = mockOpenmrsFetch.mock.calls[0];
    expect(mockCalls[0]).toBe(
      "/ws/rest/v1/concept?source=CIEL&code=12345&v=full"
    );
  });
});
