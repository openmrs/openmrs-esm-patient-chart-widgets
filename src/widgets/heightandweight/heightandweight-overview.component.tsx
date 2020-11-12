import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { DataTableSkeleton } from "carbon-components-react";

import { useCurrentPatient } from "@openmrs/esm-api";

import { ConfigObject } from "../../config-schema";
import { openWorkspaceTab } from "../shared-utils";
import withConfig from "../../with-config";
import useChartBasePath from "../../utils/use-chart-base";
import WidgetDataTable from "../../ui-components/datatable/datatable.component";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import VitalsForm from "../vitals/vitals-form.component";
import { Dimension, getDimensions } from "./heightandweight.resource";
import styles from "./heightandweight-overview.css";

function HeightAndWeightOverview(props: HeightAndWeightOverviewProps) {
  const initialDimensionsCount = 5;
  const { heightUuid, weightUuid } = props.config.concepts;
  const {
    bmiUnit,
    heightUnit,
    weightUnit
  } = props.config.heightAndWeightConfig;
  const { t } = useTranslation();
  const [, , patientUuid] = useCurrentPatient();
  const chartBasePath = useChartBasePath();
  const [dimensions, setDimensions] = useState<Dimension[]>(null);
  const dimensionsPath = chartBasePath + "/" + props.basePath;
  const title = `${t("heightAndWeight", "Height & weight")}`;

  const headers = [
    {
      key: "date",
      header: t("date", "Date")
    },
    {
      key: "weight",
      header: `${t("weight", "Weight")} (${weightUnit})`
    },
    {
      key: "height",
      header: `${t("height", "Height")} (${heightUnit})`
    },
    {
      key: "bmi",
      header: `${t("bmi", "BMI")} (${bmiUnit})`
    }
  ];

  useEffect(() => {
    if (patientUuid) {
      const sub = getDimensions(weightUuid, heightUuid, patientUuid).subscribe(
        dimensions => {
          setDimensions(dimensions.slice(0, initialDimensionsCount));
        }
      );

      return () => sub.unsubscribe();
    }
  }, [patientUuid, weightUuid, heightUuid]);

  const getRowItems = rows =>
    rows.map(row => ({
      ...row,
      bmi: row.bmi ? row.bmi : "",
      height: row.height ? row.height : "",
      weight: row.weight ? row.weight : ""
    }));

  const RenderDimensions = () => {
    if (dimensions.length) {
      const rows = getRowItems(dimensions);
      return (
        <WidgetDataTable
          title={title}
          headers={headers}
          rows={rows}
          linkTo={dimensionsPath}
          showComponent={() =>
            openWorkspaceTab(VitalsForm, `${t("vitalsForm", "Vitals Form")}`)
          }
          addComponent={VitalsForm}
        />
      );
    }
    return (
      <EmptyState
        showComponent={() =>
          openWorkspaceTab(VitalsForm, `${t("vitalsForm", "Vitals Form")}`)
        }
        addComponent={VitalsForm}
        name={t("heightAndWeight", "Height & weight")}
        displayText={t("dimensions", "dimensions")}
      />
    );
  };

  return <>{dimensions ? <RenderDimensions /> : <DataTableSkeleton />}</>;
}

type HeightAndWeightOverviewProps = {
  basePath: string;
  config: ConfigObject;
};

export default withConfig(HeightAndWeightOverview);
