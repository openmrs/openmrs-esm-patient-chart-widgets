import { openmrsFetch } from "@openmrs/esm-api";

export function getAttachmentByUuid(
  attachmentUuid: string,
  abortController: AbortController
) {
  return openmrsFetch(`/ws/rest/v1/attachment/${attachmentUuid}`, {
    signal: abortController.signal
  });
}

export function getAttachments(
  patientUuid: string,
  includeEncounterless: boolean,
  abortController: AbortController
) {
  return openmrsFetch(
    `/ws/rest/v1/attachment?patient=${patientUuid}&includeEncounterless=${includeEncounterless}`,
    {
      signal: abortController.signal
    }
  );
}

export function createAttachment(
  patientUuid: string,
  abortController: AbortController,
  file: File,
  fileCaption: string
) {
  const formData = new FormData();
  formData.append("fileCaption", fileCaption);
  formData.append("patient", patientUuid);
  formData.append("file", file);
  return openmrsFetch(`/ws/rest/v1/attachment`, {
    method: "POST",
    signal: abortController.signal,
    body: formData
  });
}

export function deleteAttachment(
  attachmentUuid: string,
  abortController: AbortController
) {
  return openmrsFetch(`/ws/rest/v1/attachment/${attachmentUuid}`, {
    method: "DELETE",
    signal: abortController.signal
  });
}
