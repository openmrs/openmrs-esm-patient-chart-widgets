import React, { useState } from "react";
import styles from "./image-preview.css";
import { useTranslation } from "react-i18next";
import { UserHasAccessReact } from "@openmrs/esm-api";

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
      <img src={props.dataUri} alt={t("webcamPreview", "Webcam preview")} />
      <input
        type="text"
        placeholder={t(
          "attachmentCaptionInstruction",
          "Enter a caption for the image"
        )}
        onChange={updateCaption}
      />
      <UserHasAccessReact privilege="Create Attachment">
        <button onClick={saveImage}>{t("save", "Save")} </button>
      </UserHasAccessReact>
      <button onClick={cancelCapture}>{t("cancel", "Cancel")} </button>
    </form>
  );
}

type ImagePreviewProps = {
  dataUri: string;
  onSaveImage?: Function;
  onCancelCapture?: Function;
};
