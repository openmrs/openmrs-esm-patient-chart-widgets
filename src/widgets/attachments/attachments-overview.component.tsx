import React, { useState, useEffect } from "react";
import AttachmentsGallery from "./attachments-gallery.component";
import { useCurrentPatient } from "@openmrs/esm-api";
import {
  getAttachments,
  createAttachment,
  deleteAttachment
} from "./attachments.resource";

export default function AttachmentsOverview() {
  const [attachments, setAttachments] = useState([]);

  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();

  useEffect(() => {
    if (patientUuid) {
      const abortController = new AbortController();
      getAttachments(patientUuid, true, abortController).then(
        (response: any) => {
          setAttachments(response.data.results);
        }
      );
    }
  }, [patientUuid]);

  function handleDelete(uuid: string) {
    const abortController = new AbortController();
    deleteAttachment(uuid, abortController).then((response: any) => {
      const attachments_tmp = attachments.filter(att => att.uuid !== uuid);
      setAttachments(attachments_tmp);
    });
  }

  function handleAdd(attachment: Attachment) {
    const abortController = new AbortController();
    createAttachment(
      patientUuid,
      abortController,
      attachment.file,
      attachment.fileCaption
    ).then((response: any) => {
      const attachments_tmp = attachments.slice();
      attachments_tmp.push(response);
      setAttachments(attachments_tmp);
    });
  }

  return (
    <AttachmentsGallery
      attachments={attachments}
      onDelete={handleDelete}
      onAdd={handleAdd}
    />
  );
}

export type Attachment = {
  fileCaption: string;
  file: File;
};
