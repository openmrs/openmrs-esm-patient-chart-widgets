import { ConfigurableLink } from "@openmrs/esm-framework";
import React from "react";
import { useTranslation } from "react-i18next";

export default function({ basePath }) {
  const { t } = useTranslation();

  return (
    <ConfigurableLink to={`${basePath}/summary`} className="bx--side-nav__link">
      {t("Summary", "Summary")}
    </ConfigurableLink>
  );
}
