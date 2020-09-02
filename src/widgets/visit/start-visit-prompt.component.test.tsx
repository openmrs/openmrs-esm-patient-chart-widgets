import { startVisitPrompt } from "./start-visit-prompt.component";
import { newModalItem } from "./visit-dialog.resource";

jest.mock("./visit-dialog.resource", () => ({
  newModalItem: jest.fn()
}));

const mockNewModalItem = newModalItem as jest.Mock;

describe("StartVisitPrompt", () => {
  it("should open StartVisit Prompt", () => {
    startVisitPrompt();
    expect(mockNewModalItem).toHaveBeenCalled();
  });
});
