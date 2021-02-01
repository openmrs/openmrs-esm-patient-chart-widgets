import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { UserHasAccess } from "@openmrs/esm-react-utils";
import styles from "./image-preview.css";

export default function ImagePreview(props: ImagePreviewProps) {
  const [caption, setCaption] = useState("");
  const { t } = useTranslation();

  function saveImage(e: React.SyntheticEvent) {
    e.preventDefault();
    props.onSaveImage(props.dataUri, props.selectedFile, caption);
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
      <img
        src={
          props.dataUri
            ? props.dataUri
            : URL.createObjectURL(props.selectedFile)
        }
        alt={t("webcamPreview", "Webcam preview")}
      />
      <input
        type="text"
        placeholder={t(
          "attachmentCaptionInstruction",
          "Enter a caption for the image"
        )}
        onChange={updateCaption}
      />
      <UserHasAccess privilege="Create Attachment">
        <button onClick={saveImage}>{t("save", "Save")} </button>
      </UserHasAccess>
      <button onClick={cancelCapture}>{t("cancel", "Cancel")} </button>
    </form>
  );
}

type ImagePreviewProps = {
  dataUri: string;
  selectedFile?: File;
  onSaveImage?(dataUri: string, selectedFile: File, caption: string): void;
  onCancelCapture?(): void;
};
