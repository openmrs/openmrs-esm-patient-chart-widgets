import React, { useState, useEffect } from "react";
import { Trans } from "react-i18next";
import placeholder from "../../assets/placeholder.png";
import CameraUpload from "./camera-upload.component";
import patientBannerStyles from "../banner/patient-banner.scss";
import { createAttachment } from "./attachments.resource";
import { toOmrsDateString } from "../../utils/omrs-dates";
function handleNewAttachment() {}

export default function CapturePatientPhoto(props) {
  const [openCamera, setOpenCamera] = useState(false);
  const [dataUri, setDataUri] = useState(null);

  const showCamera = () => {
    setOpenCamera(true);
  };

  const closeCamera = () => {
    setOpenCamera(false);
  };

  const onFinishPhotoCapture = (dataUri: string) => {
    closeCamera();
    setDataUri(dataUri);
    const obsDate = toOmrsDateString(new Date());
    props.onCapturePhoto(dataUri, createAttachment, obsDate);
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ maxWidth: "20%", margin: "4px" }}>
        <img
          src={dataUri ? dataUri : placeholder}
          alt="Patient avatar"
          style={{ width: "100%" }}
        />
      </div>
      <div>
        <button onClick={e => showCamera()}>Change</button>
        <CameraUpload
          onNewAttachment={handleNewAttachment}
          openCameraOnRender={openCamera}
          shouldNotRenderButton={true}
          closeCamera={closeCamera}
          onSaveImage={onFinishPhotoCapture}
        />
      </div>
    </div>
  );
}

type CapturePatientPhotoProps = {
  onCapturePhoto?;
};
