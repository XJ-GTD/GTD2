import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the 新建日程 page.
 * create by wzy
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tdc',
  template: `
    <ion-content padding>
      <ion-grid>
        <!--<ion-row justify-content-center>
        <ul class="sphere-inner">
        <li class="a"><div class="container">
        <div class="wave"></div>
        </div></li>
        <li class="b"><div class="container">
        <div class="wave1"></div>
        </div></li>
        <li class="c"><div class="container">
        <div class="wave2"></div>
        </div></li>
        <li class="d"><div class="container">
        <div class="wave3"></div>
        </div></li>
        </ul>
        </ion-row>-->
        <ion-row justify-content-center>
          <h1>今天</h1>
        </ion-row>
        <ion-row justify-content-center>
          <p>二月 23</p>
        </ion-row>
        <ion-row justify-content-center>
          <div>
            <button ion-button clear class="text-btn">设置全天</button>
          </div>
          <div>
            <button ion-button clear class="text-btn" id="rangestart">3:00下午</button>
            →
            <button ion-button clear class="text-btn">{{rangeEnd}}</button>
          </div>
        </ion-row>
        <ion-row justify-content-center>
          <ion-input type="text" value="" placeholder="喜马拉雅儿子的生日聚会" text-center></ion-input>
        </ion-row>
        <!--<ion-row justify-content-center>
        <div class="container">
        <div class="wave"></div>
        </div>
        </ion-row>-->
        <ion-row justify-content-center>
          <scroll-select [options]="labels" [value]="0"></scroll-select>
        </ion-row>
        <ion-row justify-content-center>
          <scroll-select [options]="months" [value]="'10'"></scroll-select>
        </ion-row>
        <p padding></p>
        <ion-row justify-content-center>
          <scroll-select [options]="months" [value]="'03'" [type]="'scroll-without-button'" [items]="5"></scroll-select>
        </ion-row>
        <p padding></p>
        <ion-row justify-content-center>
          <scroll-select [options]="years" [value]="'2019'" [type]="'scroll-without-button'"
                         [items]="7"></scroll-select>
        </ion-row>
        <p padding></p>
        <ion-row class="full-width" justify-content-center>
          <scroll-range-picker max="24" min="5" value="18:00" (changed)="timechanged($event)"></scroll-range-picker>
        </ion-row>
        <ion-row justify-content-center>
          <scroll-select class="image-scroll-select" [options]="motions" [value]="'Party'"></scroll-select>
        </ion-row>
      </ion-grid>
    </ion-content>`,
})

export class TdcPage {
  //
  labels: Array<any> = [{value: 0, caption: '工作'}, {value: 1, caption: '个人'}];
  months: Array<any> = [{value: '01', caption: '一月'}, {value: '02', caption: '二月'}, {
    value: '03',
    caption: '三月'
  }, {value: '04', caption: '四月'}, {value: '05', caption: '五月'}, {value: '06', caption: '六月'}, {
    value: '07',
    caption: '七月'
  }, {value: '08', caption: '八月'}, {value: '09', caption: '九月'}, {value: '10', caption: '十月'}, {
    value: '11',
    caption: '十一月'
  }, {value: '12', caption: '十二月'}];
  years: Array<any> = [];
  rangeEnd: string = '4:30下午';
  motions: Array<any> = [
    {value: 'Anxious', caption: `<img class="image-option" src="../assets/imgs/Anxious.png">`},
    {value: 'Birthday', caption: `<img class="image-option" src="../assets/imgs/Birthday.png">`},
    {value: 'Celebration', caption: `<img class="image-option" src="../assets/imgs/Celebration.png">`},
    {value: 'Competition', caption: `<img class="image-option" src="../assets/imgs/Competition.png">`},
    {value: 'Excited', caption: `<img class="image-option" src="../assets/imgs/Excited.png">`},
    {value: 'Party', caption: `<img class="image-option" src="../assets/imgs/Party.png">`},
    {value: 'Romance', caption: `<img class="image-option" src="../assets/imgs/Romance.png">`},
    {value: 'Sport', caption: `<img class="image-option" src="../assets/imgs/Sport.png">`},
    {value: 'Study', caption: `<img class="image-option" src="../assets/imgs/Study.png">`},
    {value: 'Travel', caption: `<img class="image-option" src="../assets/imgs/Travel.png">`}
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    for (let year = 2009; year <= 2029; year++) {
      this.years.push({value: year.toString(), caption: year.toString()});
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewAgendaPage');
  }

  timechanged(changed) {
    if (changed !== undefined) {
      let src = changed.src;
      let dest = changed.dest;
      this.rangeEnd = dest;
    }
  }

}

