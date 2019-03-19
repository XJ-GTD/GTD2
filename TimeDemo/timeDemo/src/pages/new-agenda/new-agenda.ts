import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the NewAgendaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-agenda',
  templateUrl: 'new-agenda.html',
})
export class NewAgendaPage {

  @ViewChild('timepickerScroll') timepickerScroll: Scroll;
  viewBox: string = '0 0 2484 180';
  viewHours: number = 24; // 12小时
  viewMinTime: number = 5; // 5分钟
  timeLines: array = [];
  titles: any = {'6': '上午', '12': '下午', '20': '晚上'};
  blockTitles: array = [];
  pushedtitles: any = {'6': false, '12': false, '20': false};
  startX: number;
  endX: number;
  blockGap: number;
  hourLines: number;
  scrolldata: string = '{}';
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.hourLines = 60 / this.viewMinTime;
    let viewLines = this.viewHours * this.hourLines;
    this.blockGap = 2484 / (viewLines + 1);
    
    this.scrolldata = JSON.stringify({
      'blockGap': this.blockGap,
      'hourLines': this.hourLines,
      'viewMinTime': this.viewMinTime
    });
    
    for (let hour = 0; hour < this.viewHours; hour++) {
      for (let block = 1; block <= this.hourLines; block++) {
        let timeLineX = this.blockGap * ((hour * this.hourLines) + block);

        if (this.titles[hour.toString()] && !this.pushedtitles[hour.toString()]) {
          this.blockTitles.push({x: timeLineX, title: this.titles[hour.toString()]});
          this.pushedtitles[hour.toString()] = true;
        }
        
        this.timeLines.push(timeLineX);
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewAgendaPage');
    console.log(this.timepickerScroll);
    this.timepickerScroll.addScrollEventListener(this.timepickerChange);

    let clientWidth = this.timepickerScroll._scrollContent.nativeElement.clientWidth;
    let scrollWidth = this.timepickerScroll._scrollContent.nativeElement.scrollWidth;
    this.startX = this.getTimeX('15:00', 2484);
    let scrollLeft = this.getScrollLeft('15:00', clientWidth, scrollWidth);
    this.timepickerScroll._scrollContent.nativeElement.scrollLeft = scrollLeft;
  }
  
  getTimeString(scrollLeft, clientWidth, scrollWidth) {
    let timeGap = (scrollLeft + (clientWidth / 2)) / scrollWidth * 2484;
    
    let hour = timeGap / (this.blockGap * this.hourLines);
    let minute = (timeGap - (hour * (this.blockGap * this.hourLines))) / this.blockGap * this.viewMinTime;
    
    return NewAgendaPage.formatNumber(hour, '00') + ":" + NewAgendaPage.formatNumber(minute, '00');
  }
  
  getTimeX(time, width) {
    let hour = parseInt(time.slice(0, 2));
    let minute = parseInt(time.slice(3, 5));

    return ((hour * this.hourLines + minute / this.viewMinTime) * this.blockGap) / 2484 * width;
  }
  
  getScrollLeft(time, clientWidth, scrollWidth) {
    let timeX = this.getTimeX(time, scrollWidth);
    
    let leftX = timeX - (clientWidth / 2);
    
    return leftX >= 0 ? leftX : 0;
  }
  
  timepickerChange(e) {
    console.log(e);
    let scrollLeft = e.target.scrollLeft;
    let scrollWidth = e.target.scrollWidth;
    let clientWidth = e.target.clientWidth;
    
    let data = eval('(' + e.target.parentNode.attributes['data-g'].value + ')');
    
    function getTimeString(data, scrollLeft, clientWidth, scrollWidth) {
      let timeGap = (scrollLeft + (clientWidth / 2)) / scrollWidth * 2484;
      
      let hour = timeGap / (data.blockGap * data.hourLines);
      let minute = (timeGap - (hour * (data.blockGap * data.hourLines))) / data.blockGap * data.viewMinTime;
      
      return NewAgendaPage.formatNumber(hour, '00') + ":" + NewAgendaPage.formatNumber(minute, '00');
    }

    function getTimeX(data, time, width) {
      let hour = parseInt(time.slice(0, 2));
      let minute = parseInt(time.slice(3, 5));

      return ((hour * data.hourLines + minute / data.viewMinTime) * data.blockGap) / 2484 * width;
    }
  
    let time = getTimeString(data, scrollLeft, clientWidth, scrollWidth);
    document.getElementById('rangestart').childNodes[0].textContent = time;
    document.getElementById('svg_start').x1.baseVal.value = getTimeX(data, time, 2484);
    document.getElementById('svg_start').x2.baseVal.value = getTimeX(data, time, 2484);
  }

  public static formatNumber(num, pattern) {
    var strarr = num ? num.toString().split('.') : ['0'];
    var fmtarr = pattern ? pattern.split('.') : [''];
    var retstr = '';
    // 整数部分
    var str = strarr[0];
    var fmt = fmtarr[0];
    var i = str.length - 1;
    var comma = false;
    for (var f = fmt.length - 1; f >= 0; f--) {
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
    for (var f = 0; f < fmt.length; f++) {
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
}
