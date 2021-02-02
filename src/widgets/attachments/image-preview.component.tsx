import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { UserHasAccess } from "@openmrs/esm-react-utils";
import styles from "./image-preview.css";
import { Button, ButtonSet } from "carbon-components-react";

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
      {props.collectCaption && (
        <input
          type="text"
          placeholder={t(
            "attachmentCaptionInstruction",
            "Enter a caption for the image"
          )}
          onChange={updateCaption}
        />
      )}
      <ButtonSet style={{ width: "50%" }}>
        <UserHasAccess privilege="Create Attachment">
          <Button size="small" onClick={saveImage}>
            {t("save", "Save")}{" "}
          </Button>
        </UserHasAccess>
        <Button kind="danger" size="small" onClick={cancelCapture}>
          {t("cancel", "Cancel")}{" "}
        </Button>
      </ButtonSet>
    </form>
  );
}

type ImagePreviewProps = {
  dataUri: string;
  collectCaption: boolean;
  selectedFile?: File;
  onSaveImage?(dataUri: string, selectedFile: File, caption: string): void;
  onCancelCapture?(): void;
};
