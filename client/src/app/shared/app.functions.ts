import { Injectable } from '@angular/core';
import { ITreeHierarchy } from './services/pageable-table-service.interface';
import * as moment from 'moment'; 
@Injectable()
export class AppFunctions {
    /*
    arrayIntersect takes 2 arrays, the properties to match on and returns the objects in the first array that match

    example: this.appFunctions.arrayIntersect(this.optionList, x => x.Id, array2, x => x );

    this compares each object in optionList to each object in array 2;

    optionList = [
        { Id: '1', Label: 'BMW' },
        { Id: '2', Label: 'Audi' },
        { Id: '3', Label: 'Mercedes' }
    ];

    array2 = [
        '2'
    ]

    returns [
        { Id: '2', Label: 'Audi' }
    ]

    this is done through a very fast flattening of optionList to:
    o = {
        '1': true,
        '2': true,
        '3': true
    }

    then it compares array2 to the properties in o.

    arrayExclude is all of the elements in the first array that are not in the second

    NOTE : https://en.wikipedia.org/wiki/Set_(mathematics)
*/
    public static arrayIntersect(
        arr1: Array<any>,
        propertyToCompare1: Function,
        arr2: Array<any>,
        propertyToCompare2: Function
    ): Array<any> {
        return AppFunctions.arrayIntersectOrExclude(arr1, propertyToCompare1, arr2, propertyToCompare2, true);
    }

    public static arrayExclude(
        arr1: Array<any>,
        propertyToCompare1: Function,
        arr2: Array<any>,
        propertyToCompare2: Function
    ): Array<any> {
        return AppFunctions.arrayIntersectOrExclude(arr1, propertyToCompare1, arr2, propertyToCompare2, false);
    }

    private static arrayIntersectOrExclude(
        arr1: Array<any>,
        propertyToCompare1: Function,
        arr2: Array<any>,
        propertyToCompare2: Function,
        intersect: boolean
    ): Array<any> {
        var r = [], o = {}, l = arr2.length, i, v;
        for (i = 0; i < l; i++) {
            // this sets a hash value on a single object (o) for property propertyToCompare1 to true
            if (propertyToCompare2) {
                o[propertyToCompare2(arr2[i])] = true;
            } else {
                o[arr2[i]] = true;
            }
        }
        l = arr1.length;
        for (i = 0; i < l; i++) {
            if (propertyToCompare1) {
                v = propertyToCompare1(arr1[i]);
            } else {
                v = arr1[i];
            }

            if (intersect) {
                if (v in o) {
                    r.push(arr1[i]);
                }
            } else {
                if (v in o) {
                    // leave out
                } else {
                    r.push(arr1[i]);
                }
            }
        }
        return r;
    }

    public static arrayCompare(array1: Array<any>, array2: Array<any>): boolean {
        let array1ExistsAndHasElements: boolean = ((array1 instanceof Array) && (array1.length > 0));
        let array2ExistsAndHasElements: boolean = ((array2 instanceof Array) && (array2.length > 0));

        // if neither array exists or has elements, return true
        if (!array1ExistsAndHasElements && !array2ExistsAndHasElements) {
            return true;
        }

        // if only one array does not exist or has no elements, return false
        if (array1ExistsAndHasElements != array2ExistsAndHasElements) {
            return false;
        }

        // if lengths are different, return false
        if (array1.length != array2.length) {
            return false;
        }

        for (let i = 0, l = array1.length; i < l; i++) {
            if (array1[i] != array2[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }

        return true;
    }

    public static deepClone(objectToClone: any): any {
        // this might be slow with large arrays and doesn't preserve functions
        return JSON.parse(JSON.stringify(objectToClone));
    }

    public static copyPropertiesAndSeal(source: any, fromObject: any) {
        // seal the object so no new properties can be added, NOTE: there is no unseal
        Object.seal(source);
        Object.assign(source, fromObject);
    }

	/*
		stringReplaceAll() takes an input string and replaces all instances of searchValue with the string replaceValue.

		The built-in JavaScript string.replace(string, string) function only replaces the first instance of the search
		value whereas this function calls string.replace(RegExp, string) to replace all instances.
		This function is case sensitive.
	*/
    public static stringReplaceAll(input: string, searchValue: string, replaceValue: string): string {
        return input.replace(new RegExp(searchValue, 'g'), replaceValue);
    }

    public static arrayRemoveWhere(arr: Array<any>, propertyToCompare: Function): Array<any> {
        //find the element that satifies the function passed

        return arr.filter(element => !propertyToCompare(element));

    }

    public static getFullName(firstName: string, lastName: string): string {
        var retVal: string = '';
        if (firstName) {
            retVal = firstName;
        }

        if (lastName) {
            if (lastName.trim() != '') {
                if (retVal) {
                    retVal = retVal + ' '
                }
                retVal = retVal + lastName;
            }
        }

        return retVal.trim();
    }
    public static getFullNameWithPrefixAndSuffix(namePrefix: string, firstName: string, middleName: string, lastName: string, nameSuffix: string): string {
        var retVal: string = '';
        if (lastName != null && lastName != '' && lastName != 'null' && lastName != 'undefined') {
            retVal = lastName.trim();
        }
        if (nameSuffix != null && nameSuffix != '' && nameSuffix != 'null' && nameSuffix != 'undefined') {
            if (retVal != '') {
                retVal += ' ' + nameSuffix.trim();
            }
            else {
                retVal = nameSuffix.trim();
            }
        }
        if (firstName != null && firstName != '' && firstName != 'null' && firstName != 'undefined') {
            if (retVal != '') {
                retVal += ' ' + firstName.trim();
            }
            else {
                retVal = firstName.trim();
            }
        }
        if (middleName != null && middleName != '' && middleName != 'null' && middleName != 'undefined') {
            if (retVal != '') {
                retVal += ' ' + middleName.substring(0, 1).trim() + '.';
            }
            else {
                retVal = middleName.substring(0, 1).trim() + '.';
            }
        }
        return retVal.trim();
    }

    public static parseDate(dateString: string) {
        return this.getMoment(dateString, true);
    }

    public static parseDateTime(dateString: string) {
        return this.getMoment(dateString, false);
    }

    /// moments are created using the local timezone, which we want to keep usually.  
    /// useUtc allows for a different parsing if required.
    public static getMoment(dateString: string, useUtc: boolean = false) {
        let result = null;
        //https://github.com/moment/moment/issues/2554
        // one M/D/Y accepts more than one digit, but MM/DD/YYYY doesn't accept one digit.
        // valid are: 
        // dates without time
        // dates with hours and minutes
        // dates with hours, minutes AM/PM
        // dates with hours, minutes, second
        // dates with hours, minutes, seconds and AM/PM
        let momentFormats = [
            'M/D/YYYY h:m:s a', 'M/D/YY h:m:s a',
            'M/D/YYYY h:m:s', 'M/D/YY h:m:s',
            'M/D/YYYY h:m a', 'M/D/YY h:m a',
            'M/D/YYYY h:m', 'M/D/YY h:m',
            'M/D/YYYY', 'M/D/YY',
            'M/D/YYYY HH:mm', 'M/D/YYYY HH:mm',
            moment.ISO_8601
        ];
        if (useUtc) {
            result = moment.utc(dateString, momentFormats, true);
        }
        else {
            result = moment(dateString, momentFormats, true);
        }

        return result;
    }

    public static getDaysDifference(firstDate: string | Date, secondDate: string | Date): string {
        if (!firstDate || !secondDate) {
            return '';
        }
        return moment(secondDate).startOf('day').from(moment(firstDate).startOf('day'));
    }

    public static getDaysFromNow(date: string | Date): string {
        if (!date) {
            return '';
        }
        let dateAsMoment = moment(date).startOf('day');
        // For substracting in one day
        let today = moment().startOf('day').subtract(1, "days");
        let numberOfDays = today.diff(dateAsMoment, 'days');
        if (numberOfDays+1  < 0) {
            return '';
        }
        if (dateAsMoment.isSame(moment().startOf('day'), 'day')) {
            return 'today (0 days)';
        }
        return `${dateAsMoment.from(today)} (${numberOfDays} days)`;
    }

    public static validNumber(value: string | number) {
        if (value == null || (typeof value == 'string' && value == '')) {
            return null;
        }

        let result = null;
        let dataAsString = value.toString();
        let isNegative = (dataAsString[0] === '-') ? -1 : 1;
        if (value) {
            value = value.toString().replace(/\,/g, '');
        }
        else {
            value = value.toString();
        }

        var justTheNumbersMatches = value.match(/\d+(.\d+)?/g)
        if (!justTheNumbersMatches) {
            return null;
        }

        var justTheNumbers = justTheNumbersMatches.join('');

        return parseFloat(justTheNumbers) * isNegative;

    }
    // TODO: When needed we will allow an option to include navigation properties
    public static modelParser(loadedModel: any, updatedModel: any, modelProperties: any): any {
        let propName;
        let result: any = {};
        let modelChanged = false;
        for (propName in modelProperties.properties) {
            let propertySpec = modelProperties.properties[propName];
            if (propName in loadedModel) {
                let loadedProperty = loadedModel[propName];
                let updatedProperty = updatedModel[propName];
                // only 2 properties get preserved if not updated
                if (loadedProperty && (propName === 'Id' || propName === 'TimeStamp')) {
                    result[propName] = loadedProperty;
                } else {
                    if (updatedProperty !== undefined) {
                        let addPropertyValue = undefined;
                        switch (propertySpec.type) {
                            case "BakerHill.Models.Admin.MergeClients.MergeType":
                            case "Edm.String":
                            case "Edm.Boolean":
                            case "Edm.DateTimeOffset":
                                if (loadedProperty != updatedProperty) {
                                    addPropertyValue = updatedProperty;
                                };
                                break;
                            case "Edm.Guid":
                                // first true condition
                                switch (true) {
                                    // going from a guid to an empty or null 
                                    case (loadedProperty && !updatedProperty):
                                        addPropertyValue = null;
                                        break;
                                    // going from empty to guid, or changed
                                    case (!loadedProperty && updatedProperty):
                                    case (loadedProperty != updatedProperty):
                                        addPropertyValue = updatedProperty;
                                        break;
                                }
                                break;
                            case "Edm.Decimal":
                            case "Edm.Double":
                            case "Edm.Int32":
                                let loadedNumber = this.validNumber(loadedProperty);
                                let updatedNumber = this.validNumber(updatedProperty);
                                if (loadedNumber != updatedNumber) {
                                    addPropertyValue = updatedNumber;
                                };
                                break;
                            case "Edm.Binary":
                                // this is here to ignore it! use a string, example DocumentUploaded.DocumentAsString
                                break;
                            case "Collection(Edm.String)":
                            case "Collection(Edm.Guid)":
                                if (!this.arrayCompare(loadedProperty, updatedProperty)) {
                                    addPropertyValue = updatedProperty;
                                };
                                break;
                            default:
                                throw Error('Property Type hasn\'t been handled in modelParser : ' + propertySpec.type);
                        }
                        if (addPropertyValue !== undefined) {
                            result[propName] = addPropertyValue;
                            modelChanged = true;
                        }
                    }
                }
            }
        }

        if (!modelChanged) {
            result = null; // No changes
        }
        return result;
    }

    public static isUpdated(beforeModel: any, updatedModel: any, modelProperties: any): boolean {
        let propName;
        let modelChanged = false;

        for (propName in modelProperties.properties) {
            let propertySpec = modelProperties.properties[propName];
            if (propName in beforeModel) {

                if (propName == "CreatedDate" || propName == "TimeStamp")
                    continue; 

                let loadedProperty = beforeModel[propName];
                let updatedProperty = updatedModel[propName];

                //if we couldn't locate the property on the updated model, there's no change to report
                if (updatedProperty === undefined)
                    continue; 

                //If both are null or empty, nothing to compare, move along.
                if (this.IsNullOrWhiteSpace(loadedProperty) && this.IsNullOrWhiteSpace(updatedProperty)) {
                    continue;
                }

                if (loadedProperty != updatedProperty) {
                    return true;
                };
            }
        }
        return false;
    }

    public static IsNullOrWhiteSpace(value: string)
    {
        return (value == null || value === undefined || value.toString().trim() == "");
    }

    public static regularExpressionMatched(value: any, regExName: string): boolean {

        switch (regExName.toLowerCase()) {
            case 'phone':
                return /^(\(?\d\d\d\)?)?( |-|\.)?\d\d\d( |-|\.)?\d{4,4}(( |-|\.)?[ext\.]+ ?\d+)?$/i.test(value);
            case 'email':
                return /^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)?$/i.test(value);

            case 'url':
				/* matches against any characters then . then any characters
					Min length 3 characters, max 2,000 (might be limited to SQL column length) 
					matches:
						www.blah.com
						blah.com
						www.mysite.com/testing
					does not match
						www.
						.blah
				*/

                return /^(?=.{3,2000}$).+\..+/i.test(value);
            default:
                throw Error('regExName is invalid');
        }
    }

    public static compare(a: any, b: any, descending: boolean = false): number {
        let ordering = 1;
        if (descending)
            ordering = -1;
        if (a > b) return (ordering * (+1));
        if (a < b) return (ordering * (-1));
        return 0;
    }

    public static traverseModelForProperty(model: any, property: string): any {
        if (property.indexOf('.') >= 0) {
            console.log(`OBSOLETE: Please replace ${property} with ${property.replace('.', '/')}`);
        }
        property = property.replace('.', '/'); // the old way was a period.
        if (property.includes('/')) {
            let currentObject = model;
            let listOfNavs = property.split('/');
            for (var _i = 0; _i < listOfNavs.length; _i++) {
                let property = listOfNavs[_i];
                if (!(property in currentObject)) {
                    let toString = Object.prototype.toString;
                    let message = 'traverseModelForProperty: ' + toString.call(model) + ' doesn\'t have a property named ' + property;

                    throw new TypeError(message);
                }
                // is this the last one
                if (_i == listOfNavs.length - 1) {
                    return currentObject[property];
                } else {
                    currentObject = currentObject[property];
                    if (!currentObject) {
                        return null;
                    }
                }
            }

        } else {
            if (!(property in model)) {
                let toString = Object.prototype.toString;
                let message = 'traverseModelForProperty: ' + toString.call(model) + ' doesn\'t have a property named ' + property;

                throw new TypeError(message);
            }

            return model[property];
        }
    }    

    public static stringReplace(originalString: string, from: number, to: number, replaceWith: string): string {
        let response = '';
        if (!originalString) {
            return originalString;
        }
        if (from > originalString.length - 1 || to < from || to > originalString.length - 1) {
            throw Error('Problem in stringReplace');
        }

        response = originalString.slice(0, from);
        response += replaceWith;
        response += originalString.slice(to + 1);

        return response;
    }


    public static JSONToTxtConvertorForLookUp(JSONData, fileName, ShowLabel, columns, delimiter) {
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
        var TXT = '';
        if (ShowLabel) {
            var row = "";
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].ColumnName.toUpperCase() !== "ID" && columns[i].DisplayText.toUpperCase() !== "ID") {
                    row += '"' + columns[i].DisplayText + '"' + delimiter; //columns[i].DisplayText.replace(/\s+/g, '').replace(/\?/g, '')
                }
            }
            row = row.slice(0, -1);
            //append Label row with line break
            TXT += row + '\r\n';
        }
        //1st loop is to extract each row
        if (arrData.length > 0) {
            for (var i = 0; i < arrData.length; i++) {
                var row = "";
                //2nd loop will extract each column and convert it in string comma-seprated
                for (var j = 0; j < columns.length; j++) {
                    if (columns[j].ColumnName.toUpperCase() !== "ID" && columns[j].DisplayText.toUpperCase() !== "ID") {
                        var format = 'MM/DD/YYYY';
                        var fieldValue = AppFunctions.traverseModelForProperty(arrData[i], columns[j].ColumnName);
                        if (columns[j].ColumnType == 'date' && fieldValue !== null && fieldValue != '') {
                            format = 'MM/DD/YYYY';
                            fieldValue = moment.utc(fieldValue, moment.ISO_8601).local().format();
                            row += '"' + (fieldValue === null ? "" : fieldValue) + '"' + delimiter;
                        }
                        else if (columns[j].ColumnType == 'time' && fieldValue !== null && fieldValue != '') {
                            format = 'h:mm A';
                            fieldValue = moment.utc(fieldValue, moment.ISO_8601).format(format);
                            row += '"' + (fieldValue === null ? "" : fieldValue) + '"' + delimiter;
                        }
                        else if (columns[j].ColumnType == 'datetime' && fieldValue !== null && fieldValue != '') {
                            format = 'MM/DD/YYYY h:mm:ss A';
                            fieldValue = moment.utc(fieldValue, moment.ISO_8601).format(format);
                            row += '"' + (fieldValue === null ? "" : fieldValue) + '"' + delimiter;
                        } 
                        else if (['checkmark', 'boolean', 'number', 'integer', 'numeric', 'small int'].includes(columns[j].ColumnType)) {
                            row += '"' + (fieldValue === null ? "<NULL>" : fieldValue) + '"' + delimiter;
                        }
                        else if (columns[j].ColumnType == 'currency' || columns[j].ColumnType == 'currencynegative' || columns[j].ColumnType == 'money') {
                            row += '"' + ((fieldValue === null || fieldValue === '') ? "<NULL>" : (fieldValue)) + '"' + delimiter;
                        }
                        else if (columns[j].ColumnType == 'percentage') {
                            row += '"' + ((fieldValue === null || fieldValue === '') ? "<NULL>" : (fieldValue + '%')) + '"' + delimiter;
                        }
                        else {
                            var regex = /(<([^>]+)>)/ig
                            row += '"' + (fieldValue === null ? "<NULL>" : (fieldValue != '' ? fieldValue.replace(/"/g, '""').replace(regex, "") : '')) + '"' + delimiter;
                        }
                    }
                }
                row = row.slice(0, row.length - 1);
                //add a line break after each row
                TXT += row + '\r\n';
            }
        }
        else {
            TXT += "No results found \r\n";
        }
        if (TXT == '') {
            alert("Invalid data");
            return;
        }
        var blob = new Blob([TXT], { type: 'data:text/csv;charset=utf-8,' });
        if (navigator.msSaveBlob) { // IE 10+
            if (fileName) {
                fileName = fileName + ".txt";
            }
            else {
                fileName = "SectionList.txt";
            }
            navigator.msSaveBlob(blob, fileName);
        } else {
            var link = document.createElement("a");
            if (fileName) {
                link.download = fileName + ".txt";
            }
            else {
                link.download = "SectionList.txt";
            }
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                document.body.appendChild(link);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    public static JSONToCSVConvertor(JSONData, fileName, ShowLabel, columns) {
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
        var CSV = '';
        if (ShowLabel) {
            var row = "";
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].ColumnName.toUpperCase() !== "ID" && columns[i].DisplayText.toUpperCase() !== "ID") {
                    row += '"' + columns[i].DisplayText + '"' + ','; //columns[i].DisplayText.replace(/\s+/g, '').replace(/\?/g, '')
                }
            }
            row = row.slice(0, -1);
            //append Label row with line break
            CSV += row + '\r\n';
        }
        //1st loop is to extract each row
        if (arrData.length > 0) {
            for (var i = 0; i < arrData.length; i++) {
                var row = "";
                //2nd loop will extract each column and convert it in string comma-seprated
                for (var j = 0; j < columns.length; j++) {
                    if (columns[j].ColumnName.toUpperCase() !== "ID" && columns[j].DisplayText.toUpperCase() !== "ID") {
                        var format = 'MM/DD/YYYY';
                        var fieldValue = AppFunctions.traverseModelForProperty(arrData[i], columns[j].ColumnName);
                        if (columns[j].DataType == 'date' && fieldValue !== null && fieldValue != '') {
                            format = 'MM/DD/YYYY';
                            fieldValue = moment(fieldValue, moment.ISO_8601).utc().format(format);
                        }
                        else if (columns[j].DataType == 'time' && fieldValue !== null && fieldValue != '') {
                            format = 'h:mm A';
                            fieldValue = moment(fieldValue, moment.ISO_8601).format(format);
                        }
                        else if (columns[j].DataType == 'datetime' && fieldValue !== null && fieldValue != '') {
                            format = 'MM/DD/YYYY h:mm:ss A';
                            fieldValue = moment(fieldValue, moment.ISO_8601).format(format);
                        }
                        if (['checkmark', 'boolean', 'number'].includes(columns[j].DataType)) {
                            row += '"' + (fieldValue === null ? "" : fieldValue) + '",';
                        }
                        else if (columns[j].DataType == 'currency' || columns[j].DataType == 'currencynegative') {
                            row += '"' + ((fieldValue === null || fieldValue === '') ? "" : ('$' + fieldValue)) + '",';
                        }
                        else if (columns[j].DataType == 'percentage') {
                            row += '"' + ((fieldValue === null || fieldValue === '') ? "" : (fieldValue + '%')) + '",';
                        }
                        else {
                            var regex = /(<([^>]+)>)/ig
                            row += '"' + (fieldValue === null ? "" : (fieldValue != '' ? fieldValue.replace(/"/g, '""').replace(regex, "") : '')) + '",';
                        }
                    }
                }
                row.slice(0, row.length - 1);
                //add a line break after each row
                CSV += row + '\r\n';
            }
        }
        else {
            CSV += "No results found \r\n";
        }
        if (CSV == '') {
            alert("Invalid data");
            return;
        }
        var blob = new Blob([CSV], { type: 'data:text/csv;charset=utf-8,' });
        if (navigator.msSaveBlob) { // IE 10+
            if (fileName) {
                fileName = fileName + ".csv";
            }
            else {
                fileName = "SectionList.csv";
            }
            navigator.msSaveBlob(blob, fileName);
        } else {
            var link = document.createElement("a");
            if (fileName) {
                link.download = fileName + ".csv";
            }
            else {
                link.download = "SectionList.csv";
            }
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                document.body.appendChild(link);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    public static getRandomNumber() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    public static getGuid(): string {
        let guid = (this.getRandomNumber() + this.getRandomNumber() + "-" + this.getRandomNumber() + "-4" + this.getRandomNumber().substr(0, 3) + "-" + this.getRandomNumber()
            + "-" + this.getRandomNumber() + this.getRandomNumber() + this.getRandomNumber()).toLowerCase();
        return guid;
    }

    public static bankersRounding(value: number, precision: number = 0) {
        // Note: there is a unit test that checks this code.  if any changes
        // are made to this function the unit tests will need to be looked at.

        // 1. Multiple the number times the powere of 10 to the precision so the number can be rounded
        // 2. Round the number

        let numberForRounding = value * Math.pow(10, precision);
        let roundedNumber = Math.round(numberForRounding);

        // 3. Perform bankers rounding logic (determine the nearest even number)
        // make the number for rounding positive if it is a negative number
        // so we can check for 0.5
        let positiveNumberForRounding = (numberForRounding > 0) ? numberForRounding : (-numberForRounding);

        // check to see if there is a .5 exactly on the number for rounding
        let needsZeroPointFiveCalculation = (positiveNumberForRounding % 1 === 0.5) ? true : false;

        // if bankers rounding is needed check to see if the rounded number has a remainder
        // and if so subtract one otherwise the rounding is handled
        let bankersRoundedNumber = 0;
        if (needsZeroPointFiveCalculation) {
            if (roundedNumber % 2 === 0) {
                bankersRoundedNumber = roundedNumber;
            }
            else {
                bankersRoundedNumber = roundedNumber - 1;
            }
        }
        else {
            bankersRoundedNumber = roundedNumber;
        }

        // 4. Reduce the number the number back to the precision so that it will have the proper decimal places
        let retVal = bankersRoundedNumber / Math.pow(10, precision);

        return retVal;
    }

    //function to populate recurssive tree hierarchical data..
    public static parseIntoTreeHierarchy(rawData: any, treeHierarchy: ITreeHierarchy, isAllExpandCollapse: boolean, parent: any = undefined, tree: any = undefined): any {
        var defaultParentObject = {};
        defaultParentObject[treeHierarchy.KeyColumn] = null;
        tree = typeof tree !== 'undefined' ? tree : [];
        parent = typeof parent !== 'undefined' ? parent : defaultParentObject;
        var children = rawData.filter(function (child) { return child[treeHierarchy.ParentColumn] == parent[treeHierarchy.KeyColumn]; });
        if (children.length > 0) {
            if (parent[treeHierarchy.KeyColumn] == null) {
                tree = children;
            } else {
                parent['children'] = children;
                parent['showChildren'] = isAllExpandCollapse;
            }
            children.forEach(function (child) {
                // recurssive call for each parent that have children
                AppFunctions.parseIntoTreeHierarchy(rawData, treeHierarchy, isAllExpandCollapse, child, tree);
            });
        }
        return tree;
    }

    public static setExpandCollapseAll(data: any, isExpandAll: boolean): any {
        data.forEach(function (child) {
            // recurssive call for each parent that have children and set showChildren is true or false
            if (child.children && child.children.length > 0) {
                child['showChildren'] = isExpandAll;
                AppFunctions.setExpandCollapseAll(child.children, isExpandAll);
            }
        });
        return data;
    }
    public static setUncheck(data: any, selectedRowsIds: any[], treeHierarchy: ITreeHierarchy): any {
        data.forEach(function (child) {
            for (let checkedRowId of selectedRowsIds) {
                if (child[treeHierarchy.KeyColumn] == checkedRowId) {
                    child.isChecked = false;
                }
            }
            if (child.children && child.children.length > 0) {
                AppFunctions.setUncheck(child.children, selectedRowsIds, treeHierarchy);
            }
        });
        return data;
    }


    public static arrayIntersectRecurssive(
        arr1: Array<any>,
        propertyToCompare1: Function,
        arr2: Array<any>,
        propertyToCompare2: Function,
        arr3: Array<any>
    ): Array<any> {
        var r = [], o = {}, l = arr2.length, i, v;
        for (i = 0; i < l; i++) {
            // this sets a hash value on a single object (o) for property propertyToCompare1 to true
            if (propertyToCompare2 != undefined && propertyToCompare2 != null) {
                o[propertyToCompare2(arr2[i])] = true;
            } else {
                o[arr2[i]] = true;
            }
        }
        l = arr1.length;
        for (i = 0; i < l; i++) {
            if (propertyToCompare1 != undefined && propertyToCompare1 != null) {
                v = propertyToCompare1(arr1[i]);
            } else {
                v = arr1[i];
            }
            if (v in o) {
                arr3.push(arr1[i]);
            }
            if (arr1[i].children) {
                AppFunctions.arrayIntersectRecurssive(arr1[i].children, propertyToCompare1, arr2, propertyToCompare2, arr3);
            }
        }
        return arr3;
    }

    // Function will change date mmddyy ,mmddyyyy into mm/dd/yyyy
    public static changeDateFormat(date: any): any {                      
        let splitDate = '';  
        date = date.replace(/\s+/g, "");
        if (!date.match(/^\d+$/)) {
            return '';            
        }
        if (date.length == 6) {
            splitDate = date.split('');
            date = `${splitDate[0]}${splitDate[1]}/${splitDate[2]}${splitDate[3]}/${splitDate[4]}${splitDate[5]}`;
        } else if (date.length == 8) {
            splitDate = date.split('');
            date = `${splitDate[0]}${splitDate[1]}/${splitDate[2]}${splitDate[3]}/${splitDate[4]}${splitDate[5]}${splitDate[6]}${splitDate[7]}`;
        } else {
            date = '';
        }

        let momentObject = moment().local();
        momentObject = moment.utc(date);
        if (momentObject.isValid()) {
            if (date.length < 9) {
                if (momentObject.year() <= 1950) {
                    momentObject.add(100, 'year');
                }
            
            }
            if (momentObject.year().toString().length === 4) {
                if (momentObject.year() > 1950) {
                    date = momentObject.toISOString();
                }
            }
        }
        if (!date)
            date = '';
        return date;
            
    }

    public static refactorTreeHierarchicalData(data: any): any {
        data.forEach(function (child) {
            // recurssive call for each parent that have children and push it into an array
            if (child.r !== undefined && child.r.length === undefined) {
                child.r = [child.r];
            }
            if (child.r !== undefined && child.r.length > 0) {
                AppFunctions.refactorTreeHierarchicalData(child.r);
            }
        });
        return data;
    }
    

}

