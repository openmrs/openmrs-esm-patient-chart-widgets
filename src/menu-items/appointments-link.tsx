import React from "react";
import { ConfigurableLink } from "@openmrs/esm-framework";
import { useTranslation } from "react-i18next";

export default function({ basePath }) {
  const { t } = useTranslation();

  return (
    <ConfigurableLink
      to={`${basePath}/appointments`}
      className="bx--side-nav__link"
    >
      {t("Appointments", "Appointments")}
    </ConfigurableLink>
  );
}
