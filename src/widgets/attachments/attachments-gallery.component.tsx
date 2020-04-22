import React from "react";
import styles from "./attachments-gallery.css";
import AttachmentDocument from "./attachment-document.component";

export default function AttachmentsGallery(props: AttachmentsGalleryProps) {
  const listItems = props.attachments.map(doc => (
    <AttachmentDocument
      key={doc.uuid}
      uuid={doc.uuid}
      src={doc.src}
      fileCaption={doc.fileCaption}
      onDelete={handleDelete}
    />
  ));

  function handleDelete(uuid: string) {
    props.onDelete(uuid);
  }

  function handleUpload(e: React.SyntheticEvent, files: FileList | null) {
    e.preventDefault();
    e.stopPropagation();
    if (files) {
      for (let i = 0; i < files.length; i++) {
        let reader: FileReader = new FileReader();
        reader.onloadend = () => {
          props.onAdd({
            file: files[i],
            fileCaption: files[i].name
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

type AttachmentsGalleryProps = {
  attachments: any;
  onDelete(uuid: string): void;
  onAdd(attachment: any): void;
};
