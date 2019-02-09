export interface ISectionListActionListProvider {
    actions: any[];
    enableDisableAll(areChecked: boolean): void;
    enableDisableAction(selectedRowIds: any, actionsListProvider: any): void;
}