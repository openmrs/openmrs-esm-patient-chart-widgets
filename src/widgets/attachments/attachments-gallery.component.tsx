import React, { useState, useEffect } from "react";
import styles from "./attachments-gallery.css";
import AttachmentDocument from "./attachment-document.component";
import { useCurrentPatient } from "@openmrs/esm-api";
import {
  getAttachments,
  createAttachment,
  deleteAttachment
} from "./attachments.resource";

export default function AttachmentsGallery(props: AttachmentsGalleryProps) {
  const [documents, setDocuments] = useState([]);

  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();

  function updateState() {
    const abortController = new AbortController();
    getAttachments(patientUuid, true, abortController).then((response: any) => {
      setDocuments(response.data.results);
    });
  }

  useEffect(() => {
    if (patientUuid) {
      updateState();
    }
  }, [patientUuid, updateState]);

  const listItems = documents.map((doc, index) => (
    <AttachmentDocument
      key={index}
      uuid={doc.uuid}
      src={doc.src}
      fileCaption={doc.fileCaption}
      onDelete={handleDelete}
    />
  ));

  function handleDelete(uuid: string) {
    const abortController = new AbortController();
    deleteAttachment(uuid, abortController).then(res => {
      updateState();
    });
  }

  function handleUpload(e: React.SyntheticEvent, files: FileList | null) {
    e.preventDefault();
    e.stopPropagation();
    if (files) {
      for (let i = 0; i < files.length; i++) {
        let reader: FileReader = new FileReader();
        reader.onloadend = () => {
          const abortController = new AbortController();
          createAttachment(
            patientUuid,
            abortController,
            files[i],
            files[i].name
          ).then(res => {
            updateState();
          });
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  function handleDragOver(e: React.SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div
      className={styles.gallery}
      onPaste={e => handleUpload(e, e.clipboardData.files)}
      onDrop={e => handleUpload(e, e.dataTransfer.files)}
      onDragOver={handleDragOver}
    >
      <div className={styles.galleryHeader}>
        <form>
          <label htmlFor="file-upload" className={styles.documentUpload}>
            Attach files by dragging &amp; dropping, selecting or pasting them.
          </label>
          <input
            type="file"
            id="file-upload"
            multiple
            onChange={e => handleUpload(e, e.target.files)}
          />
        </form>
      </div>
      <div className={styles.documentsContainer}>{listItems}</div>
    </div>
  );
}

type AttachmentsGalleryProps = {};
