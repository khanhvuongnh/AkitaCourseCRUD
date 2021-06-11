export interface SearchParam {
  sortParams: SortParam[];
  filterParam: FilterParam;
}

export interface SortParam {
  sortColumn: string;
  sortBy: SortBy;
  sortClass: SortClass;
}

export interface FilterParam {
  keyword: string;
  category_ID: number | null;
  price: number | null;
}

export enum SortBy {
  Asc = 'ASC',
  Desc = 'DESC'
};

export enum SortClass {
  Asc = 'fa fa-sort-amount-asc ml-3',
  Desc = 'fa fa-sort-amount-desc ml-3'
};