import { IOptionItem } from './OptionGroup';

export class BHReport implements IOptionItem {

    private _selected: boolean = false

    constructor(private _report: any) {
        this._selected = _report.IsVisible;
    }

    public ID(): string {
        return this._report.Id;
    }

    public Name(): string {
        return this._report.Name.toString();
    }

    public ReportCode(): string {
        if (this._report.ReportCode !== undefined && this._report.ReportCode !== null) {
            return this._report.ReportCode.toString();
        } else {
            return null;
        }
    }

    public Value(): any {
        return this._report.ReportCode;
    }

    public Select(select?: boolean) {
        if (select !== undefined) {
            this._selected = select;
        }
        else {
            this._selected = !this._selected;
        }
        return this._selected;
    }

    public IsSelected() {
        return this._selected;
    }

}