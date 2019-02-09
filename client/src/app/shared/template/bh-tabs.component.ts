import { Component, Input, ContentChildren, QueryList, AfterContentInit, Output, EventEmitter } from '@angular/core';
import { TabComponent } from './bh-tab.component';

@Component({
    selector: 'bh-tabs',
    templateUrl: 'bh-tabs.component.html'
})

export class TabsComponent implements AfterContentInit {
    @Input() justified: boolean = false;
    @Input() showTabs: boolean = true;
    @Input() restoreSelectedTab: boolean = true;
    @Output() tabSelected = new EventEmitter<TabComponent>();

    @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
    private DefaultName: string = "Default"
    ngAfterContentInit() {
        this.processTabs();
    }

    public reInit() {
        this.processTabs();
    }

    private processTabs() {
        if (!this.restoreSelectedTab && this.tabs.length > 0) {
            this.selectTab(this.tabs.first);
        } else {
            let selectedIndex: number = parseInt(sessionStorage.getItem('selectedTab')) || 0;
            let savedUrl = sessionStorage.getItem('currentUrl');
            if (savedUrl == window.location.href) {
                this.selectTab(this.tabs.toArray()[selectedIndex]);
            } else {
                this.selectTab(this.tabs.toArray()[0]);
            }
        }
    }

    selectTab(tab: TabComponent) {
        if (tab != undefined && !tab.disable) {
            this.tabs.toArray().forEach(tab => tab.active = false);
            if (this.restoreSelectedTab) {
                let selectedIndex: number = this.tabs.toArray().indexOf(tab);
                let selectedIndexString = selectedIndex.toString();
                let windowUrl = window.location.href;
                sessionStorage.setItem('selectedTab', selectedIndexString);
                sessionStorage.setItem('currentUrl', windowUrl);    
            }
            tab.active = true;
        }
        this.tabSelected.emit(tab);
    }

    selectDefaultTab() {
        this.selectTab(this.tabs.first);
    }
}