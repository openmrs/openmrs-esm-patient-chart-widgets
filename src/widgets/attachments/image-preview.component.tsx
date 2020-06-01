import React, { useState } from "react";
import styles from "./image-preview.css";

export default function ImagePreview(props: ImagePreviewProps) {
  const [caption, setCaption] = useState("");

  function saveImage(e: React.SyntheticEvent) {
    e.preventDefault();
    props.onSaveImage(props.dataUri, caption);
  }

  function cancelCapture(e: React.SyntheticEvent) {
    e.preventDefault();
    props.onCancelCapture();
  }

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function updateCaption(e: React.SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLInputElement;
    setCaption(target.value);
  }

  return (
    <form className={styles.overview} onSubmit={handleSubmit}>
      <img src={props.dataUri} alt="Webcam preview" />
      <input
        type="text"
        placeholder="Enter a caption for the image"
        onChange={updateCaption}
      />
      <button onClick={saveImage}>Save</button>
      <button onClick={cancelCapture}>Cancel</button>
    </form>
  );
}

type ImagePreviewProps = {
  dataUri: string;
  onSaveImage?: Function;
  onCancelCapture?: Function;
};
