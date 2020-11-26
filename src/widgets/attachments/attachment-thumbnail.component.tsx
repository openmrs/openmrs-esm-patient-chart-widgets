import React, { useState } from "react";
import styles from "./attachment-thumbnail.css";
import { useCurrentPatient } from "@openmrs/esm-react-utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

export default function AttachmentThumbnail(props: AttachmentThumbnailProps) {
  const [editingCaption, setEditingCaption] = useState(false);
  const [caption, setCaption] = useState(props.imageProps.title);

  const [
    isLoadingPatient,
    patient,
    patientUuid,
    patientErr
  ] = useCurrentPatient();

  function showEditCaptionForm(e: React.SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();
    setEditingCaption(true);
  }

  function handleClick(e: React.SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function cancelEdit(e: React.SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();
    setEditingCaption(false);
  }

  function updateCaption(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    e.stopPropagation();
    setCaption(e.target.value);
  }

  function saveCaption(e: React.SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();
    setEditingCaption(false);
    const data = new FormData();
    data.append("comment", caption);
    fetch(`/openmrs/ws/rest/v1/attachment/${props.item.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  }

  function showInfo(e: React.SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div className={styles.thumbnail}>
      <div
        className={styles.infoIcon}
        onClick={showInfo}
        role="button"
        tabIndex={0}
      >
        <FontAwesomeIcon icon={faInfoCircle} />
        <span className={styles.infoText}>{props.item.dateTime}</span>
      </div>
      <div className={styles.caption}>
        {editingCaption ? (
          <div onClick={handleClick} role="button" tabIndex={0}>
            <form>
              <input
                type="text"
                defaultValue={caption}
                onChange={updateCaption}
              />
              <div className={styles.actionButtons}>
                <span onClick={cancelEdit} role="button" tabIndex={0}>
                  x
                </span>
                <span onClick={saveCaption} role="button" tabIndex={0}>
                  &#10003;
                </span>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <span
              onClick={showEditCaptionForm}
              role="button"
              tabIndex={0}
              className={styles.captionText}
            >
              {caption}
            </span>
          </div>
        )}
      </div>
      <div>
        <img
          src={props.imageProps.src}
          alt={props.imageProps.title}
          style={props.imageProps.style}
        />
      </div>
    </div>
  );
}

type AttachmentThumbnailProps = {
  imageProps: ImageProps;
  item: ItemProps;
};

type ImageProps = {
  key: string;
  src: string;
  alt: string;
  title: string;
  style: Object;
};

type ItemProps = {
  id: string;
  dateTime: string;
};
