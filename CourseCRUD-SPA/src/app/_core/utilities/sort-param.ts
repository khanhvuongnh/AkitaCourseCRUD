export interface SortParam {
  sortColumn: string;
  sortBy: SortBy;
  sortClass?: string;
}

export enum SortBy {
  Asc,
  Desc
};