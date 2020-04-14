import React from 'react';
import styles from './attachment-document.css';

export default function AttachmentDocument(props: AttachmentDocumentProps) {
    function handleDelete() {
        props.onDelete(props.id);
    }

    return (
        <div className={styles.thumbnail}>
          <span className={styles.iconCloseBlack} onClick={handleDelete}>
            x
          </span>
          <div className={styles.thumbnailDoc}>
            <a target="_blank" href={props.src}>
              <img src={props.src} />
            </a>
          </div>
          <div className={styles.thumbnailCap}>
            <span className={styles.thumbnailCapText}>{props.caption}</span>
          </div>
        </div>
      );
}

type AttachmentDocumentProps = {
    src: string;
    caption?: string;
    type: string;
    id: number;
    onDelete?: any;
};