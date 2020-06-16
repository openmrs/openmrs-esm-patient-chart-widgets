import React, { useState } from "react";
import styles from "./image-preview.css";
import { useTranslation } from "react-i18next";

export default function ImagePreview(props: ImagePreviewProps) {
  const [caption, setCaption] = useState("");
  const { t } = useTranslation();

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

  function updateCaption(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    e.stopPropagation();
    setCaption(e.target.value);
  }

  return (
    <form className={styles.overview} onSubmit={handleSubmit}>
      <img src={props.dataUri} alt={t("Webcam preview")} />
      <input
        type="text"
        placeholder={t("attachmentCaptionInstruction")}
        onChange={updateCaption}
      />
      <button onClick={saveImage}>{t("Save")}</button>
      <button onClick={cancelCapture}>{t("Cancel")}</button>
    </form>
  );
}

type ImagePreviewProps = {
  dataUri: string;
  onSaveImage?: Function;
  onCancelCapture?: Function;
};
