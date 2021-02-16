import { startVisitPrompt } from "./start-visit-prompt.component";

const mockNewModalItem = jest.fn();

describe("StartVisitPrompt", () => {
  it("should open StartVisit Prompt", () => {
    startVisitPrompt();
    expect(mockNewModalItem).toHaveBeenCalled();
  });
});
