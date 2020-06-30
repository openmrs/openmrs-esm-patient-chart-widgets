export function getTranslationsFor(key: string): string {
  const keyWithNamespace = `@openmrs/esm-patient-chart-app:${key}`;
  return (window as any).i18next.t(keyWithNamespace);
}
