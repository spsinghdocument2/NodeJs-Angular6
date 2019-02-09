import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { TreeRComponent } from './bh-r-tree.component';
import {ITreeHierarchy } from '../index';

@Component({
    selector: '[bh-r-row]',
    templateUrl: 'bh-r-row.component.html'
})
export class TreeRowRComponent extends TreeRComponent {
    @Input() childRows: any[] = [];
    @Input() columns: any[];
    @Input() selectedRowsIds: string[] = [];
    @Input() iconClass: string = "fa fa-fw fa-pencil fa-lg";
    @Input() iconTooltip: string = "Edit/View Details";
    @Input() hasCheckBoxItems: boolean = true;
    @Input() isMultiSelect: boolean = false;
    //handle to hide edit button if navigation url is null
    @Input() showViewEditColumn: boolean = true;
    @Input() singleSelection: boolean = false;
    @Input() rows: any[] = [];
    @Input() hierarchyColumns: ITreeHierarchy;
    @Output() selectedRowsIdsChange = new EventEmitter();
    @Output() selectedRow = new EventEmitter();

    ngOnInit() {
        if (this.columns) {
            for (let i = 0; i < this.columns.length; i++) {
                if (this.columns[i].IsKeyColumn) {
                    this.keyColumn = this.columns[i].ColumnName;
                    break;
                }
            }
            if (this.keyColumn) {
                this.childColspan = (this.columns.length - 1) + 2;
            }
            else {
                this.childColspan = this.columns.length + 2;
            }
        }
        this.isAllowSingleSelection = this.singleSelection;
        this.treeHierarchyColumns = this.hierarchyColumns;
    }

    onSelectedRowsIdsChange(selectedRowIds: string[]) {
        if (this.isAllowSingleSelection) {
            this.selectedRowsIds = [];
        }
        if (selectedRowIds && selectedRowIds.length > 0) {
            for (let i = 0; i < selectedRowIds.length; i++) {
                if (this.selectedRowsIds.indexOf(selectedRowIds[i]) == -1) {
                    this.selectedRowsIds.push(selectedRowIds[i]);
                }
            }
        }
        this.selectedRowsIdsChange.emit(this.selectedRowsIds);
    }

    selectedRowChange(rowObject): void {
        this.selectedRowObject = rowObject;
        this.selectedRow.emit(
            rowObject
        )
    }
}

