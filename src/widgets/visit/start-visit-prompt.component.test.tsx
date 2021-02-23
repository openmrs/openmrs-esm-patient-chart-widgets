import { startVisitPrompt } from "./start-visit-prompt.component";
import { switchTo } from "@openmrs/esm-framework";

const mockNewModalItem = switchTo.mockImplementation(() => {});

describe("StartVisitPrompt", () => {
  it("should open StartVisit Prompt", () => {
    startVisitPrompt();
    expect(mockNewModalItem).toHaveBeenCalled();
  });
});
