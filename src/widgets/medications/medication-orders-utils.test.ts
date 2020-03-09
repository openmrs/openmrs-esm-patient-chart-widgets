import { getDosage, setDefaultValues } from "./medication-orders-utils";
import commonMedicationJson from "./common-medication.json";

describe("MedicationOrderUtils", () => {
  it("should return the correct dosage", () => {
    let results = getDosage("80mg", 3);
    expect(results).toBe("240 mg");
  });

  it("should return the correct dosage when give a concentration", () => {
    let results = getDosage("80mg/400mg", 5);
    expect(results).toBe("5 mg (25 mg)");
  });

  it("should return the correct default medication orders", () => {
    let results = setDefaultValues(commonMedicationJson);
    expect(results).toBeDefined();
  });
});
