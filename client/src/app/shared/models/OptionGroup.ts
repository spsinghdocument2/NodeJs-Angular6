export interface IOptionItem {
    ID(): string;
    Name(): string;
    ReportCode(): string;
    Value(): any;
    Select(select?: boolean): boolean;
    IsSelected(): boolean;
}

export class OptionItem implements IOptionItem {
    constructor(
        private _ID: string,
        private _optionName: string,
        private _optionReportCode: string,
        private _optionValue: any,
        private _isVisible: boolean,
        private _selected: boolean = false) {
    }

    public IsVisible(): boolean {
        return this._isVisible;
    }
    public ID(): string {
        return this._ID;
    }

    public Name(): string {
        return this._optionName;
    }

    public ReportCode(): string {
        return this._optionReportCode;
    }

    public Value(): any {
        return this._optionValue;
    }

    public Select(select?: boolean): boolean {
        if (select !== undefined) {
            this._selected = select;
        }
        else {
            this._selected = !this._selected;
        }
        return this._selected;
    }

    public IsSelected(): boolean {
        return this._selected;
    }
}

export class OptionGroup {
    constructor(private _groupName: string, private _options: IOptionItem[]) {
    }

    public Name(): string {
        return this._groupName;
    }

    public SelectOption(optionID: string) {
        var option: IOptionItem = this._options.find(o => o.ID() === optionID);
        if (option) {
            option.Select();
        }
    }

    public AllSelected(): boolean {
        return this._options.every(o => o.IsSelected());
    }

    public NoneSelected(): boolean {
        return this._options.every(o => !o.IsSelected());
    }

    public ClearOptionList() {
        this._options.length = 0;
    }

    public AddOptionList(options: IOptionItem[]) {
        this.ClearOptionList();
        this._options = options;
    }

    public SetOptionList(options: IOptionItem[]) {
        this._options = options;
    }

    public Select(on: boolean) {
        this._options.forEach(o => o.Select(on));
    }

    public getAvailableOptions() {
        return this._options || [];
    }

    public getSelectedValues(): string[] {
        let values: string[] = [];
        let selectedOptions: IOptionItem[] = this._options.filter(o => o.IsSelected());
        selectedOptions.forEach(o => values.push(o.Value()));
        return values;
    }

    public IsSelectedByName(name: string) {
        let option = this._options.find(o => o.IsSelected() && o.Name() == name);
        return option != null;
    }

    public getSelectedIds(): string[] {
        let ids: string[] = [];
        let selectedOptions: IOptionItem[] = this._options.filter(o => o.IsSelected());
        selectedOptions.forEach(o => ids.push(o.ID()));
        return ids;
    }

    public getSelectedOptions(): IOptionItem[] {
        let selectedOptions: IOptionItem[] = this._options.filter(o => o.IsSelected());
        return selectedOptions || [];
    }

    public getAllOptions(): IOptionItem[] {
        let selectedOptions: IOptionItem[] = this._options;
        return selectedOptions || [];
    }
   
    public LastSelectedPeriods(previousSelectedIds: string[]) {
         // reset all options to false, so we can set only those selected to true later.
        this._options.forEach(p => {
            p.Select(false);
        });
        previousSelectedIds.forEach(id => {
            var option: IOptionItem = this._options.find(o => o.ID() === id);
            if (option) {
                option.Select(true);
            }
        });
    }

}