import React from "react";
import AttachmentsGallery from "./attachments-gallery.component";

export default function AttachmentsOverview() {
  return <AttachmentsGallery />;
}

export type Attachment = {
  uuid: string;
};
