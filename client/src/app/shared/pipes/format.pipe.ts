import { Pipe, PipeTransform } from '@angular/core';
import { isNumber } from '../angular2.lang';

import { ParserHelper } from '../controls/helpers/parsers.helper';
import { AppFunctions } from '../app.functions';
import * as moment from 'moment';


@Pipe({
    name: 'format',
    pure: true
})
export class FormatPipe implements PipeTransform {

    transform(input: string, args: any): string {
        if (input != '0' && (input == null || input ==''))
            return '';

        let format = '';
        let pipeArgs = args.split(/:(.+)/, 2);  // split on first colon only
        for (let i = 0; i < pipeArgs.length; i++) {
            pipeArgs[i] = pipeArgs[i].trim(' ');
        }

        let fractionDigits = parseInt(pipeArgs[1]);
        if (isNaN(fractionDigits)) {
            fractionDigits = undefined;
        }
        switch (pipeArgs[0].toLowerCase()) {
            case 'string':
                return input;
            case 'decimal':
                return ParserHelper.formatToPercent(input, fractionDigits);
            case 'decimal2':
                return ParserHelper.formatToPercent(input, fractionDigits);
            case 'decimal3':
                return ParserHelper.formatToPercent(input, fractionDigits);
            case 'decimal4':
                return ParserHelper.formatToPercent(input, fractionDigits);
            case 'number':
                if (pipeArgs.length > 1) {
                    switch (pipeArgs[1].toLowerCase()) {
                        case "basispoints":
                            return ParserHelper.formatToBasisPoints(input);
                        case "noformat":
                            return ParserHelper.formatToIntegerWithoutFormatting(input);
                        default:
                            return ParserHelper.formatToPercent(input, fractionDigits);
                    }
                };
                return input;
            case 'currency':
                return ParserHelper.formatToCurrency(input, fractionDigits);
            case 'currency2':
                //currency format without decimal Example : Money with no decimal places,$1,234
                return ParserHelper.formatToCurrency(input,0);
            case 'currencynegative':
                return ParserHelper.formatToCurrency(input, fractionDigits);
            case 'currencynegativewithparentheses':
                return ParserHelper.formatToNegativeWithParentheses(input, fractionDigits);
            case 'percentage':
                return ParserHelper.formatToPercent(input, fractionDigits);                      
            case 'date':
                // DO include .utc() here, because we DON'T want dates localized
                // parse the date as UTC in the UTC timezone, rather than local timezone set to UTC 
                // https://github.com/moment/moment/issues/1208
                format = pipeArgs.length > 1 ? pipeArgs[1] : 'MM/DD/YYYY'; // Default Date
                return moment.utc(input, moment.ISO_8601).format(format);
            case 'time':
                // DON'T INCLUDE .utc() here, because we want all times to be localized
                format = pipeArgs.length > 1 ? pipeArgs[1] : 'h:mm A'; // Default Date + Time
                return moment(input, moment.ISO_8601).format(format);
            case 'datetime':
                // DON'T INCLUDE .utc() here, because we want all times to be localized
                format = pipeArgs.length > 1 ? pipeArgs[1] : 'MM/DD/YYYY h:mm:ss A'; // Default Date + Time
                return moment(input, moment.ISO_8601).format(format);
            case 'checkmark':
                return input ? '<i class="fa fa-check fa-lg"></i>' : ''; // input is expected to be a boolean
            case 'boolean':
                return input ? '<i class="fa fa-check fa-lg"></i>' : '<i class="fa fa-close fa-lg"></i>';
            case 'yesno':
                return (input) ? 'Yes' : 'No';
            case 'yesnoblank':
                return AppFunctions.IsNullOrWhiteSpace(input) ? '' :
                    (input.toLowerCase() == 'y' || input.toLowerCase() == 'yes' || input) ? 'Yes'
                    : 'No';
            case 'colorbox':
                return (input) ? '<span class="column-colorblock" style= "background-color:' + input + '" ></span>' + input : "";
        }

        return input;
    }
}