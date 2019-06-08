import {Component, ElementRef, Renderer2, ViewChild, ViewChildren, QueryList } from '@angular/core';
import {IonicPage, NavController, ModalController, NavParams, Slides} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {RestFulHeader, RestFulConfig} from "../../service/config/restful.config";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import * as moment from "moment";
import { CalendarDay } from "../../components/ion2-calendar";
import { DaService } from "./da.service";
import { ScdData, ScdPageParamter } from "../../data.mapping";
import {EmitService} from "../../service/util-service/emit.service";
import {DataConfig} from "../../service/config/data.config";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {CardListComponent} from "../../components/card-list/card-list";

/**
 * Generated class for the 每天日程一览 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-da',
  template: `
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons left>
          <button ion-button icon-only (click)="goBack()" color="danger">
            <img class="img-header-left" src="./assets/imgs/back-white.png">
          </button>
        </ion-buttons>
        <ion-title>{{currentdayofweek}}<br/><small>{{currentdayshow}}</small></ion-title>
        <ion-buttons right>
          <button ion-button icon-only (click)="goNew()" color="danger">
          <img class="img-header-right" src="./assets/imgs/qtj-white.png">
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
    <ion-slides initialSlide="1" (ionSlideDidChange)="slideChanged()" (ionSlideNextEnd)="slideNextEnd()" (ionSlidePrevEnd)="slidePrevEnd()">
      <ion-slide *ngFor="let day of days">
        <card-list #cardlist (onStartLoad)="getData($event, day)" (onCardClick)="gotoDetail($event)" #cardlist></card-list>
      </ion-slide>
    </ion-slides>
    </ion-content>
    <ion-footer class="foot-set" *ngIf="isMobile && hasContents">
      <ion-toolbar>
      <button ion-button *ngIf="isMobile && !speaking" icon-only full (click)="play()">
        <ion-icon name="play" color="white"></ion-icon>
      </button>
      <button ion-button *ngIf="isMobile && speaking" icon-only full (click)="pause()">
        <ion-icon name="pause" color="white"></ion-icon>
      </button>
      </ion-toolbar>
    </ion-footer>
    `
})
export class DaPage {

  currentday: CalendarDay;
  currentdayofweek: string = moment().format('dddd');
  currentdayshow: string = moment().format('MMMM D');
  todaylist: Array<ScdData> = new Array<ScdData>();
  scdlist: Array<ScdData> = new Array<ScdData>();
  speaking: boolean = false;
  isMobile: boolean = false;
  hasContents: boolean = false;
  cardlist: CardListComponent;
  @ViewChild(Slides) slides: Slides;
  @ViewChildren("cardlist") cardlists: QueryList<CardListComponent>;

  MIN_SLIDE_DAYS: number = 5; // 初始化日期数量,必须是奇数
  MAX_SLIDE_DAYS: number = 9; // 最大日期数量,必须是奇数
  days: Array<number> = new Array<number>();
  day: moment.Moment;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtr: ModalController,
              private emitService: EmitService,
              private daService: DaService,
              private util: UtilService,
              private feedback: FeedbackService,
              private sqlite:SqliteExec) {
    moment.locale('zh-cn');

    this.currentday = this.navParams.data;

    //初始化当前选中日期之前的日期
    for (let i = parseInt((this.MIN_SLIDE_DAYS / 2).toFixed()); i > 0; i--) {
      let preday = moment(this.currentday.time).subtract(i, "days");
      this.days.push(preday.unix() * 1000);
    }

    this.day = moment(this.currentday.time);
    this.days.push(this.day.unix() * 1000);

    //初始化当前选中日期之后的日期
    for (let i = 1; i <= parseInt((this.MIN_SLIDE_DAYS / 2).toFixed()); i++) {
      let nextday = moment(this.currentday.time).add(i, "days");
      this.days.push(nextday.unix() * 1000);
    }

    this.currentdayofweek = this.day.format('dddd');
    this.currentdayshow = this.day.format('MMMM D');
  }

  ionViewDidLoad() {
  }

  getData(target: any, day: number) {
    let currentIndex = this.slides.getActiveIndex();
    // 初始化的时候获取不到当前索引，使用默认索引号
    currentIndex = currentIndex? currentIndex : 1;

    this.daService.currentShow(day).then(d => {
      // 清空原有数据
      target.todaylist.length = 0;
      target.scdlist.length = 0;

      if (d && d.length > 0) {
        for (let line of d) {
          if (line.gs == '3' || line.gs == '4') {
            target.todaylist.push(line);
          } else {
            target.scdlist.push(line);
          }
        }
      }

      //没有日程的时候，不显示语音播报按钮
      if (day == this.days[currentIndex]) {
        this.cardlist = this.cardlists.toArray()[currentIndex];

        if (this.cardlist.scdlist.length > 0 || this.cardlist.todaylist.length > 0) {
          this.hasContents = true;
        } else {
          this.hasContents = false;
        }
      }

      this.isMobile = this.util.isMobile();
    });
  }

  gotoDetail(data: any) {
    let target: CardListComponent = data.target;
    let scd: ScdData = data.value;

    let p: ScdPageParamter = new ScdPageParamter();
    p.si = scd.si;
    p.d = moment(scd.sd);
    p.gs = scd.gs;

    this.feedback.audioClick();
    if (scd.gs == "0") {
      //本人画面
      let modal = this.modalCtr.create(DataConfig.PAGE._TDDJ_PAGE, p);

      modal.onDidDismiss((data)=>{
        target.refresh();

        if (target.scdlist.length > 0 || target.todaylist.length > 0) {
          this.hasContents = true;
        } else {
          this.hasContents = false;
        }
      });

      modal.present();
    } else if (scd.gs == "1") {
      //受邀人画面
      this.modalCtr.create(DataConfig.PAGE._TDDI_PAGE, p).present();
    } else {
      //系统画面
      this.modalCtr.create(DataConfig.PAGE._TDDS_PAGE, p).present();
    }
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();

    if (currentIndex >= this.days.length) {
      return;
    }

    this.day = moment(this.days[currentIndex]);
    this.cardlist = this.cardlists.toArray()[currentIndex];

    this.currentdayofweek = this.day.format('dddd');
    this.currentdayshow = this.day.format('MMMM D');

    if (this.cardlist.scdlist.length > 0 || this.cardlist.todaylist.length > 0) {
      this.hasContents = true;
    } else {
      this.hasContents = false;
    }
  }

  slideNextEnd() {
    let currentIndex = this.slides.getActiveIndex();

  }

  slidePrevEnd() {
    let currentIndex = this.slides.getActiveIndex();

  }

  play() {
    this.speaking = true;

    //每日简报消息回调
    this.emitService.register('on.speak.finished', (data) => {
      this.speaking = false;
    });

    if (this.cardlist.scdlist && this.cardlist.scdlist.length > 0)
      this.daService.speakDailySummary(this.day, this.cardlist.scdlist);
    else
      this.daService.speakDailySummary(this.day, this.cardlist.todaylist);
  }

  pause() {
    this.daService.stopSpeak();
  }

  goNew() {
    let p: ScdPageParamter = new ScdPageParamter();
    p.d = this.day;
    this.feedback.audioPress();

    let modal = this.modalCtr.create(DataConfig.PAGE._TDC_PAGE, p);
    modal.onDidDismiss((data)=>{
      this.cardlist.refresh();

      if (this.cardlist.scdlist.length > 0 || this.cardlist.todaylist.length > 0) {
        this.hasContents = true;
      } else {
        this.hasContents = false;
      }
    });
    modal.present();
  }

  goBack() {
    this.navCtrl.pop();
  }
}
