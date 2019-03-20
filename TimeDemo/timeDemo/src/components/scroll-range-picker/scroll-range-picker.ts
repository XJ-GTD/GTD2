import { Component, Input } from '@angular/core';

/**
 * Generated class for the ScrollRangePickerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'scroll-range-picker',
  templateUrl: 'scroll-range-picker.html'
})
export class ScrollRangePickerComponent {

  viewBox: string = '0 0 2484 180';
  @Input('max')
  viewHours: number = 24; // 12小时
  @Input('min')
  viewMinTime: number = 5; // 5分钟
  timeLines: array = [];
  @Input()
  titles: any = {'6': '上午', '12': '下午', '20': '晚上'};
  blockTitles: array = [];
  pushedtitles: any = {'6': false, '12': false, '20': false};
  startX: number;
  endX: number;
  blockGap: number;
  hourLines: number;
  scrolldata: string = '{}';

  constructor() {
  }
  
  ngOnInit() {
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

}
