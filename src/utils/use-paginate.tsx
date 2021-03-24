import isEmpty from "lodash-es/isEmpty";
import React from "react";
import paginate from "./paginate";

export function usePaginate<T>(
  items: Array<T>,
  pageNumber: number,
  pageSize: number = 5
) {
  return React.useMemo(() => {
    return paginate<T>(items, pageNumber, pageSize);
  }, [!isEmpty(items), pageNumber]);
}
