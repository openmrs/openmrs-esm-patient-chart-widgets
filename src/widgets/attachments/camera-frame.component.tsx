import React from "react";
import styles from "./camera-frame.css";

export default function CameraFrame(props: CameraFrameProps) {
  function handleClick() {
    props.onCloseCamera();
  }

  return (
    <div className={styles.frame}>
      <div className={styles.frameContent}>
        <span
          role="button"
          className={styles.close}
          onClick={e => handleClick()}
          tabIndex={0}
        >
          &times;
        </span>
        {props.children}
      </div>
    </div>
  );
}

type CameraFrameProps = {
  children: React.ReactNode;
  onCloseCamera: Function;
};
