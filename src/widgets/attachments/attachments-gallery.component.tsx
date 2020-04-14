import React, { useState } from "react";
import styles from "./attachments-gallery.css";
import AttachmentDocument from './attachment-document.component';


export default function AttachmentsGallery(props: AttachmentsGalleryProps) {
  const [documents, setDocuments] = useState([
    {
      src: "https://i.picsum.photos/id/641/700/800.jpg",
      caption: "Beach",
      type: "img"
    },
    {
      src: "https://i.picsum.photos/id/688/700/800.jpg",
      caption: "Highway",
      type: "img"
    },
    {
      src: "https://i.picsum.photos/id/538/700/800.jpg",
      caption: "Bird",
      type: "img"
    },
    {
      src: "https://i.picsum.photos/id/1015/700/800.jpg",
      caption: "Cliff",
      type: "img"
    },
    {
      src: "https://i.picsum.photos/id/424/700/800.jpg",
      caption: "Forest",
      type: "img"
    },
    {
      src: "https://i.picsum.photos/id/645/700/800.jpg",
      caption: "Trees",
      type: "img"
    },
    {
      src: "https://i.picsum.photos/id/944/700/800.jpg",
      caption: "Bridge",
      type: "img"
    },
    {
      src: "https://i.picsum.photos/id/391/700/800.jpg",
      caption: "City",
      type: "img"
    },
    {
      src: "https://i.picsum.photos/id/715/700/800.jpg",
      caption: "Sunset",
      type: "img"
    },
    {
      src: "https://i.picsum.photos/id/436/700/800.jpg",
      caption: "Golden Gate",
      type: "img"
    }
  ]);

  const listItems = documents.map((doc, index) => (
    <AttachmentDocument
      key={index}
      id={index}
      src={doc.src}
      caption={doc.caption}
      type={doc.type}
      onDelete={handleDelete}
    />
  ));

  function handleDelete(id: number) {
    const docs_new = documents.slice();
    docs_new.splice(id, 1);
    setDocuments(docs_new);
  }

  function handleUpload(e: React.SyntheticEvent, files: FileList | null) {
    e.preventDefault();
    e.stopPropagation();
    if (files) {
      const docs_new = documents.slice();
      for (let i = 0; i < files.length; i++) {
        let reader: FileReader = new FileReader();
        reader.onloadend = () => {
          let doc_new = { src: "", caption: "", type: "img" };
          doc_new.src = reader.result as string;
          doc_new.caption = files[i].name;
          docs_new.push(doc_new);
          setDocuments(docs_new);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  function handleDropOver(e: React.SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div
      className={styles.gallery}
      onPaste={e => handleUpload(e, e.clipboardData.files)}
      onDrop={e => handleUpload(e, e.dataTransfer.files)}
      onDragOver={handleDropOver}
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
