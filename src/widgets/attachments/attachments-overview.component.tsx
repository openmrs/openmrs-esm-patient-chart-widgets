import React, { useState, useEffect } from "react";
import { useCurrentPatient } from "@openmrs/esm-api";
import {
  getAttachments,
  createAttachment,
  deleteAttachment
} from "./attachments.resource";
import Gallery from "react-grid-gallery";
import styles from "./attachments-overview.css";

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
          const listItems = response.data.results.map(attachment => ({
            src: `/openmrs/ws/rest/v1/attachment/${attachment.uuid}/bytes`,
            thumbnail: `/openmrs/ws/rest/v1/attachment/${attachment.uuid}/bytes`,
            thumbnailWidth: 320,
            thumbnailHeight: 212,
            caption: attachment.comment
          }));
          setAttachments(listItems);
        }
      );
    }
  }, [patientUuid]);

  function handleUpload(e: React.SyntheticEvent, files: FileList | null) {
    e.preventDefault();
    e.stopPropagation();
    const abortController = new AbortController();
    if (files) {
      const attachments_tmp = attachments.slice();
      for (let i = 0; i < files.length; i++) {
        createAttachment(
          patientUuid,
          files[i],
          files[i].name,
          abortController
        ).then(response => {
          const new_attachment = {
            src: `/openmrs/ws/rest/v1/attachment/${response.data.uuid}/bytes`,
            thumbnail: `/openmrs/ws/rest/v1/attachment/${response.data.uuid}/bytes`,
            thumbnailWidth: 320,
            thumbnailHeight: 212,
            caption: response.data.comment
          };
          attachments_tmp.push(new_attachment);
        });
      }
      setAttachments(attachments_tmp);
    }
  }

  return (
    <div className={styles.overview}>
      <div className={styles.upload}>
        <form>
          <label htmlFor="fileUpload" className={styles.uploadLabel}>
            Attach files by dragging &amp; dropping, selecting or pasting them.
          </label>
          <input
            type="file"
            id="fileUpload"
            multiple
            onChange={e => handleUpload(e, e.target.files)}
          />
        </form>
      </div>
      <Gallery images={attachments} />
    </div>
  );
}
