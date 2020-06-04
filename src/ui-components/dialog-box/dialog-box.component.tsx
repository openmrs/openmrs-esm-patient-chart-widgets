import React, { useState, useEffect } from "react";
import styles from "./dialog-box.css";
import {
  DialogBoxItem,
  getDialogBox,
  newDialogBox
} from "./dialog-box.resource";
import { isEmpty } from "lodash-es";

export default function DialogBox() {
  const [modalItem, setModalItem] = useState<DialogBoxItem>(null);
  const [displayDialog, setDisplayDialog] = useState<boolean>(false);

  function closeDialog() {
    setDisplayDialog(false);
  }

  function openDialog() {
    setDisplayDialog(true);
  }

  useEffect(() => {
    getDialogBox().subscribe((item: DialogBoxItem) => {
      if (isEmpty(item)) return setModalItem(null);
      if (!isEmpty(item)) {
        setDisplayDialog(true);
        setModalItem(item);
      }
    });
  }, [modalItem]);

  return (
    <div className={displayDialog ? styles.dialogBox : styles.hideDialogBox}>
      <div className={styles.dialogBoxContent}>
        <div className={styles.closeButtonContainer}>
          <svg
            className="omrs-icon"
            fill="var(--omrs-color-danger)"
            onClick={() => closeDialog()}
          >
            <use xlinkHref="#omrs-icon-close"></use>
          </svg>
        </div>
        {!isEmpty(modalItem) && (
          <modalItem.component
            {...modalItem.props}
            closeDialog={() => closeDialog()}
            openDialog={() => openDialog()}
          />
        )}
      </div>
    </div>
  );
}
