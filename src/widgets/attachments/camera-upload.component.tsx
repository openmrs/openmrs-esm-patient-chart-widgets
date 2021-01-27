import React, { useEffect, useState } from "react";
import CameraFrame from "./camera-frame.component";
import ImagePreview from "./image-preview.component";
import styles from "./camera-upload.css";
import Camera from "react-html5-camera-photo";
require("react-html5-camera-photo/build/css/index.css");
require("./styles.css");
import { createAttachment } from "./attachments.resource";
import { useCurrentPatient } from "@openmrs/esm-react-utils";
import { useTranslation } from "react-i18next";

export default function CameraUpload(props: CameraUploadProps) {
  const [cameraIsOpen, setCameraIsOpen] = useState(props.openCameraOnRender);
  const [dataUri, setDataUri] = useState("");
  const { t } = useTranslation();

  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();

  function openCamera() {
    setCameraIsOpen(true);
  }

  function handleCloseCamera() {
    setCameraIsOpen(false);
    props.openCameraOnRender = false;
    if (props.closeCamera) {
      props.closeCamera();
    }
  }

  function handleTakePhoto(dataUri: string) {
    setDataUri(dataUri);
    if (props.onTakePhoto) {
      props.onTakePhoto(dataUri);
    }
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

  useEffect(() => {
    setCameraIsOpen(props.openCameraOnRender);
  }, [props.openCameraOnRender]);

  return (
    <div className={styles.cameraSection}>
      {!props.shouldNotRenderButton && (
        <button className="cameraButton" onClick={openCamera}>
          {t("camera", "Camera")}
        </button>
      )}
      {cameraIsOpen && (
        <CameraFrame onCloseCamera={handleCloseCamera}>
          {dataUri ? (
            <ImagePreview
              dataUri={dataUri}
              onCancelCapture={handleCancelCapture}
              onSaveImage={
                props.onSaveImage ? props.onSaveImage : handleSaveImage
              }
            />
          ) : (
            <div id="camera-inner-wrapper">
              <Camera onTakePhoto={handleTakePhoto} />
            </div>
          )}
        </CameraFrame>
      )}
    </div>
  );
}

type CameraUploadProps = {
  onNewAttachment: Function;
  openCameraOnRender?: Boolean;
  shouldNotRenderButton?: Boolean;
  closeCamera?: Function;
  onTakePhoto?: Function;
  onSaveImage?: Function;
};
