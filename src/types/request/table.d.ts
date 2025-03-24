import React from "react";

export interface TableRequest<F, P extends TablePagination, S> {
  /**
   * 表头过滤参数。
   */
  filter?: F;
  /**
   * 表格上方搜索框参数。
   */
  params: P;
  /**
   * 表头排序参数。
   */
  sort?: S;
  /**
   * 表格多选时选择的id。
   */
  idList?: React.Key[];
}

export interface TablePagination {
  pageSize: number;

  current: number;
}
