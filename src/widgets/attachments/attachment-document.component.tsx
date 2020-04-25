import React from "react";
import styles from "./attachment-document.css";

export default function AttachmentDocument(props: AttachmentDocumentProps) {
  function handleDelete() {
    props.onDelete(props.uuid);
  }

  return (
    <div className={styles.thumbnail}>
      <span
        className={styles.iconCloseBlack}
        onClick={handleDelete}
      >
        x
      </span>
      <div className={styles.thumbnailDoc}>
        <a target="_blank" href={props.src}>
          <img src={props.src} alt={props.fileCaption} />
        </a>
      </div>
      <div className={styles.thumbnailCap}>
        <span className={styles.thumbnailCapText}>{props.fileCaption}</span>
      </div>
    </div>
  );
}

type AttachmentDocumentProps = {
  src: string;
  fileCaption: string;
  uuid: string;
  onDelete(uuid: string): void;
};
