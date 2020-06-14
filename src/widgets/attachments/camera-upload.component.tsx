import React, { useState } from "react";
import CameraFrame from "./camera-frame.component";
import ImagePreview from "./image-preview.component";
import styles from "./camera-upload.css";
import Camera from "react-html5-camera-photo";
require("react-html5-camera-photo/build/css/index.css");
require("./styles.css");
import { createAttachment } from "./attachments.resource";
import { useCurrentPatient } from "@openmrs/esm-api";

export default function CameraUpload(props: CameraUploadProps) {
  const [cameraIsOpen, setCameraIsOpen] = useState(false);
  const [dataUri, setDataUri] = useState("");

  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();

  function openCamera(e: React.SyntheticEvent) {
    setCameraIsOpen(true);
  }

  function handleCloseCamera() {
    setCameraIsOpen(false);
  }

  function handleTakePhoto(dataUri) {
    setDataUri(dataUri);
  }

  function handleCancelCapture() {
    setDataUri("");
  }

  function handleSaveImage(dataUri: string, caption: string) {
    const abortController = new AbortController();
    createAttachment(patientUuid, null, caption, abortController, dataUri).then(
      res => {
        const att = {
          id: `${res.data.uuid}`,
          src: `/openmrs/ws/rest/v1/attachment/${res.data.uuid}/bytes`,
          thumbnail: `/openmrs/ws/rest/v1/attachment/${res.data.uuid}/bytes`,
          thumbnailWidth: 320,
          thumbnailHeight: 212,
          caption: res.data.comment,
          isSelected: false
        };
        props.onNewAttachment(att);
        setDataUri("");
      }
    );
  }

  return (
    <div className={styles.cameraSection}>
      <button className="cameraButton" onClick={openCamera}>
        Camera
      </button>
      {cameraIsOpen && (
        <CameraFrame onCloseCamera={handleCloseCamera}>
          {dataUri ? (
            <ImagePreview
              dataUri={dataUri}
              onCancelCapture={handleCancelCapture}
              onSaveImage={handleSaveImage}
            />
          ) : (
            <Camera onTakePhoto={handleTakePhoto} />
          )}
        </CameraFrame>
      )}
    </div>
  );
}

type CameraUploadProps = {
  onNewAttachment: Function;
};
