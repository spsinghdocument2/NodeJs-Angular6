import { NgModule } from '@angular/core';
 import { CommonModule } from '@angular/common';
 import { HttpModule } from '@angular/http';
 import { ReactiveFormsModule, FormsModule } from '@angular/forms';
 import { Routes, RouterModule } from '@angular/router';
import { AuthorizedComponent } from './authorized.component';
import {InputRComponent} from './reactive/bh-r-input.component';
import * as shared from './index';
// PrimeNG
import * as png from './libs/primeng/primeng';
  
  // DatetimePicker
import { Ng2DatetimePickerModule } from './controls/ng2-datetime-picker/index';

import { WjCoreModule } from 'wijmo/wijmo.angular2.core';
import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjGridFilterModule } from 'wijmo/wijmo.angular2.grid.filter';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

// declare var require: any;
// export function highchartsFactory() {
//     return require('highcharts');
// }

@NgModule({
    imports: [
         ReactiveFormsModule,
         FormsModule,
         HttpModule,
        RouterModule,
         CommonModule,
         // PrimeNG
         png.EditorModule,
		 png.SharedModule,
         // Wijmo
		WjCoreModule,
		WjGridModule,
		WjGridFilterModule,
        WjInputModule,

        Ng2DatetimePickerModule,
    ],
    exports: [
        //angular2
         ReactiveFormsModule,
        FormsModule,
         HttpModule,
         RouterModule,
        CommonModule  ,
        AuthorizedComponent,
         //controls
        shared.InputRComponent, 
        shared.LoadingRComponent,
        shared.CheckboxRComponent, 
         shared.ModalRComponent,
         shared.EntityHeaderRComponent, 
         shared.ParsedInputRComponent,  
         shared.TextareaRComponent,
         shared.SearchAndSelectRComponent,
         shared.EditorRComponent,  
          shared.DropDownRComponent,
          shared.RadioRComponent,
          shared.DateRComponent,
          shared.NameRComponent,
          shared.AddressRComponent,
          shared.TabComponent,
          shared.TabsComponent,
          shared.TableComponent,
          shared.LoadingIndicator,
          shared.TreeRComponent,
          shared.SectionListBhTableComponent,
          shared.SectionListComponent,
          shared.TableRComponent,
           shared.MultiSectionListComponent,
           shared.OptionListComponent,
           shared.DropDownInputComponent,
           shared.TreeRowRComponent,
           		//pipes
		shared.ColumnExcludePipe,
        shared.SafeHtmlPipe,
        shared.FormatPipe,
        shared.FilterPipe,
        shared.OrderrByPipe,

         // PrimeNG
         png.EditorModule,
		 png.SharedModule,
         
         Ng2DatetimePickerModule,
    ],
    declarations: [
        AuthorizedComponent,
                //controls
      shared.InputRComponent,
      shared.LoadingRComponent,
      shared.CheckboxRComponent,
      shared.ModalRComponent,
      shared.EntityHeaderRComponent, 
      shared.ParsedInputRComponent,
      shared.TextareaRComponent,
      shared.SearchAndSelectRComponent,
      shared.EditorRComponent,
      shared.DropDownRComponent,
      shared.RadioRComponent,
       shared.DateRComponent,
       shared.NameRComponent,
       shared.AddressRComponent,
       shared.TabComponent,
       shared.TabsComponent,
       shared.TableComponent,
       shared.LoadingIndicator,
       shared.TreeRComponent,
       shared.SectionListBhTableComponent,
       shared.SectionListComponent,
       shared.TableRComponent,
       shared.MultiSectionListComponent,
       shared.OptionListComponent,
       	//pipes
		shared.ColumnExcludePipe,
        shared.SafeHtmlPipe,
        shared.FormatPipe,
        shared.DropDownInputComponent,
        shared.TreeRowRComponent,
        shared.FilterPipe,
        shared.OrderrByPipe,
    ],
    providers: [
    ]
})
export class SharedModule { }