import { Component, Input, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';

import { SimpleRComponentBase } from '../controls/helpers/simple-r-control.base';
import { ParserHelper } from '../controls/helpers/parsers.helper';
import { isFunction, isPresent } from '../angular2.lang';

@Component({
	selector: 'bh-r-parsed-input',
    templateUrl: 'bh-r-parsed-input.component.html'
})
export class ParsedInputRComponent extends SimpleRComponentBase implements OnChanges {
	internalValue: string;
    internalValueChange = new EventEmitter();
    @Input() hasButton: boolean = false;
	private internalSet: boolean = false;
	private isCurrent: boolean = true;
	private forceUpdate: boolean = false;
	private values: any = {
		currentDisplay: '',
		currentValue: null,
		newDisplay: ''
	}
	private newDisplayedValue: string = '';

	private parseDisplayFn(data) {
		if (isPresent(data) && this.bhControl.data.parseDisplayFn && isFunction(this.bhControl.data.parseDisplayFn)) {
            data = this.bhControl.data.parseDisplayFn(data, this.bhControl.data.scale != undefined ? (this.bhControl.data.scale > 20 ? 20 : this.bhControl.data.scale) : this.bhControl.data.scale );
        }
        if (this.bhControl.data.noCommas == true)
            data =  this.parseRemoveComma(data);
		return data;
	}

	private parseModelFn(data) {
		if (data && this.bhControl.data.parseModelFn && isFunction(this.bhControl.data.parseModelFn)) {
            return this.bhControl.data.parseModelFn(data, this.bhControl.data.scale != undefined ? (this.bhControl.data.scale > 20 ? 20 : this.bhControl.data.scale) : this.bhControl.data.scale );
		}

		return data;
	}
    public parseRemoveComma(value?: any): string {
        var result = '';

        if (!value) {
            return result;
        }

        var Numbers = value.replace(/,/g, '');
        return Numbers;
    }

    ngOnChanges(changes: any) {
        super.ngOnChanges(changes);        
		if (changes && changes.bhControl && changes.bhControl && changes.bhControl.currentValue && changes.bhControl.currentValue.data) {
			let configChanged = changes.bhControl.currentValue.data;
			if (configChanged.parseType) {
                switch (configChanged.parseType) {
                    case 'positive':
                        this.bhControl.data.parseDisplayFn = ParserHelper.formatToPositiveInteger;
                        this.bhControl.data.parseModelFn = ParserHelper.parsePositiveInt;
                        this.bhControl.data.alignRight = true;
                        break;
                    case 'integer':
                        this.bhControl.data.parseDisplayFn = ParserHelper.formatToInteger;
                        this.bhControl.data.parseModelFn = ParserHelper.parseInteger;
                        this.bhControl.data.alignRight = true;
                        break;
                    case 'decimal':
                        this.bhControl.data.parseDisplayFn = ParserHelper.formatToPercent;
                        this.bhControl.data.parseModelFn = ParserHelper.parseDecimal;
                        this.bhControl.data.alignRight = true;
                        break;
                    case 'decimal2':
                        this.bhControl.data.parseDisplayFn = ParserHelper.formatToPercent2Digit;
                        this.bhControl.data.parseModelFn = ParserHelper.parseDecimal;
                        this.bhControl.data.alignRight = true;
                        break;
                    case 'decimal10':
                        this.bhControl.data.parseDisplayFn = function (data) { return ParserHelper.formatToPercent(data, 10); }
                        this.bhControl.data.parseModelFn = ParserHelper.parseDecimal;
                        this.bhControl.data.alignRight = true;
                        break;
                    case 'decimal3':
                        this.bhControl.data.parseDisplayFn = ParserHelper.formatToPercent3Digit;
                        this.bhControl.data.parseModelFn = ParserHelper.parseDecimal;
                        this.bhControl.data.alignRight = true;
                        break;
                    case 'decimal4':
                        this.bhControl.data.parseDisplayFn = ParserHelper.formatToPercent4Digit;
                        this.bhControl.data.parseModelFn = ParserHelper.parseDecimal;
                        this.bhControl.data.alignRight = true;
                        break;
                    case 'currency':
                        this.bhControl.data.parseDisplayFn = ParserHelper.formatToCurrency;
                        this.bhControl.data.parseModelFn = ParserHelper.parseCurrency;
						this.bhControl.data.alignRight = true;
						this.bhControl.data.iconLeft = true;
						this.bhControl.data.iconClass = 'fa-usd';
                        break;
                    case 'currency2':
                        this.bhControl.data.parseDisplayFn = ParserHelper.formatTo0Currency;
                        this.bhControl.data.parseModelFn = ParserHelper.parseCurrency;
                        this.bhControl.data.alignRight = true;
                        this.bhControl.data.iconLeft = true;
                        this.bhControl.data.iconClass = 'fa-usd';
                        break;
                    case 'currencynegative':
                        this.bhControl.data.parseDisplayFn = ParserHelper.formatToCurrency;
                        this.bhControl.data.parseModelFn = ParserHelper.parseCurrencyWithNegative;
                        this.bhControl.data.alignRight = true;
                        this.bhControl.data.iconLeft = true;
                        this.bhControl.data.iconClass = 'fa-usd';
                        break;
                    case 'currencynegativewithparentheses':
                        this.bhControl.data.parseDisplayFn = ParserHelper.formatToNegativeWithParentheses;
                        this.bhControl.data.parseModelFn = ParserHelper.parseCurrencyWithNegative;
                        this.bhControl.data.alignRight = true;
                        this.bhControl.data.iconLeft = true;
                        this.bhControl.data.iconClass = 'fa-usd';
                        break;
					case 'percent':
                        this.bhControl.data.parseDisplayFn = ParserHelper.formatToPercent;
                        this.bhControl.data.parseModelFn = ParserHelper.parsePercent;
						this.bhControl.data.alignRight = true;
						this.bhControl.data.iconRight = true;
						this.bhControl.data.iconClass = 'fa-percent';
                        break;
                    case 'percent2':
                        this.bhControl.data.parseDisplayFn = ParserHelper.formatToPercent2Digit;
                        this.bhControl.data.parseModelFn = ParserHelper.parseDecimal;
                        this.bhControl.data.alignRight = true;
                        this.bhControl.data.iconRight = true;
                        this.bhControl.data.iconClass = 'fa-percent';
                        break;
                    case 'year':
                        this.bhControl.data.parseDisplayFn = ParserHelper.formatToIntegerWithoutFormatting;
                        this.bhControl.data.parseModelFn = ParserHelper.parseInteger;
                        this.bhControl.data.alignRight = true;
                        break;
                    case 'basispoints':
                        this.bhControl.data.parseDisplayFn = ParserHelper.formatToBasisPoints;
                        this.bhControl.data.parseModelFn = ParserHelper.formatToBasisPoints;
                        this.bhControl.data.alignRight = true;
                        break;
				}
			}
		}
		// Need to move toward only disabled, had to duplciate this code from SimpleRComponentBase.ngOnChanges because you can't call super outside of constructor
		this.bhControl.disabled = (this.bhControl.disabled || this.bhControl.readonly || (this.bhControl.data && this.bhControl.data.readonly));
	}

	onValueChanged(value) {
		let data = this.control.value;

		let result = this.parseDisplayFn(data);

		this.internalValue = result;

		// This is a hack because the parsed display hasn't changed so the control doesn't redraw
		// TODO: find a better way
		if (this.forceUpdate) {
			this.isCurrent = false;
			setTimeout(() => {
				this.isCurrent = true;
				this.forceUpdate = false;
			}, 0);
		}

		super.onValueChanged(result);
	}

	// override
	onChange(newValue: any) {
		this.values.newDisplay = newValue;

		let result = this.parseModelFn(newValue);
		if (newValue != this.internalValue && result === this.control.value) {
			// this is because the parsed value will be equal so the display will NOT update
			this.forceUpdate = true;
        }      
		this.control.patchValue(result);
        this.control.markAsDirty();
    }

    onBlur() {
        this.control.markAsTouched();
    }

}

