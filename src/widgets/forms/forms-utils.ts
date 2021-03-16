import { Encounter, Form } from "../types";

export function filterAvailableAndCompletedForms(
  forms: Array<Form>,
  encounters: Array<Encounter>
): {
  available: Array<Form>;
  completed: Array<Encounter>;
} {
  const availability = {
    available: [],
    completed: []
  };

  forms.forEach(form => {
    const completedEncounters = encounters.filter(encounter => {
      return areFormsEqual(encounter.form, form);
    });
    if (completedEncounters.length > 0) {
      availability.completed.push(...completedEncounters);
    } else {
      availability.available.push(form);
    }
  });
  return availability;
}

export const areFormsEqual = (a: Form, b: Form): boolean => {
  return a !== null && b !== null && a.uuid === b.uuid;
};

export const filterFormsByName = (formName: string, forms: Array<Form>) => {
  return forms.filter(
    form => form.name.toLowerCase().search(formName.toLowerCase()) !== -1
  );
};
