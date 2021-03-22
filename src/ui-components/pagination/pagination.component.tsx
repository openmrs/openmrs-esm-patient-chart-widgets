import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./pagination.component.scss";
import Pagination from "carbon-components-react/es/components/Pagination";
import { ConfigurableLink, useCurrentPatient } from "@openmrs/esm-framework";
import isEmpty from "lodash-es/isEmpty";

interface PatientChartPaginationProps {
  items: Array<unknown>;
  pageNumber: number;
  pageSize: number;
  onPageNumberChange?: any;
  pageUrl: string;
}

/**
 * @param items The items to be paged.
 * @param pageNumber The number of the page to be returned as the first result element. Not zero-based!
 *                   The first page has the number 1.
 * @param pageSize The number of items per page.
 * @param onPageNumberChange The function called when page Number is changed
 * @param pageUrl The url to redirect when see all link is clicked
 */

const PatientChartPagination: React.FC<PatientChartPaginationProps> = ({
  items,
  pageSize,
  onPageNumberChange,
  pageNumber,
  pageUrl
}) => {
  const { t } = useTranslation();
  const [, , patientUuid] = useCurrentPatient();
  const chartBasePath = `$\{openmrsSpaBase}/patient/${patientUuid}/chart/`;

  const generatePageSizes = () => {
    const numberOfPages = Math.ceil(items?.length / pageSize);
    return [...Array(numberOfPages).keys()].map(x => {
      return (x + 1) * pageSize;
    });
  };

  return (
    <>
      {items.length > 0 && (
        <div className={styles.paginationContainer}>
          <div className={styles.paginationLink}>
            {`${pageSize > items.length ? items.length : pageSize} / ${
              items.length
            } `}
            {t("items", " items")}
            <ConfigurableLink
              to={`${chartBasePath}${pageUrl}`}
              className={styles.configurableLink}
            >
              {t("seeAll", "See all")}
            </ConfigurableLink>
          </div>
          <Pagination
            className={styles.pagination}
            page={pageNumber}
            pageSize={pageSize}
            pageSizes={generatePageSizes()}
            totalItems={items.length + 1}
            onChange={onPageNumberChange}
          />
        </div>
      )}
    </>
  );
};

export default PatientChartPagination;
