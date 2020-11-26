import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import ProgramsForm from "./programs-form.component";
import { fetchActiveEnrollments } from "./programs.resource";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-react-utils";
import { openWorkspaceTab } from "../shared-utils";
import { PatientProgram } from "../types";
import useChartBasePath from "../../utils/use-chart-base";
import HorizontalLabelValue from "../../ui-components/cards/horizontal-label-value.component";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import SummaryCardFooter from "../../ui-components/cards/summary-card-footer.component";
import SummaryCard from "../../ui-components/cards/summary-card.component";
import SummaryCardRow from "../../ui-components/cards/summary-card-row.component";
import SummaryCardRowContent from "../../ui-components/cards/summary-card-row-content.component";

export default function ProgramsOverview(props: ProgramsOverviewProps) {
  const [patientPrograms, setPatientPrograms] = useState(
    Array<PatientProgram>()
  );
  const [, , patientUuid] = useCurrentPatient();
  const { t } = useTranslation();
  const chartBasePath = useChartBasePath();
  const programsPath = chartBasePath + "/" + props.basePath;

  useEffect(() => {
    if (patientUuid) {
      const subscription = fetchActiveEnrollments(patientUuid).subscribe(
        programs => setPatientPrograms(programs),
        createErrorHandler()
      );

      return () => subscription.unsubscribe();
    }
  }, [patientUuid]);

  return (
    <>
      {patientPrograms?.length > 0 ? (
        <SummaryCard
          name={t("carePrograms", "Care Programs")}
          link={programsPath}
          styles={{ margin: "1.25rem, 1.5rem" }}
          addComponent={ProgramsForm}
          showComponent={() =>
            openWorkspaceTab(
              ProgramsForm,
              `${t("programsForm", "Programs Form")}`
            )
          }
        >
          <SummaryCardRow>
            <SummaryCardRowContent>
              <HorizontalLabelValue
                label={t("activePrograms", "Active Programs")}
                labelStyles={{
                  color: "var(--omrs-color-ink-medium-contrast)",
                  fontFamily: "Work Sans"
                }}
                value={t("since", "Since")}
                valueStyles={{
                  color: "var(--omrs-color-ink-medium-contrast)",
                  fontFamily: "Work Sans"
                }}
              />
            </SummaryCardRowContent>
          </SummaryCardRow>
          {patientPrograms.map(program => {
            return (
              <SummaryCardRow
                key={program.uuid}
                linkTo={`${programsPath}/${program.uuid}`}
              >
                <HorizontalLabelValue
                  label={program.display}
                  labelStyles={{ fontWeight: 500 }}
                  value={dayjs(program.dateEnrolled).format("MMM-YYYY")}
                  valueStyles={{ fontFamily: "Work Sans" }}
                />
              </SummaryCardRow>
            );
          })}
          <SummaryCardFooter linkTo={programsPath} />
        </SummaryCard>
      ) : (
        <EmptyState
          name={t("carePrograms", "Care Programs")}
          showComponent={() =>
            openWorkspaceTab(
              ProgramsForm,
              `${t("programsForm", "Programs Form")}`
            )
          }
          addComponent={ProgramsForm}
          displayText={t("programEnrollments", "program enrollments")}
        />
      )}
    </>
  );
}

type ProgramsOverviewProps = {
  basePath: string;
};
