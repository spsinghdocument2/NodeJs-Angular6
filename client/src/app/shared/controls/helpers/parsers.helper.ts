import { Injectable } from '@angular/core';

@Injectable()
export class ParserHelper {

    public static parsePhone(value?: any): string {
        // if the phone isn't valid, return the string, we don't want to wipe out the user's entry, the validator should stop us here
        var result = '';

        if (!value) {
            return value;
        }
        value = value.replace('#', 'ext.'); // for Advisor values

        let splitOnExtension = value.split('ext.');

        // the phone number part
        let phone = splitOnExtension[0];

        // remove the phone number from the list
        splitOnExtension.splice(0, 1);

        splitOnExtension = splitOnExtension.filter(value => {
            return (value); // not blank
        });

        var justTheNumbersMatches = phone.match(/\d/g)
        if (!justTheNumbersMatches) {
            return value;
        }

        var justTheNumbers = justTheNumbersMatches.join('');
        let extraExtension = '';

        switch (true) {
            case (justTheNumbers.length === 7):
                result = `${justTheNumbers.substr(0, 3)}-${justTheNumbers.substr(3)}`;
                break;
            case (justTheNumbers.length < 10):
                result = `${justTheNumbers.substr(0, 3)}-${justTheNumbers.substr(3, 4)}`;
                extraExtension = justTheNumbers.substr(7);
                break;
            case (justTheNumbers.length === 10):
                result = `(${justTheNumbers.substr(0, 3)}) ${justTheNumbers.substr(3, 3)}-${justTheNumbers.substr(6)}`;
                break;
            case (justTheNumbers.length > 10):
                result = `(${justTheNumbers.substr(0, 3)}) ${justTheNumbers.substr(3, 3)}-${justTheNumbers.substr(6, 4)}`;
                extraExtension = justTheNumbers.substr(10);
                break;
            default:
                return value;
        }

        // now the extension part
        if (splitOnExtension.length > 0 || extraExtension) {
            if (extraExtension) {
                // if the phone number included extra numbers add it
                splitOnExtension.unshift(extraExtension);
            }
            let extension = splitOnExtension.join('').match(/\d/g);
            if (extension.length > 0) {
                result += ' ext. ' + extension.join('');;
            }
        }

        return result;
    }

    public static parseMaskedSSN(value?: any): string {
        var result = '';

        if (!value) {
            return result;
        }

        var justTheNumbers = value.replace(/[^\d*]/g, '');

        if (!justTheNumbers) {
            return result;
        }

        switch (true) {
            case (justTheNumbers.length === 9):
                return `${justTheNumbers.substr(0, 3)}-${justTheNumbers.substr(3, 2)}-${justTheNumbers.substr(5)}`;
            default:
                return justTheNumbers;
        }
    }

    public static parseSSN(value?: any): string {
        var result = '';

        if (!value) {
            return result;
        }

        // var justTheNumbers = value.match(/\d/g).join('');
        var justTheNumbers = value.replace(/\D/g, '');

        if (!justTheNumbers) {
            return result;
        }

        switch (true) {
            case (justTheNumbers.length === 9):
                return `${justTheNumbers.substr(0, 3)}-${justTheNumbers.substr(3, 2)}-${justTheNumbers.substr(5)}`;
            default:
                return justTheNumbers;
        }
    }

    public static parseBusinessTaxID(value?: any): string {
        var result = '';

        if (!value) {
            return result;
        }

        //var justTheNumbers = value.match(/\d/g).join('');
        var justTheNumbers = value.replace(/\D/g, '');

        if (!justTheNumbers) {
            return result;
        }

        switch (true) {
            case (justTheNumbers.length === 9):
                return `${justTheNumbers.substr(0, 2)}-${justTheNumbers.substr(2)}`;
            default:
                return justTheNumbers;
        }
    }

    public static parseCurrency(value?: any): string {
        if (!value) {
            return null;
        }
        let justTheNumbers: any;
        justTheNumbers = value.match(/[\d.]/g);
        if (!justTheNumbers) {
            return null;
        }
        else {
            justTheNumbers = value.match(/[\d.]/g).join('');
        }
        let number = parseFloat(parseFloat(justTheNumbers).toFixed(2));
        return number.toLocaleString();
    }

    public static parseCurrencyWithNegative(value?: any): string {
        if (!value) {
            return null;
        }
        let justTheNumbers: any;
        let dataAsString = value.toString();
        let isNegative = (dataAsString[0] === '-') ? -1 : 1;

        justTheNumbers = value.match(/[\d.]/g);
        if (!justTheNumbers) {
            return null;
        }
        else {
            justTheNumbers = value.match(/[\d.]/g).join('');
        }
        let number = parseFloat(parseFloat(justTheNumbers).toFixed(2)) * isNegative;
        return number.toLocaleString();
    }

    public static parseCurrencyWithNegativeAllowNA(value?: any): string {
        let result = ParserHelper.parseCurrencyWithNegative(value);
        if (result != null) {
            return result;
        }
        // not a number, test for NA
        return value == "NA" ? "NA" : null;
    }
    public static parseIntegerWithAllowNA(value?: any): string {
        let result = ParserHelper.parseInteger(value);
        if (result) {
            return result.toString();
        }
        // not a number, test for NA
        return value == "NA" ? "NA" : null;
    }
    public static parsePercent3DigitWithAllowNA(value?: any): string {
        let result = ParserHelper.formatToPercent3Digit(value);
        if (result) {
            return result.toString();
        }
        // not a number, test for NA
        return value == "NA" ? "NA" : null;
    }

    public static formatToNegativeWithParentheses(obj: any, fractionDigits: number = 2): string {
        let numberResult = ParserHelper.parseDecimal(obj);
        
        if (!numberResult && numberResult !== 0) { // falsy but not the number 0
            return '';
        }
        let dataAsString = numberResult.toString();
        let number = parseFloat(ParserHelper.parseDecimal(dataAsString).toFixed(fractionDigits));

        if (number.toString().charAt(0) == '-') {
            let parseResult = parseFloat(dataAsString.charAt(0) == '-' ?
                dataAsString.substring(1, dataAsString.length) :
                dataAsString);
            return ('(' + parseResult.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }) + ')');
        }
        else {
            return (number.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }));
        }
    }

    public static parseDecimal(obj: any): number {
        if (!obj && obj !== 0) { // falsy but not the number 0
            return null;
        }

        let dataAsString = obj.toString();
        let isNegative = (dataAsString[0] === '-') ? -1 : 1;

        if (!dataAsString.match(/[\d.]/g)) {
            return null;
        }
        let justTheNumbers = dataAsString.match(/[\d.]/g).join('');
        if (!justTheNumbers) {
            return null;
        }

        return parseFloat(justTheNumbers) * isNegative;
    }

    public static parseInteger(obj: any): number {
        let result = ParserHelper.parseWhole(obj);

        if (result == null) {
            return result;
        }

        let maxINT = 2147483647;
        // Max and Min Integer
        if (Math.abs(result) > maxINT) {
            return 0;
        }

        return result;
    }

    public static parseLong(obj: any): number {
        let result = ParserHelper.parseWhole(obj);

        if (result == null) {
            return result;
        }

        let maxLong = 9223372036854776000;
        // 9223372036854775807 is actually the largest int but parseFloat and JavaScript use 64 bit Doubles which max out at the above 
        // Max and Min Integer
        if (Math.abs(result) > maxLong) {
            return 0;
        }

        return result;
    }

    private static parseWhole(obj: any): number {
        if (!obj && obj !== 0) { // falsy but not the number 0
            return null;
        }
        let justTheNumbers: any;
        let dataAsString = obj.toString();
        justTheNumbers = dataAsString.match(/[-\d.]/g);

        if (!justTheNumbers) {
            return 0;
        } else {
            justTheNumbers = dataAsString.match(/[-\d.]/g).join('');
        }

        let result = parseFloat(parseFloat(justTheNumbers).toFixed(0)); // use parseFloat instead of parseInt because of radix

        return result;
    }

    public static parsePercent(obj: any, fractionDigits: number = 3): number {
        let val = ParserHelper.parseDecimal(obj)
        if (val)
            return parseFloat(val.toFixed(fractionDigits));
        else
            return val;
    }

    public static parsePositiveInt(obj: any): number {
        if (ParserHelper.parseInteger(obj) == obj) {
            if (Math.abs(obj) === parseInt(obj) && parseInt(obj) > 0) {
                return obj;
            }
            return 1;
        }
        return 1;
    }

    public static formatToCurrency(obj: any, fractionDigits: number = 2): string {
        let numberResult = ParserHelper.parseDecimal(obj);

        if (!numberResult && numberResult !== 0) { // falsy but not the number 0
            return '';
        }

        let number = parseFloat(numberResult.toFixed(fractionDigits));
        return number.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits });
    }

    public static formatTo0Currency(obj: any, fractionDigits: number = 0): string {
        let numberResult = ParserHelper.parseDecimal(obj);

        if (!numberResult && numberResult !== 0) { // falsy but not the number 0
            return '';
        }

        let number = parseFloat(numberResult.toFixed(fractionDigits));
        return number.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits });
    }

    public static formatToPercent(obj: any, fractionDigits: number = 3): string {
        let numberResult = ParserHelper.parseDecimal(obj);

        if (!numberResult && numberResult !== 0) { // falsy but not the number 0
            return '';
        }

        let number = parseFloat(numberResult.toFixed(fractionDigits));
        return number.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits });
    }
    public static formatToPercent2Digit(obj: any, fractionDigits: number = 2): string {
        let numberResult = ParserHelper.parseDecimal(obj);

        if (!numberResult && numberResult !== 0) { // falsy but not the number 0
            return '';
        }
        return numberResult.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits });
    }
    public static formatToPercent3Digit(obj: any, fractionDigits: number = 3): string {
        let numberResult = ParserHelper.parseDecimal(obj);

        if (!numberResult && numberResult !== 0) { // falsy but not the number 0
            return '';
        }
        return numberResult.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits });
    }
    public static formatToPercent4Digit(obj: any, fractionDigits: number = 4): string {
        let numberResult = ParserHelper.parseDecimal(obj);

        if (!numberResult && numberResult !== 0) { // falsy but not the number 0
            return '';
        }
        return numberResult.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits });
    }
    public static formatToInteger(obj: any): string {
        let numberResult = ParserHelper.parseInteger(obj);

        if (!numberResult && numberResult !== 0) { // falsy but not the number 0
            return '';
        }

        return numberResult.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    public static formatToPositiveInteger(obj: any): string {
        let numberResult = ParserHelper.parsePositiveInt(obj);

        if (!numberResult && numberResult !== 0) { // falsy but not the number 0
            return '';
        }

        return numberResult.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    public static formatToLong(obj: any): string {
        let numberResult = ParserHelper.parseLong(obj);

        if (!numberResult && numberResult !== 0) { // falsy but not the number 0
            return '';
        }

        return numberResult.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    public static formatToIntegerWithoutFormatting(obj: any): string {
        let numberResult = ParserHelper.parseInteger(obj);

        if (!numberResult && numberResult !== 0) { // falsy but not the number 0
            return '';
        }

        return numberResult.toString();
    }

    public static formatToBasisPoints(obj: any): string {
        let numberResult = ParserHelper.parseDecimal(obj);

        if (!numberResult && numberResult !== 0) { // falsy but not the number 0
            return '';
        }

        numberResult *= 100;  // convert to basis points (1/100 of a percent)

        return numberResult.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    public static checkSpecialCharacter(value?: any): string {
        var alphanumers = /^[a-zA-Z0-9]+$/;
        if (value != null && value != undefined) {
            value = value.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
            if (!alphanumers.test(value)) {
                return value.replace(/[^\w\s]/gi, '');
            }
        }
        return value;
    }
    public static parseEmail(value?: any): string {
        var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
        if (value != null && value != undefined) {
            if (!emailRegex.test(value)) {
                return '';
            }
        }
        return value;
    }

    public static formatToUpperCase(value?: any): string {
        return value.toUpperCase();
    }
    public static parseAlphaNumericValue(value?: any): string {
        var alphanumers = /^[a-zA-Z0-9]+$/;
        if (value != null && value != undefined) {
            value = value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
            if (!alphanumers.test(value)) {
                return value.replace(/[^\w\s]/gi, '');
            }
        }
        return value;
    }

    public static parseAlphaNumericValueWithComma(value?: any): string {
        var alphanumers = /^[a-zA-Z0-9,]+$/;
        if (value != null && value != undefined) {
            value = value.replace(/[`~!@#$%^&*()_|+\-=?;:'".<>\{\}\[\]\\\/]/gi, '');
            if (!alphanumers.test(value)) {
                return value.replace(/[^\w\s]/gi, '');
            }
        }
        return value;
    }
}