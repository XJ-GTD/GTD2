import { Component, ViewChild, Input, Output, EventEmitter,ElementRef } from '@angular/core';
import {  Events } from 'ionic-angular';
import * as moment from "moment";

/**
 * Generated class for the ScrollRangePickerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'scroll-range-picker',
  template: `<div class="scroll-box">
    <div class="scroll-box-content" id="scroll-box-content" #scrollBox>
      <div class="scroll-box-zoom-wrapper">
        <div class="svg-scroller">
          <svg id="timerange-picker" xmlns="http://www.w3.org/2000/svg" [attr.viewBox]="viewBox">
              <defs>
                  <style>.time-line{stroke:#fff;}.time-block-title{fill:#fff;}</style>
              </defs>
              <title>timerange-picker</title>
              <line *ngFor="let x of timeLines; let i = index;" class="time-line" stroke-linecap="undefined" stroke-linejoin="undefined" [attr.id]="'svg_u' + i" y2="119" [attr.x2]="x" y1="0" [attr.x1]="x" stroke-width="1.5" fill="none"/>
              <line *ngFor="let x of timeLines; let i = index;" class="time-line" stroke-linecap="undefined" stroke-linejoin="undefined" [attr.id]="'svg_d' + i" y2="359" [attr.x2]="x" y1="240" [attr.x1]="x" stroke-width="1.5" fill="none"/>
              <text *ngFor="let title of blockTitles;" class="time-block-title" stroke="#000" xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="24" id="svg_4" y="188" [attr.x]="title.x" fill-opacity="null" stroke-opacity="null" stroke-width="0">{{title.title}}</text>
          </svg>
        </div>
      </div>
    </div>
    <div class="scroll-box-pointer">
      <div class="scroll-box-zoom-wrapper">
        <div class="svg-scroller">
          <svg id="timerange-picker-pointer" xmlns="http://www.w3.org/2000/svg" [attr.viewBox]="viewBoxPointer">
              <defs>
                  <style>.time-line{stroke:#fff;}.time-block-title{fill:#fff;}</style>
              </defs>
              <title>timerange-picker-pointer</title>
              <line *ngIf="startX" class="time-line" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_start" y2="359" [attr.x2]="startX" y1="0" [attr.x1]="startX" stroke-width="1.5" fill="none"/>
              <line *ngIf="endX" class="time-line" stroke-linecap="undefined" stroke-linejoin="undefined" id="svg_end" y2="359" [attr.x2]="endX" y1="0" [attr.x1]="endX" stroke-width="1.5" fill="none"/>
          </svg>
        </div>
      </div>
    </div>
  </div>`
})
export class ScrollRangePickerComponent {

  @ViewChild('scrollBox', { read: ElementRef }) _scrollBox: ElementRef;
  viewBox: string = '0 0 ' + 2484 * 6 + ' 360';
  viewHiddenWidth: number = 2484 * 24 / 24;
  viewBoxPointer: string = '0 0 2484 360';
  @Input('type')
  viewType: string = 'day-range-picker';  // day-range-picker
  viewHours: number = 24; // 12小时
  @Input('min')
  viewMinTime: number = 5; // 5分钟
  timeLines: any = [];
  @Input()
  titles: any = {'3': '凌晨', '9': '上午', '12': '中午', '16': '下午', '21': '晚上', '23': '深夜'};
  blockTitles: any = [];
  pushedtitles: any = {'6': false, '12': false, '20': false};
  startX: number;
  endX: number;
  blockGap: number = 3;
  hourLines: number;
  @Output("changed")
  changedPropEvent = new EventEmitter();
  lastScrollLeft: number = 0;
  value: string = '12:00';
  guid: string = '';
  splitpixel: number = 2;
  baseTime: moment.Moment = moment("2019/6/30 12:00");

  constructor(public events: Events) {
    this.guid = this.createGuid();
    this.events.subscribe('_scrollBox' + this.guid + ':change', (dest) => {
      this.valueChanged(this.lastScrollLeft, dest);
    });
  }

  ngOnInit() {
    const that = this;
    const ele = this._scrollBox.nativeElement;
    ele.addEventListener('scroll', (event) => {
      that.events.publish('_scrollBox' + this.guid + ':change', event.target.scrollLeft, Date.now());
    }, {passive: true}, false);

    //计算当前屏幕可以正常显示的时间长度
    let pixels = document.body.clientWidth;
    //每屏操作时间范围以6小时为单位,6小时/12小时/18小时/24小时
    this.viewHours = Math.floor(Math.floor((Math.floor(pixels / this.splitpixel) * 5) / 60) / 6) * 6;

    this.hourLines = 60 / this.viewMinTime;
    let viewLines = this.viewHours * this.hourLines;
    this.blockGap = 2484 / (viewLines);

    let middle = 2484 * 3;
    this.timeLines.push(middle);

    for (let timeLineX = this.blockGap; timeLineX < 2484 * 3; timeLineX += this.blockGap) {
      let left = middle - timeLineX;
      let right = middle + timeLineX;

      if (left > 0) {
        this.timeLines.unshift(left);
      }

      if (right < middle * 2) {
        this.timeLines.push(right);
      }
    }

    // 画范围外时间线 (包括范围之前和范围之后)
    /*for (let hour = 0; hour < this.viewHours; hour++) {
      for (let block = 1; block <= this.hourLines; block++) {
        let timeLineX = this.blockGap * ((hour * this.hourLines) + block);

        if (timeLineX > this.viewHiddenWidth) {
          break;
        }

        this.timeLines.push(timeLineX);
        this.timeLines.push(timeLineX + 2484 + this.viewHiddenWidth);
      }
    }

    // 画设置时间段内时间线
    for (let hour = 0; hour < this.viewHours; hour++) {
      for (let block = 1; block <= this.hourLines; block++) {
        let timeLineX = this.viewHiddenWidth + this.blockGap * ((hour * this.hourLines) + block);

        if (this.titles[hour.toString()] && !this.pushedtitles[hour.toString()]) {
          this.blockTitles.push({x: timeLineX, title: this.titles[hour.toString()]});
          this.pushedtitles[hour.toString()] = true;
        }

        this.timeLines.push(timeLineX);
      }
    }*/

    let clientWidth = this._scrollBox.nativeElement.clientWidth;
    let scrollWidth = this._scrollBox.nativeElement.scrollWidth;
    this.startX = this.getTimeX(this.viewHours / 2 + ":00", 2484);
    let scrollLeft = this.getScrollLeft(this.value, clientWidth, scrollWidth);
    this._scrollBox.nativeElement.scrollLeft = scrollLeft;
  }

  valueChanged(src, dest) {
    if (src !== dest) {
      let clientWidth = this._scrollBox.nativeElement.clientWidth;
      let scrollWidth = this._scrollBox.nativeElement.scrollWidth;

      let time = this.getTimeString(dest, clientWidth, scrollWidth);
      this.changedPropEvent.emit({src: this.value, dest: time});
      this.value = time;
    }
  }

  getTimeString(scrollLeft, clientWidth, scrollWidth) {
    let timeGap = (scrollWidth / 2) - (scrollLeft + (clientWidth / 2));
    let timeGapMinutes = Math.floor(timeGap / this.blockGap) * this.viewMinTime;

    if (timeGapMinutes == 0) {
      return this.baseTime.format("hh:mm");
    } else if (timeGapMinutes > 0) {
      let curTime = moment.unix(this.baseTime.unix());
      curTime.add(timeGapMinutes, "minutes");

      return curTime.format("hh:mm");
    } else {
      let curTime = moment.unix(this.baseTime.unix());
      curTime.subtract(Math.abs(timeGapMinutes), "minutes");

      return curTime.format("hh:mm");
    }
  }

  getTimeX(time, width) {
    let hour = parseInt(time.slice(0, 2));
    let minute = parseInt(time.slice(3, 5));

    return (Math.floor((hour * this.hourLines + minute / this.viewMinTime)) * this.blockGap) / 2484 * width;
  }

  getScrollLeft(time, clientWidth, scrollWidth) {
    let timeX = this.getTimeX(time, scrollWidth);

    let leftX = timeX - (clientWidth / 2);

    return leftX >= 0 ? leftX : 0;
  }

  formatNumber(num, pattern) {
    var strarr = num ? num.toString().split('.') : ['0'];
    var fmtarr = pattern ? pattern.split('.') : [''];
    var retstr = '';
    // 整数部分
    var str = strarr[0];
    var fmt = fmtarr[0];
    var i = str.length - 1;
    var comma = false;
    for (let f = fmt.length - 1; f >= 0; f--) {
      switch (fmt.substr(f, 1)) {
      case '#':
        if (i >= 0)
          retstr = str.substr(i--, 1) + retstr;
        break;
      case '0':
        if (i >= 0)
          retstr = str.substr(i--, 1) + retstr;
        else
          retstr = '0' + retstr;
        break;
      case ',':
        comma = true;
        retstr = ',' + retstr;
        break;
      }
    }
    if (i >= 0) {
      if (comma) {
        var l = str.length;
        for (; i >= 0; i--) {
          retstr = str.substr(i, 1) + retstr;
          if (i > 0 && ((l - i) % 3) == 0)
            retstr = ',' + retstr;
        }
      } else
        retstr = str.substr(0, i + 1) + retstr;
    }
    retstr = retstr + '.';
    // 处理小数部分
    str = strarr.length > 1 ? strarr[1] : '';
    fmt = fmtarr.length > 1 ? fmtarr[1] : '';
    i = 0;
    for (let f = 0; f < fmt.length; f++) {
      switch (fmt.substr(f, 1)) {
      case '#':
        if (i < str.length)
          retstr += str.substr(i++, 1);
        break;
      case '0':
        if (i < str.length)
          retstr += str.substr(i++, 1);
        else
          retstr += '0';
        break;
      }
    }
    return retstr.replace(/^,+/, '').replace(/\.$/, '');
  }


  createGuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}
}
