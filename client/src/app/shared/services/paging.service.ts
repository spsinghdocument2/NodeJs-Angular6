import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppFunctions } from '../app.functions';

import { IPageableTableService, IFilterOptions, IColumnDefinition } from './pageable-table-service.interface';
import * as moment from 'moment'; 

@Injectable()
export class PagingService implements IPageableTableService {
    public data: any;
    public _columns: Array<IColumnDefinition>;

    constructor() {
        this._columns = [];
    }

    public getPage(filterOptions: IFilterOptions): Observable<any> {
        let returnValue = this.data;
        returnValue.value = this.data.rows ? this.data.rows : this.data;
        this._columns = this._columns.length > 0 ? this._columns : this.data.columns;
        returnValue['@odata.count'] = this.data.rows ? this.data.rows.length : this.data.length;
        let searchText = '';
        //apply global filter first
        try {
            if (filterOptions.globalFilter.replace('*', '').length > 0) {
                let globalResults: any[] = [];
                for (let rows of returnValue.value) {
                    for (let columnFilter of this._columns) {
                        if (!columnFilter.IsGroupColumn && !columnFilter.IsKeyColumn) {
                            if (filterOptions.globalFilter.startsWith('*') && filterOptions.globalFilter.length >= 2) {
                                searchText = filterOptions.globalFilter.slice(1).toLowerCase();
                                if (rows[columnFilter.ColumnName] && rows[columnFilter.ColumnName].toString().toLowerCase().endsWith(searchText)) {
                                    globalResults.push(rows);
                                    break;
                                }
                            }
                            else if (filterOptions.globalFilter.endsWith('*') && filterOptions.globalFilter.length >= 2) {
                                searchText = filterOptions.globalFilter.slice(0, -1).toLowerCase();
                                if (rows[columnFilter.ColumnName] && rows[columnFilter.ColumnName].toString().toLowerCase().startsWith(searchText)) {
                                    globalResults.push(rows);
                                    break;
                                }
                            }
                            else if (rows[columnFilter.ColumnName] && rows[columnFilter.ColumnName].toString().toLowerCase().match(filterOptions.globalFilter.toLowerCase())) {
                                globalResults.push(rows);
                                break;
                            } else if (rows[columnFilter.ColumnName] && moment(filterOptions.globalFilter, 'MM/DD/YYYY', true).isValid()) {
                                if (moment(rows[columnFilter.ColumnName]).format('MM/DD/YYYY').match(filterOptions.globalFilter.toLowerCase())) {
                                    globalResults.push(rows);
                                    break;
                                }
                            }
                            else if (rows[columnFilter.ColumnName] && moment(filterOptions.globalFilter, 'MM/DD/YYYY h:mm:ss a', true).isValid()) {
                                let rowDate = moment(rows[columnFilter.ColumnName]).format('MM/DD/YYYY');
                                let enterDate = moment(filterOptions.globalFilter.toLowerCase()).format('MM/DD/YYYY');
                                if (rowDate.match(enterDate)) {
                                    globalResults.push(rows);
                                    break;
                                }
                            }
                        }
                    }
                }

                returnValue.value = globalResults;
                returnValue['@odata.count'] = returnValue.value.length;
            }
            //We have all records matching global filter, now apply column level filter
            if (filterOptions.columnFilters
                && filterOptions.columnFilters.length > 0) {
                for (let columnFilter of filterOptions.columnFilters) {
                    let searchText = columnFilter.search.trim();
                    if (searchText != '*') {
                        switch (true) {
                            case columnFilter.dataType == 'date':
                                if (searchText.indexOf('*') == -1) {
                                    let lastNextThis = '';
                                    let searchWords = searchText.split(' ', 3);
                                    let searchType = 'days';
                                    if (searchText.toLowerCase().startsWith('last') ||
                                        searchText.toLowerCase().startsWith('next') ||
                                        searchText.toLowerCase().startsWith('this') ||
                                        searchText.toLowerCase().startsWith('yesterday') ||
                                        searchText.toLowerCase().startsWith('today') ||
                                        searchText.toLowerCase().startsWith('tomorrow')) {
                                        if (searchWords.length == 1) {
                                            // yesterday, today and tomorrow are like "last 0 days", "this day", or "next 0 days" are
                                            searchText = '0';
                                            switch (searchWords[0].toLowerCase()) {
                                                case 'yesterday':
                                                    lastNextThis = 'last';
                                                    break;
                                                case 'today':
                                                    lastNextThis = 'this';
                                                    break;
                                                case 'tomorrow':
                                                    lastNextThis = 'next';
                                                    break;
                                                default:
                                                    break;
                                            }
                                        }
                                        else if (searchWords.length === 2) {
                                            lastNextThis = searchWords[0];
                                            searchText = searchWords[1];
                                            if (isNaN(Number(searchText))) {
                                                // someone wrote 'last year' instead of 'last 1 year(s)'
                                                // or used 'this X'
                                                searchType = searchWords[1];
                                                searchText = '1';
                                            }
                                        }
                                        else if (searchWords.length === 3) {
                                            lastNextThis = searchWords[0];
                                            searchText = searchWords[1];
                                            searchType = searchWords[2].toLowerCase();
                                        }

                                        let n = Number(searchText);
                                        if (isNaN(n)) {
                                            returnValue.value = returnValue.value.filter(x => x[columnFilter.columnName].toString().toLowerCase().match(columnFilter.search.toLowerCase()));
                                        }

                                        let endDate = null;
                                        let startDate = null;
                                        if (n == 0) n = 1;
                                        switch (lastNextThis.toLowerCase()) {
                                            case 'last':
                                                // calculate the enddate of the unit (e.g. if today was 5/1/2012, "last 2 quarters" = 10/31/2012-3/31/2012)
                                             //   endDate = new moment().utc().subtract(1, searchType).endOf(searchType);
                                                startDate = endDate.clone().subtract(n - 1, searchType).startOf(searchType);
                                                break;
                                            case 'next':
                                                // calculate the start of the unit (e.g. if today was 5/1/2012, "next 2 quarters" = 7/1/2012-12/31/2012)
                                              //  startDate = new moment().utc().add(1, searchType).startOf(searchType);
                                                endDate = startDate.clone().add(n - 1, searchType).endOf(searchType);
                                                break;
                                            case 'this':
                                                // calculate the start of the unit (e.g. if today was 5/1/2012, "this month" = 5/1/2012-5/31/2012)
                                             //   startDate = new moment().utc().startOf(searchType);
                                                endDate = startDate.clone().endOf(searchType);
                                                break;
                                        }
                                        startDate = startDate.toISOString();
                                        endDate = endDate.toISOString();
                                        returnValue.value = returnValue.value.filter(x => new Date(x[columnFilter.columnName]) >= new Date(startDate) && new Date(x[columnFilter.columnName]) <= new Date(endDate));
                                        break;
                                    }
                                    else if (searchText.indexOf(' to ') > 0) {
                                        // a range search
                                        let dates = searchText.split(' to ', 2);
                                        let startDate = this.getMoment(dates[0]);
                                        let endDate = this.getMoment(dates[1]);

                                        if (!startDate.isValid() || !endDate.isValid()) {
                                            returnValue.value = returnValue.value.filter(x => x[columnFilter.columnName].toString().toLowerCase().match(columnFilter.search.toLowerCase()));
                                            break;
                                        }

                                        let startDateString = startDate.startOf('day').format();
                                        let endDateString = endDate.endOf('day').format();

                                        returnValue.value = returnValue.value.filter(x => x[columnFilter.columnName] >= startDateString && x[columnFilter.columnName] <= endDateString);
                                        break;
                                    }

                                    if (searchText.startsWith('>=')) {
                                        searchType = 'ge';
                                    }
                                    else if (searchText.startsWith('>')) {
                                        searchType = 'gt';
                                    }
                                    else if (searchText.startsWith('<=')) {
                                        searchType = 'le';
                                    }
                                    else if (searchText.startsWith('<')) {
                                        searchType = 'lt';
                                    }

                                    searchText = searchText.replace('>', '')
                                        .replace('<', '')
                                        .replace('=', '');

                                    var d = this.getMoment(searchText);
                                    if (d == null || !d.isValid()) {
                                        returnValue.value = returnValue.value.filter(x => x[columnFilter.columnName].toString().toLowerCase().match(columnFilter.search.toLowerCase()));
                                        break;
                                    }

                                    if (searchType === 'days') {
                                        let startDate = this.getMoment(searchText).startOf('day').format();
                                        let endDate = this.getMoment(searchText).endOf('day').format();
                                        returnValue.value = returnValue.value.filter(x => x[columnFilter.columnName] >= startDate && x[columnFilter.columnName] <= endDate);
                                    }
                                    else {
                                        let searchDate = this.getMoment(searchText);
                                        switch (searchType) {
                                            case 'gt':
                                                searchDate.add(1, 'days');
                                                returnValue.value = returnValue.value.filter(x => x[columnFilter.columnName] > searchDate.format());
                                                break;
                                            case 'ge':
                                                searchDate.add(-1, 'days');
                                                returnValue.value = returnValue.value.filter(x => x[columnFilter.columnName] >= searchDate.format());
                                                break;
                                            case 'lt':
                                                returnValue.value = returnValue.value.filter(x => x[columnFilter.columnName] < searchDate.startOf('day').format());
                                                break;
                                            case 'le':
                                                returnValue.value = returnValue.value.filter(x => x[columnFilter.columnName] <= searchDate.startOf('day').format());
                                                break;
                                        }

                                    }
                                }
                                break;
                            case columnFilter.dataType == 'datetime':
                                if (searchText.indexOf('*') == -1) {
                                    let lastNextThis = '';
                                    let searchWords = searchText.split(' ', 3);
                                    let searchType = 'days';
                                    if (searchText.toLowerCase().startsWith('last') ||
                                        searchText.toLowerCase().startsWith('next') ||
                                        searchText.toLowerCase().startsWith('this') ||
                                        searchText.toLowerCase().startsWith('yesterday') ||
                                        searchText.toLowerCase().startsWith('today') ||
                                        searchText.toLowerCase().startsWith('tomorrow')) {
                                        if (searchWords.length == 1) {
                                            // yesterday, today and tomorrow are like "last 0 days", "this day", or "next 0 days" are
                                            searchText = '0';
                                            switch (searchWords[0].toLowerCase()) {
                                                case 'yesterday':
                                                    lastNextThis = 'last';
                                                    break;
                                                case 'today':
                                                    lastNextThis = 'this';
                                                    break;
                                                case 'tomorrow':
                                                    lastNextThis = 'next';
                                                    break;
                                                default:
                                                    break;
                                            }
                                        }
                                        else if (searchWords.length === 2) {
                                            lastNextThis = searchWords[0];
                                            searchText = searchWords[1];
                                            if (isNaN(Number(searchText))) {
                                                // someone wrote 'last year' instead of 'last 1 year(s)'
                                                // or used 'this X'
                                                searchType = searchWords[1];
                                                searchText = '1';
                                            }
                                        }
                                        else if (searchWords.length === 3) {
                                            lastNextThis = searchWords[0];
                                            searchText = searchWords[1];
                                            searchType = searchWords[2].toLowerCase();
                                        }

                                        let n = Number(searchText);
                                        if (isNaN(n)) {
                                            returnValue.value = returnValue.value.filter(x => x[columnFilter.columnName].toString().toLowerCase().match(columnFilter.search.toLowerCase()));
                                        }

                                        let endDate = null;
                                        let startDate = null;
                                        if (n == 0) n = 1;
                                        switch (lastNextThis.toLowerCase()) {
                                            case 'last':
                                                // calculate the enddate of the unit (e.g. if today was 5/1/2012, "last 2 quarters" = 10/31/2012-3/31/2012)
                                              //  endDate = new moment().utc().subtract(1, searchType).endOf(searchType);
                                                startDate = endDate.clone().subtract(n - 1, searchType).startOf(searchType);
                                                break;
                                            case 'next':
                                                // calculate the start of the unit (e.g. if today was 5/1/2012, "next 2 quarters" = 7/1/2012-12/31/2012)
                                              //  startDate = new moment().utc().add(1, searchType).startOf(searchType);
                                                endDate = startDate.clone().add(n - 1, searchType).endOf(searchType);
                                                break;
                                            case 'this':
                                                // calculate the start of the unit (e.g. if today was 5/1/2012, "this month" = 5/1/2012-5/31/2012)
                                            //    startDate = new moment().utc().startOf(searchType);
                                                endDate = startDate.clone().endOf(searchType);
                                                break;
                                        }
                                        startDate = startDate.toISOString();
                                        endDate = endDate.toISOString();
                                        returnValue.value = returnValue.value.filter(x => new Date(x[columnFilter.columnName]) >= new Date(startDate) && new Date(x[columnFilter.columnName]) <= new Date(endDate));
                                        break;
                                    }
                                    else if (searchText.indexOf(' to ') > 0) {
                                        // a range search
                                        let dates = searchText.split(' to ', 2);
                                        let startDate = this.getMoment(dates[0]);
                                        let endDate = this.getMoment(dates[1]);

                                        if (!startDate.isValid() || !endDate.isValid()) {
                                            returnValue.value = returnValue.value.filter(x => x[columnFilter.columnName].toString().toLowerCase().match(columnFilter.search.toLowerCase()));
                                            break;
                                        }

                                        let startDateString = startDate.startOf('day').format();
                                        let endDateString = endDate.endOf('day').format();

                                        returnValue.value = returnValue.value.filter(x => x[columnFilter.columnName] >= startDateString && x[columnFilter.columnName] <= endDateString);
                                        break;
                                    }

                                    if (searchText.startsWith('>=')) {
                                        searchType = 'ge';
                                    }
                                    else if (searchText.startsWith('>')) {
                                        searchType = 'gt';
                                    }
                                    else if (searchText.startsWith('<=')) {
                                        searchType = 'le';
                                    }
                                    else if (searchText.startsWith('<')) {
                                        searchType = 'lt';
                                    }

                                    searchText = searchText.replace('>', '')
                                        .replace('<', '')
                                        .replace('=', '');

                                    var d = this.getMoment(searchText);
                                    if (d == null || !d.isValid()) {
                                        returnValue.value = returnValue.value.filter(x => x[columnFilter.columnName].toString().toLowerCase().match(columnFilter.search.toLowerCase()));
                                        break;
                                    }

                                    if (searchType === 'days') {
                                        let results: any[] = [];
                                        for (let rows of returnValue.value) {
                                            for (let columnFilter of this._columns) {
                                                if (!columnFilter.IsGroupColumn && !columnFilter.IsKeyColumn) {
                                                    if (rows[columnFilter.ColumnName] && moment(searchText, 'MM/DD/YYYY', true).isValid()) {
                                                        if (moment(rows[columnFilter.ColumnName]).format('MM/DD/YYYY').match(searchText.toLowerCase())) {
                                                            results.push(rows);
                                                            break;
                                                        }
                                                    }
                                                    else if (rows[columnFilter.ColumnName] && moment(searchText, 'MM/DD/YYYY h:mm:ss a', true).isValid()) {
                                                        let rowDate = moment(rows[columnFilter.ColumnName]).format('MM/DD/YYYY');
                                                        let enterDate = moment(searchText.toLowerCase()).format('MM/DD/YYYY');
                                                        if (rowDate.match(enterDate)) {
                                                            results.push(rows);
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        returnValue.value = results;
                                    }
                                    else {
                                        let searchDate = this.getMoment(searchText);
                                        switch (searchType) {
                                            case 'gt':
                                                searchDate.add(1, 'days');
                                                returnValue.value = returnValue.value.filter(x => x[columnFilter.columnName] > searchDate.format());
                                                break;
                                            case 'ge':
                                                searchDate.add(-1, 'days');
                                                returnValue.value = returnValue.value.filter(x => x[columnFilter.columnName] >= searchDate.format());
                                                break;
                                            case 'lt':
                                                returnValue.value = returnValue.value.filter(x => x[columnFilter.columnName] < searchDate.startOf('day').format());
                                                break;
                                            case 'le':
                                                returnValue.value = returnValue.value.filter(x => x[columnFilter.columnName] <= searchDate.startOf('day').format());
                                                break;
                                        }

                                    }
                                }
                                break;
                            case columnFilter.search.startsWith('*') && columnFilter.search.length >= 2:
                                searchText = columnFilter.search.slice(1).toLowerCase();
                                returnValue.value = returnValue.value.filter(x =>
                                    x[columnFilter.columnName].toString().toLowerCase().endsWith(searchText));
                                break;
                            case columnFilter.search.endsWith('*') && columnFilter.search.length >= 2:
                                searchText = columnFilter.search.slice(0, -1).toLowerCase();
                                returnValue.value = returnValue.value.filter(x =>
                                    x[columnFilter.columnName].toString().toLowerCase().startsWith(searchText));
                                break;
                            default:
                                returnValue.value = returnValue.value.filter((x) =>
                                    (x[columnFilter.columnName]
                                        && x[columnFilter.columnName].toString().toLowerCase().match(columnFilter.search.toLowerCase())) ?
                                        x[columnFilter.columnName].toString().toLowerCase().match(columnFilter.search.toLowerCase()).length > 0 :
                                        false
                                );
                                break;
                        }
                    }
                }
                returnValue['@odata.count'] = returnValue.value.length;
            }

            if (filterOptions.sort
                && filterOptions.sort.columnName
                && this._columns.filter(x => x.ColumnName == filterOptions.sort.columnName).length === 1) {

                let order: any;
                let isDecending: boolean; //Group columns always sort ascending

                returnValue.value.sort((a, b) => {
                    for (var column of this._columns) {
                        if ((!column.IsKeyColumn && column.IsGroupColumn) || (column.ColumnName == filterOptions.sort.columnName)) {
                            isDecending = column.IsGroupColumn ? false : filterOptions.sort.isDescending;
                            switch (column.DataType.split(':')[0]) {
                                case 'string':
                                    order =
                                        AppFunctions.compare(
                                            a[column.ColumnName].toLowerCase(),
                                            b[column.ColumnName].toLowerCase(),
                                            isDecending);
                                    break;
                                case 'datetime':
                                    order =
                                        AppFunctions.compare(
                                            a[column.ColumnName].toLowerCase(),
                                            b[column.ColumnName].toLowerCase(),
                                            isDecending);
                                    break;
                                case 'number':
                                case 'currency':
                                case 'date':
                                case 'checkmark':
                                    order =
                                        AppFunctions.compare(
                                            a[column.ColumnName],
                                            b[column.ColumnName],
                                            isDecending);
                                    break;
                            }
                            if (order != 0)
                                return order;
                        }
                    }
                    return 0;
                })
            }
        }
        catch (e)
        { }
        returnValue.allGuids = returnValue.value.map(function (v) { return v.Id });
        if (filterOptions.take == 0) {
            returnValue.value = returnValue.value.slice(filterOptions.skip, filterOptions.skip + returnValue.value.length);
        }
        else {
            returnValue.value = returnValue.value.slice(filterOptions.skip, filterOptions.skip + filterOptions.take);

        }
        return new Observable(observer => observer.next(returnValue));
    }

    private getMoment(dateString: string, useUtc: boolean = false) {
        let result = null;
        let momentFormats = ['MM/DD/YYYY', 'MM/DD/YYYY hh:mm:ss a'];
        if (useUtc) {
            result = moment.utc(dateString, momentFormats);
        }
        else {
            result = moment(dateString, momentFormats);
        }

        return result;
    }

    get columns(): Array<IColumnDefinition> { return this._columns; }
    set columns(value: Array<IColumnDefinition>) { this._columns = value; }
}