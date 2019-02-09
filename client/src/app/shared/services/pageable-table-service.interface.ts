import { Observable } from 'rxjs/Observable';

export interface IPageableTableService {
    columns : Array<IColumnDefinition>;
    getPage(filterOptions: IFilterOptions): Observable<any>;
}

export interface IColumnDefinition {
    DisplayText: string,
    ColumnName: string,
    DataType: 'string' | 'date' | 'time' | 'datetime' | 'checkmark' | 'number' | 'decimal' | 'percentage' | 'currency' | 'boolean' | 'booleanRedX' | 'colorbox' | 'integer',
    IsKeyColumn?: boolean, // ? makes this an optional property
    IsGroupColumn?: boolean,
    disableFilter?: boolean,
    disableSort?: boolean,
    searchText?: string,
    IsDetailLine?: boolean,
    isDescending?: boolean
}
export interface IFilterOptions {
    columnFilters: Array<IColumnSearch>;
    sort: IColumnSort;
    skip: number;
    take: number;
    globalFilter?: string;
    bhrtable?: string;
};

export interface IColumnSearch {
    columnName: string;
    search: string;
    dataType: string;
}

export interface IColumnSort {
    columnName: string;
    isDescending: boolean;
    columnReference: any;
}
export interface ITreeHierarchy {
    KeyColumn: string;
    ParentColumn: string;
    HierarchyLevelColumn: string;
}
