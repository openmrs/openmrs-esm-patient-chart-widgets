import React, { useState } from "react";
import placeholder from "../../assets/placeholder.png";
import CameraUpload from "./camera-upload.component";
import { toOmrsDateString } from "../../utils/omrs-dates";
import { useConfig } from "@openmrs/esm-react-utils";
import Button from "carbon-components-react/lib/components/Button";

export default function CapturePatientPhoto(props) {
  const [openCamera, setOpenCamera] = useState(false);
  const [dataUri, setDataUri] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const config = useConfig();
  const altText = "Patient photo";

  const showCamera = () => {
    setOpenCamera(true);
  };

  const closeCamera = () => {
    setOpenCamera(false);
  };

  const processCapturedImage = (dataUri: string, selectedFile: File) => {
    closeCamera();
    setDataUri(dataUri);
    setSelectedFile(selectedFile);
    props.onCapturePhoto(
      dataUri,
      selectedFile,
      toOmrsDateString(new Date()),
      config.concepts.patientPhotoUuid
    );
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ maxWidth: "20%", margin: "4px" }}>
        <img
          src={
            dataUri
              ? dataUri
              : selectedFile
              ? URL.createObjectURL(selectedFile)
              : placeholder
          }
          alt={altText}
          style={{ width: "100%" }}
        />
      </div>
      <div>
        <Button kind="ghost" onClick={e => showCamera()}>
          Change
        </Button>
        <CameraUpload
          openCameraOnRender={openCamera}
          shouldNotRenderButton={true}
          closeCamera={closeCamera}
          delegateSaveImage={processCapturedImage}
        />
      </div>
    </div>
  );
}
