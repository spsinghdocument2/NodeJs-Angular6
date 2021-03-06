import { ElementRef, AfterViewInit, AfterViewChecked, DoCheck, EventEmitter, TemplateRef, IterableDiffers, Renderer } from '@angular/core';
import { DomHandler } from '../dom/domhandler';
import { ControlValueAccessor } from '@angular/forms';
export declare const AUTOCOMPLETE_VALUE_ACCESSOR: any;
export declare class AutoComplete implements AfterViewInit, DoCheck, AfterViewChecked, ControlValueAccessor {
    el: ElementRef;
    domHandler: DomHandler;
    renderer: Renderer;
    minLength: number;
    delay: number;
    style: any;
    styleClass: string;
    inputStyle: any;
    inputStyleClass: string;
    placeholder: string;
    readonly: number;
    disabled: boolean;
    maxlength: number;
    size: number;
    suggestions: any[];
    completeMethod: EventEmitter<any>;
    onSelect: EventEmitter<any>;
    onUnselect: EventEmitter<any>;
    onDropdownClick: EventEmitter<any>;
    field: string;
    scrollHeight: string;
    dropdown: boolean;
    multiple: boolean;
    itemTemplate: TemplateRef<any>;
    value: any;
    onModelChange: Function;
    onModelTouched: Function;
    timeout: any;
    differ: any;
    panel: any;
    input: any;
    multipleContainer: any;
    panelVisible: boolean;
    documentClickListener: any;
    suggestionsUpdated: boolean;
    highlightOption: any;
    highlightOptionChanged: boolean;
    focus: boolean;
    dropdownFocus: boolean;
    filled: boolean;
    constructor(el: ElementRef, domHandler: DomHandler, differs: IterableDiffers, renderer: Renderer);
    ngDoCheck(): void;
    ngAfterViewInit(): void;
    ngAfterViewChecked(): void;
    writeValue(value: any): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: Function): void;
    setDisabledState(val: boolean): void;
    onInput(event: any): void;
    search(event: any, query: string): void;
    selectItem(option: any): void;
    show(): void;
    align(): void;
    hide(): void;
    handleDropdownClick(event: any): void;
    removeItem(item: any): void;
    resolveFieldData(data: any): any;
    onKeydown(event: any): void;
    onFocus(): void;
    onBlur(): void;
    onDropdownFocus(): void;
    onDropdownBlur(): void;
    isSelected(val: any): boolean;
    findOptionIndex(option: any): number;
    updateFilledState(): void;
    ngOnDestroy(): void;
}
export declare class AutoCompleteModule {
}
