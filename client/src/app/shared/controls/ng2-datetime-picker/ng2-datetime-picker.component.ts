import {
  Input,
  Output,
  Component,
  ElementRef,
  ViewEncapsulation,
  ChangeDetectorRef,
  EventEmitter,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {Ng2Datetime} from './ng2-datetime';

declare var moment: any;

@Component({
  providers    : [Ng2Datetime],
  selector     : 'ng2-datetime-picker',
  template     : `
<div class="ng2-datetime-picker" tabindex="0">

  <!-- Month - Year  -->
  <div class="month" *ngIf="!timeOnly">
    <b class="prev_next prev" (click)="updateMonthData(-12)">&laquo;</b>
    <b class="prev_next prev" (click)="updateMonthData(-1)">&lsaquo;</b>
     <span title="{{monthData?.fullName}}">
           {{monthData?.shortName}}
     </span>
    {{monthData.year}}
    <b class="prev_next next" (click)="updateMonthData(+12)">&raquo;</b>
    <b class="prev_next next" (click)="updateMonthData(+1)">&rsaquo;</b>
  </div>

  <!-- Date -->
  <div class="days" *ngIf="!timeOnly">

    <!-- Su Mo Tu We Th Fr Sa -->
    <div class="day-of-week"
         *ngFor="let dayOfWeek of monthData.localizedDaysOfWeek; let ndx=index"
         [class.weekend]="isWeekend(ndx + monthData.firstDayOfWeek)"
         title="{{dayOfWeek.fullName}}">
      {{dayOfWeek.shortName}}
    </div>

    <!-- Fill up blank days for this month -->
    <div *ngIf="monthData.leadingDays.length < 7">
      <div class="day" *ngFor="let dayNum of monthData.leadingDays">
        {{dayNum}}
      </div>
    </div>

    <div class="day"
         *ngFor="let dayNum of monthData.days"
         (click)="selectDateTime(toDate(dayNum))"
         title="{{monthData.year}}-{{monthData.month+1}}-{{dayNum}}"
         [ngClass]="{
           selectable: !isDateDisabled(toDate(dayNum)),
           selected: toDate(dayNum).getTime() === toDateOnly(selectedDate).getTime(),
           today: toDate(dayNum).getTime() === today.getTime(),
           weekend: isWeekend(dayNum, monthData.month)
         }">
      {{dayNum}}
    </div>

    <!-- Fill up blank days for this month -->
    <div *ngIf="monthData.trailingDays.length < 7">
      <div class="day"
           *ngFor="let dayNum of monthData.trailingDays">
        {{dayNum}}
      </div>
    </div>
  </div>

  <!-- Time -->
  <div class="days" id="time" *ngIf="!dateOnly">
    <label class="timeLabel">Time:</label>
    <span class="timeValue">
        {{convertHours(hour)}} : {{("0"+minute).slice(-2)}} {{timeSuffix}}
    </span><br/>
    <label class="hourLabel">Hour:</label>
    <input #hours class="hourInput"
           (change)="selectDateTime()"
           type="range"
           min="{{minHour || 0}}"
           max="{{maxHour || 23}}"
           [(ngModel)]="hour" />
    <label class="minutesLabel">Min:</label>
    <input #minutes class="minutesInput"
           step="{{minuteStep}}"
           (change)="selectDateTime()"
           type="range" min="0" max="59" range="10" [(ngModel)]="minute"/>
  </div>
</div>
  `,
  styles       : [
    `
 @keyframes slideDown {
  0% {
    transform:  translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.ng2-datetime-picker-wrapper {
  position: relative;
}

.ng2-datetime-picker {
    color: #333;
    outline-width: 0;
    font: normal 14px sans-serif;
    border: 1px solid #ddd;
    display: inline-block;
    background: #fff;
    animation: slideDown 0.1s ease-in-out;
    animation-fill-mode: both;
}
.ng2-datetime-picker > .month {
    text-align: center;
    line-height: 22px;
    padding: 10px;
    background: #fcfcfc;
    text-transform: uppercase;
    font-weight: bold;
    border-bottom: 1px solid #ddd;
    position: relative;
}
.ng2-datetime-picker > .month > .prev_next {
    color: #555;
    display: block;
    font: normal 24px sans-serif;
    outline: none;
    background: transparent;
    border: none;
    cursor: pointer;
    width: 15px;
    text-align: center;
}
.ng2-datetime-picker > .month > .prev_next:hover {
  background-color: #333;
  color: #fff;
}
.ng2-datetime-picker > .month > .prev_next.prev {
  float: left;
}
.ng2-datetime-picker > .month > .prev_next.next {
  float: right;
}
.ng2-datetime-picker > .days {
    width: 210px; /* 30 x 7 */
    margin: 10px;
    text-align: center;
}
.ng2-datetime-picker > .days .day-of-week,
.ng2-datetime-picker > .days .day {
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    border: 1px solid transparent;
    width: 30px;
    line-height: 28px;
    float: left;
}
.ng2-datetime-picker > .days .day-of-week {
    font-weight: bold;
}
.ng2-datetime-picker > .days .day-of-week.weekend {
    color: #ccc;
    background-color: inherit;
}
.ng2-datetime-picker > .days .day:not(.selectable) {
    color: #ccc;
    cursor: default;
}
.ng2-datetime-picker > .days .weekend {
    color: #ccc;
    background-color: #eee;
}
.ng2-datetime-picker > .days .day.selectable  {
    cursor: pointer;
}
.ng2-datetime-picker > .days .day.selected {
    background: gray;
    color: #fff;
}
.ng2-datetime-picker > .days .day:not(.selected).selectable:hover {
    background: #eee;
}
.ng2-datetime-picker > .days:after {
    content: '';
    display: block;
    clear: left;
    height: 0;
}
.ng2-datetime-picker .hourLabel,
.ng2-datetime-picker .minutesLabel {
    display: inline-block;
    width: 40px;
    text-align: right;
}
.ng2-datetime-picker input[type=range] {
    width: 200px;
}
  `
  ],
  encapsulation: ViewEncapsulation.None
})
export class Ng2DatetimePickerComponent implements AfterViewInit {
  @Input('date-format')       dateFormat: string;
  @Input('date-only')         dateOnly: boolean;
  @Input('time-only')         timeOnly: boolean;
  @Input('selected-date')     selectedDate: Date;
  @Input('hour')              hour: number;
  @Input('minute')            minute: number;
  @Input('minuteStep')        minuteStep: number = 1;
  @Input('first-day-of-week') firstDayOfWeek: string;
  @Input('default-value')     defaultValue: Date;
  @Input('min-date')          minDate: Date;
  @Input('max-date')          maxDate: Date;
  @Input('min-hour')          minHour: number;
  @Input('max-hour')          maxHour: number;
  @Input('disabled-dates')    disabledDates: Date[];
  @Input('show-am-pm') showAmPm: boolean = true;

  @Output('selected$')  selected$:EventEmitter<any> = new EventEmitter();
  @Output('closing$')   closing$:EventEmitter<any> = new EventEmitter();

  @ViewChild('hours')   hours:ElementRef;
  @ViewChild('minutes') minutes:ElementRef;

  public el:HTMLElement; // this component element
  public monthData: any;  // month calendar data
  private timeSuffix: string;

  public disabledDatesInTime: number[];

  public constructor (
    elementRef: ElementRef,
    public ng2Datetime: Ng2Datetime,
    public cdRef: ChangeDetectorRef
  ) {
    this.el = elementRef.nativeElement;
  }

  public ngAfterViewInit ():void {
    let stopPropagation = (e: Event) => e.stopPropagation();
    if (!this.dateOnly) {
      this.hours.nativeElement.addEventListener('keyup', stopPropagation);
      this.hours.nativeElement.addEventListener('mousedown', stopPropagation);
      this.minutes.nativeElement.addEventListener('keyup', stopPropagation);
      this.minutes.nativeElement.addEventListener('mousedown', stopPropagation);
    }
  }

  public get year ():number {
    return this.selectedDate.getFullYear();
  }

  public get month ():number {
    return this.selectedDate.getMonth();
  }

  public get day ():number {
    return this.selectedDate.getDate();
  }

  public get today ():Date {
    let dt = new Date();
    dt.setHours(0);
    dt.setMinutes(0);
    dt.setSeconds(0);
    dt.setMilliseconds(0);
    return dt;
  }

  public isWeekend(dayNum: number, month?: number): boolean {
    if (typeof month === 'undefined') {
      return Ng2Datetime.weekends.indexOf(dayNum % 7) !== -1; //weekday index
    } else {
      let weekday = this.toDate(dayNum, month).getDay();
      return Ng2Datetime.weekends.indexOf(weekday) !== -1;
    }
  }

  public set year (year) {}
  public set month (month) {}
  public set day (day) {}
  public set today (today) {}

  public initDatetime (date:Date) {
    if (date) {
      this.selectedDate = date.getTime() ? date : new Date();
    } else {
      this.selectedDate = this.defaultValue || new Date();
    }

    // set hour and minute using moment if available to avoid having Javascript change timezones
    //if (typeof moment !== 'undefined') {
    //  this.hour         = this.selectedDate.getHours();
    //  this.minute       = this.selectedDate.getMinutes();
    //} else {
      let m = moment(this.selectedDate);
      this.hour = m.hours();
      this.minute = m.minute();
    //}

    this.monthData    = this.ng2Datetime.getMonthData(this.year, this.month);
  }

  public toDate (day:number, month?: number):Date {
    return new Date(this.monthData.year, month || this.monthData.month, day);
  }

  public toDateOnly (date:Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  }

  /**
   * set the selected date and close it when closeOnSelect is true
   * @param date {Date}
   */
  public selectDateTime(date?: Date) {
    this.selectedDate = date || this.selectedDate;
    if (this.isDateDisabled(this.selectedDate)) {
      return false;
    }

    // editing hours and minutes via javascript date methods causes date to lose timezone info,
    // so edit using moment if available
    let hour = parseInt( '' + this.hour || '0', 10);
    let minute = parseInt( '' + this.minute || '0', 10);
    if (moment !== undefined) {
      // here selected date has a time of 00:00 in local time,
      // so build moment by getting year/month/day separately
      // to avoid it saving as a day earlier
      let m = moment([this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate()]);
      m.hours(this.hour);
      m.minutes(this.minute);
      this.selectedDate = m.toDate();
    } else {
      this.selectedDate.setHours(hour);
      this.selectedDate.setMinutes(minute);
    }

    this.selectedDate.toString = () => {
      return Ng2Datetime.formatDate(this.selectedDate, this.dateFormat, this.dateOnly);
    };
    this.selected$.emit(this.selectedDate);
    this.closing$.emit(true);
  };

  /**
   * show prev/next month calendar
   */
  public updateMonthData (num:number) {
    this.monthData = this.ng2Datetime.getMonthData(this.monthData.year, this.monthData.month + num);
  }

  public isDateDisabled(date: Date) {
    let dateInTime  = date.getTime();
    this.disabledDatesInTime =
      this.disabledDatesInTime || (this.disabledDates || []).map(d => d.getTime());

    if (this.minDate && (dateInTime < this.minDate.getTime())) {
      return true;
    } else if (this.maxDate && (dateInTime > this.maxDate.getTime())) {
      return true;
    } else if (this.disabledDatesInTime.indexOf(dateInTime) >= 0) {
      return true
    }

    return false;
  }


  private convertHours(hours) {
      if (this.showAmPm) {
          this.timeSuffix = (hours >= 12) ? 'PM' : 'AM';
          hours = (hours == 0) ? 12 : (hours > 12) ? hours - 12 : hours;
      } else {
          this.timeSuffix = null;
      }
      return ("0" + hours).slice(-2);
  }
}
