import React from "react";
import styles from "./camera-frame.css";
import attachmentsOverviewStyles from "./attachments-overview.css";

export default function CameraFrame(props: CameraFrameProps) {
  function handleClick() {
    props.onCloseCamera();
  }

  return (
    <div className={styles.frame}>
      <div className={styles.frameContent}>
        <div className={styles.closeButtonWrapper}>
          <span
            role="button"
            className={styles.close}
            onClick={e => handleClick()}
            tabIndex={0}
          >
            &times;
          </span>
        </div>
        {props.children}
        <div className={styles.choosePhoto}>
          <form>
            <label htmlFor="uploadPhoto" className={styles.choosePhoto}>
              Select photo
            </label>
            <input type="file" id="uploadPhoto" style={{ display: "none" }} />
          </form>
        </div>
      </div>
    </div>
  );
}

type CameraFrameProps = {
  children: React.ReactNode;
  onCloseCamera: Function;
};
