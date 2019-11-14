import {ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {
  Content,
  DomController,
  GestureController,
  IonicPage,
  MenuController,
  Platform,
  ScrollEvent,
} from 'ionic-angular';
import {TdlService} from "./tdl.service";
import {DataConfig} from "../../service/config/data.config";
import * as moment from "moment";
import {EmitService} from "../../service/util-service/emit.service";
import {ScdPageParamter} from "../../data.mapping";
import {UtilService} from "../../service/util-service/util.service";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {CalendarService, MonthActivityData} from "../../service/business/calendar.service";
import {EventService} from "../../service/business/event.service";
import {
  EventFinishStatus,
  EventType,
  InviteState,
  ModalTranType,
  PageDirection,
  PlanItemType,
  SelfDefineType,
  SyncType
} from "../../data.enum";
import {TdlGesture} from "./tdl-gestures";
import {CalendarComponent} from "../../components/ion2-calendar";
import {UserConfig} from "../../service/config/user.config";
import BScroll from '@better-scroll/core'
import InfinityScroll from '@better-scroll/infinity'

BScroll.use(InfinityScroll);

/**
 * Generated class for the 日程列表 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tdl',
  template:
      `
    <!--<div class="header-set">-->
    <!--<div class="daynav">-->
    <!--<div class="dayheader">-->

    <!--<div class="d-fsize ">{{headerDate | formatedate :"CWEEK"}}</div>-->
    <!--<div class="ym-fsize  ">{{headerDate | formatedate:"DD"}}</div>-->
    <!--&lt;!&ndash;<div class="ys-fsize  " *ngFor="let jt of headerData.jtl" (click)="toDetail(jt.si,jt.sd,'3')">{{jt.spn}}</div>&ndash;&gt;-->
    <!--</div>-->
    <!--<div class="d-title  ">-->
    <!--<div class="first d-title-chr">日记</div>-->
    <!--<div class=" d-title-chr">10条日程</div>-->
    <!--<div class=" d-title-chr">10条任务</div>-->
    <!--<div class=" d-title-chr">10条任务</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->

    <ion-content #contentD class="monthActivityWapper">
      <div style="height: 10000px"></div>
      <ion-grid #grid4Hight class="list-grid-content">
        <ng-template ngFor let-monthActivityData [ngForOf]="monthActivityDatas">
          <ion-row class="item-content dayagenda-month {{monthActivityData.month  | transfromdate :'CSSMM'}}"
                   id="month{{monthActivityData.month | formatedate:'YYYYMM'}}">
            <div class="line first-line">
              <p class="month-a font-large">
                {{monthActivityData.month  | formatedate :"CYYYY/MM/ND"}}
              </p>
            </div>
            <div class="line font-normal">
              <p class="month-b">
                {{monthActivityData.month  | formatmonthstring :"string"}}
              </p>
            </div>
          </ion-row>
          <ng-template ngFor let-days [ngForOf]="monthActivityData.arraydays">
            <ion-row class="item-content dayagenda-week" *ngIf="(days.day | formatedate:'DWEEK') == 0">
              <div class="line">
                <p>
                  {{days.day | formatedate :"CYYYY/MM/DD"}}-{{days.day | formatedate :"ADD7CYYYY/MM/DD"}}
                </p>
              </div>
            </ion-row>
            <ng-template [ngIf]="days.events.length > 0 || days.calendaritems.length > 0 || days.memos.length > 0 "
                         [ngIfElse]="noscd">
              <ion-row class="item-content dayagenda-nav" id="day{{days.day | formatedate:'YYYYMMDD'}}">
                <div class="line">
                  <div class="dayheader">
                    <div class="d-fsize">{{days.day | formatedate :"CWEEK"}}</div>
                    <div class="ym-fsize">{{days.day | formatedate:"CDD"}}</div>
                    <div class="ys-fsize">{{days.day | formatedate:"CMM"}}</div>
                  </div>
                  <div class="d-title  ">
                    <div class="d-title-chr">
                      <p>{{this.util.lunar4str(days.day, "d")}}
                      </p>
                      <p>{{this.util.lunar4str(days.day, "M")}}</p>
                    </div>
                    <div class=" d-title-chr"><span>{{days.events.length}}</span> 活动</div>
                    <div class=" d-title-chr"><span>{{days.calendaritems.length}}</span> 纪念日</div>
                    <div class=" d-title-chr mome " (click)="toMemo(days)">
                      <ion-icon class="fad fa-book-heart" [class.item-no-display]="days.memos.length == 0"></ion-icon>
                      <!--<span>{{days.memos.length}}</span>-->
                      <div class="weather" *ngIf="days.weather">
                        <ion-icon class='fal {{days.weather.jtn | formatweather:"winame-with-json"}}'></ion-icon>
                        <span>
                       {{days.weather.ext | formatweather:  'centigrade-with-json'}}
                      </span>
                        <!--<span>-->
                      <!--{{days.weather.jtn}}-->
                      <!--</span>-->
                      </div>
                    </div>
                  </div>
                </div>
               
              </ion-row>

              <ion-row class="item-content  calendaritem-content item-content-backgroud "
                       [class.item-content-hasmessage]="false"
                       *ngFor="let jt of days.calendaritems;" (click)="toPlanItem(jt)"
                       [class.noinvite]="currentuser != jt.ui && jt.ui != '' && jt.invitestatus != inviteaccept && jt.invitestatus != invitereject">
                <!-- 自定义日历项 -->
                <ng-container *ngIf="jt.jtc == selfdefine">
                  <!--<div class="line font-small first-line">-->
                  <!--<div class="icon">-->
                  <!--<ion-icon class = "fal fa-gift"></ion-icon>-->
                  <!--</div>-->
                  <!--<div class="sn">{{jt.jtn}}</div>-->
                  <!--</div>-->
                  <!--<div class="line font-small" *ngIf="currentuser != jt.ui && jt.ui != ''" [ngStyle]="{'margin-left': jt.ji == ''? '0.6rem' : '0'}">-->
                  <!--<div class="icon">-->
                  <!--<ion-icon class = "fal fa-user-tag"></ion-icon>-->
                  <!--</div>-->
                  <!--<div class="person ">&#45;&#45;来自{{jt.ui | formatuser: currentuser: friends}}</div>-->
                  <!--<div class="invite" *ngIf="jt.invitestatus != inviteaccept && jt.invitestatus != invitereject" end><span (click)="rejectInvite($event, event)">拒绝</span><span (click)="acceptInvite($event, event)">接受</span></div>-->
                  <!--<div class="plan" end><span [ngStyle]="{'color': event.ji == ''? 'transparent' : (event.ji | formatplan: 'color': privateplans )}"  >{{event.ji | formatplan: 'name': '': privateplans}}</span></div>-->
                  <!--</div>-->
                  <div class="line font-small first-line">
                    <!--<div class="icon">-->
                    <!--<ion-icon class="fal fa-gift"></ion-icon>-->
                    <!--</div>-->

                    <div class="sn">{{jt.jtn}}</div>
                  </div>
                  <!--<div class="line font-small" *ngIf="currentuser != jt.ui && jt.ui != ''">-->
                  <!--&lt;!&ndash;<div class="icon">&ndash;&gt;-->
                  <!--&lt;!&ndash;<ion-icon class="fal fa-user-tag"></ion-icon>&ndash;&gt;-->
                  <!--&lt;!&ndash;</div>&ndash;&gt;-->
                  <!--<div class="person ">-{{jt.ui | formatuser: currentuser: friends}}</div>-->
                  <!--<div class="invite" *ngIf="jt.invitestatus != inviteaccept && jt.invitestatus != invitereject" end>-->
                  <!--<span (click)="rejectInvite($event, event)">拒绝</span><span (click)="acceptInvite($event, event)">接受</span>-->
                  <!--</div>-->
                  <!--</div>-->
                  <div class="line font-small">
                    <div class="person" *ngIf="currentuser != jt.ui && jt.ui != ''">
                      -- {{jt.ui | formatuser: currentuser: friends}}</div>
                    <div class="person" *ngIf="currentuser == jt.ui">自己</div>
                    <!--<div class="invite" *ngIf="event.invitestatus != inviteaccept && event.invitestatus != invitereject"-->
                    <!--end><span (click)="rejectInvite($event, event)">拒绝</span><span-->
                    <!--(click)="acceptInvite($event, event)">接受</span></div>-->
                    <div class="icon font-small" end>
                      <ion-icon class="fad fa-lock" *ngIf="jt.todolist == '0'"></ion-icon>
                      <ion-icon class="fad fa-user-tag" *ngIf="currentuser != jt.ui && jt.ui != ''"></ion-icon>
                      <ion-icon class="fad fa-check-double" *ngIf="jt.wc == finished"></ion-icon>
                      <ion-icon class="fad fa-sync" *ngIf="jt.tb == synch"></ion-icon>
                    </div>
                  </div>

                  <div class="plan plan-right"
                       [ngStyle]="{'background-color': jt.ji == ''? 'transparent' : (jt.ji | formatplan: 'color': privateplans )}">
                    <span>{{jt.ji | formatplan: 'name': '': privateplans}}</span></div>

                </ng-container>

                <!-- 下载日历项 -->
                <ng-container *ngIf="jt.jtc == system">
                  <div class="line font-small first-line">
                    <!--<div class="icon">-->
                    <!--<ion-icon class="fal fa-gift"></ion-icon>-->
                    <!--</div>-->
                    <div class="sn">{{jt.jtn}}</div>
                  </div>
                </ng-container>
              </ion-row>
              <!--<ion-row class="item-content dayagenda-content item-content-backgroud" *ngFor="let event of days.events;" [ngStyle]="{'background-color': event.tb == synch? '#00ff80' : '#ff80c0'}" (click)="toDetail(event.evi,event.evd,event.type,event.gs)">-->
              <!--<ion-row class="item-content dayagenda-content item-content-backgroud" *ngFor="let event of days.events;" [ngStyle]="{'border-left': event.ji == ''? '0' : ('0.6rem solid ' + (event.ji | formatplan: 'color': privateplans))}" (click)="toDetail(event.evi,event.evd,event.type,event.gs)">-->
              <!--<div class="line font-small first-line" [ngStyle]="{'margin-left': event.ji == ''? '0.6rem' : '0'}">-->
              <!--<div class="icon">-->
              <!--<ion-icon class = "fal fa-calendar-star"></ion-icon>-->
              <!--</div>-->
              <!--<div class="sn" *ngIf="event.wc == finished"><s>{{event.evn}}</s></div>-->
              <!--<div class="sn" *ngIf="event.wc != finished">{{event.evn}}</div>-->
              <!--</div>-->
              <!--<div class="line font-small" [ngStyle]="{'margin-left': event.ji == ''? '0.6rem' : '0'}">-->
              <!--<div class="icon">-->
              <!--<ion-icon class = "fal fa-alarm-exclamation "></ion-icon>-->
              <!--</div>-->
              <!--<div class="st">{{event.evt}}</div>-->

              <!--<div class="icon" end>-->
              <!--<ion-icon class = "fal fa-sync" *ngIf = "event.tb == synch"></ion-icon>-->
              <!--</div>-->
              <!--</div>-->
              <!--<div class="line font-small" *ngIf="currentuser != event.ui && event.ui != ''" [ngStyle]="{'margin-left': event.ji == ''? '0.6rem' : '0'}">-->
              <!--<div class="icon ">-->
              <!--<ion-icon class = "user-o fal fa-user-tag"></ion-icon>-->
              <!--</div>-->
              <!--<div class="person">&#45;&#45;来自{{event.ui | formatuser: currentuser: friends}}</div>-->
              <!--<div class="invite" *ngIf="event.invitestatus != inviteaccept && event.invitestatus != invitereject" end><span (click)="rejectInvite($event, event)">拒绝</span><span (click)="acceptInvite($event, event)">接受</span></div>-->
              <!--<div class="plan" end><span [ngStyle]="{'color': event.ji == ''? 'transparent' : (event.ji | formatplan: 'color': privateplans )}"  >{{event.ji | formatplan: 'name': '': privateplans}}</span></div>-->
              <!--</div>-->
              <!--&lt;!&ndash;<div class="syncing">&ndash;&gt;-->
              <!--&lt;!&ndash;<div class="hand">&ndash;&gt;-->
              <!--&lt;!&ndash;<div class="finger"></div>&ndash;&gt;-->
              <!--&lt;!&ndash;<div class="finger"></div>&ndash;&gt;-->
              <!--&lt;!&ndash;<div class="finger"></div>&ndash;&gt;-->
              <!--&lt;!&ndash;<div class="finger"></div>&ndash;&gt;-->
              <!--&lt;!&ndash;</div>&ndash;&gt;-->
              <!--&lt;!&ndash;</div>&ndash;&gt;-->
              <!--</ion-row>-->
              <ng-container *ngFor="let event of days.events;">
                <ion-row class="item-content dayagenda-content item-content-backgroud "
                         [class.item-content-hasmessage]="false"
                         *ngIf="!(event.ui != currentuser && event.rtevi && event.invitestatus != inviteaccept && event.invitestatus != invitereject)"
                         (click)="toDetail(event.evi,event.evd,event.type,event.gs)"
                         [class.noinvite]="currentuser != event.ui && event.ui != '' && event.invitestatus != inviteaccept && event.invitestatus != invitereject">
                  <div class="line font-small first-line">
                    <div class="sn">{{event.evn}}</div>
                  </div>
                  <div class="line font-small">
                    <div class="st">{{event.evt}}</div>
                    <div class="person" *ngIf="currentuser != event.ui && event.ui != ''" end>
                      -- {{event.ui | formatuser: currentuser: friends}} ({{event.apn}} / {{event.pn}}, {{event.fj}})</div>
                    <div class="person" *ngIf="currentuser == event.ui" end>自己 ({{event.apn}} / {{event.pn}}, {{event.fj}})</div>
                  </div>
                  <div class="line font-small">
                    <!--<div class="person" *ngIf="currentuser != event.ui && event.ui != ''">-->
                      <!--来自：{{event.ui | formatuser: currentuser: friends}} ({{event.apn}} / {{event.pn}}, {{event.fj}})</div>-->
                    <!--<div class="person" *ngIf="currentuser == event.ui">自己 ({{event.apn}} / {{event.pn}}, {{event.fj}})</div>-->
                    <!--<div class="invite" *ngIf="event.invitestatus != inviteaccept && event.invitestatus != invitereject"-->
                    <!--end><span (click)="rejectInvite($event, event)">拒绝</span><span-->
                    <!--(click)="acceptInvite($event, event)">接受</span></div>-->
                    <div class="font-small" >
                      <ion-icon class="fal fa-cloud-upload" *ngIf="event.tb == synch"></ion-icon>
                    </div>
                    

                    <div class="icon font-small" end>
                      <ion-icon class="fad fa-lock" *ngIf="event.todolist == '0'"></ion-icon>
                      <ion-icon class="fad fa-user-tag" *ngIf="currentuser != event.ui && event.ui != ''"></ion-icon>
                      <ion-icon class="fad fa-check-double" *ngIf="event.wc == finished"></ion-icon>
                      <ion-icon class="fad fa-sync" *ngIf="event.tb == synch"></ion-icon>
                      <ion-icon class="fad fa-lock" *ngIf="event == '0'"></ion-icon>
                    </div>
                  </div>

                  <div class="plan plan-right"
                       [ngStyle]="{'background-color': event.ji == ''? 'transparent' : (event.ji | formatplan: 'color': privateplans )}">
                    <span>{{event.ji | formatplan: 'name': '': privateplans}}</span></div>

                  <!--<div class="syncing">-->
                  <!--<div class="hand">-->
                  <!--<div class="finger"></div>-->
                  <!--<div class="finger"></div>-->
                  <!--<div class="finger"></div>-->
                  <!--<div class="finger"></div>-->
                  <!--</div>-->
                  <!--</div>-->
                </ion-row>
              </ng-container>

            </ng-template>

            <ng-template #noscd>
              <ion-row class="item-content no-content item-no-display" id="day{{days.day | formatedate:'YYYYMMDD'}}">
                <div class="line" (click)="toAdd(days.day)">
                  <p>{{days.day | formatedate :"CYYYY/MM/DD"}}</p>
                </div>
              </ion-row>
            </ng-template>
          </ng-template>
        </ng-template>
      </ion-grid>
    </ion-content>
  `


})
export class TdlPage {

  @ViewChild('contentD') contentD: Content;
  @ViewChild('grid4Hight') grid: ElementRef;


  option = {
    isgetData: false,
    loopmonth: false,
    canscroll: false,
  };


  listmonth: moment.Moment = moment(moment().format("YYYYMM") + "01");

  _gesture: TdlGesture;


  currDayel: any;


  //画面数据List
  monthActivityDatas: Array<MonthActivityData> = new Array<MonthActivityData>();

  currentuser: string = UserConfig.account.id;
  friends: Array<any> = UserConfig.friends;

  privateplans: Array<any> = UserConfig.privateplans;

  inviteaccept: InviteState = InviteState.Accepted;
  invitereject: InviteState = InviteState.Rejected;

  system: SelfDefineType = SelfDefineType.System;
  selfdefine: SelfDefineType = SelfDefineType.Define;

  holiday: PlanItemType = PlanItemType.Holiday;
  activity: PlanItemType = PlanItemType.Activity;
  weather: PlanItemType = PlanItemType.Weather;

  synch: SyncType = SyncType.synch;
  unsynch: SyncType = SyncType.unsynch;

  finished: EventFinishStatus = EventFinishStatus.Finished;

  constructor(private tdlServ: TdlService,
              private menuController: MenuController,
              private emitService: EmitService,
              private el: ElementRef,
              private util: UtilService,
              private feedback: FeedbackService,
              private renderer2: Renderer2,
              private calendarService: CalendarService,
              private eventService: EventService,
              private _plt: Platform,
              private _gestureCtrl: GestureController,
              private _domCtrl: DomController,
              public changeDetectorRef: ChangeDetectorRef
  ) {
  }

  getNativeElement(): any {
    return this.contentD._scrollContent.nativeElement;
  }

  // ngAfterViewChecked() {
  // console.log("downdowndowndownngAfterViewChecked");
  // }
  //
  // ngOnChanges() {
  //   console.log("downdowndowndownngOnChanges" );
  // }
  //
  // ngOnInit() {
  //   console.log("downdowndowndownngOnInit");
  // }
  //
  // ngDoCheck() {
  //   console.log("downdowndowndownngDoCheck"  );
  // }
  //
  // ngAfterContentChecked() {
  //   console.log("downdowndowndownngAfterContentChecked");
  // }


  setScroll(scroll: boolean) {
    this.option.canscroll = scroll;
    if (scroll) {
      this.renderer2.setStyle(this.contentD._scrollContent.nativeElement, "overflow-y", "auto");
      this._gesture.unlisten();

    } else {
      this.renderer2.setStyle(this.contentD._scrollContent.nativeElement, "overflow-y", "hidden");
      this._gesture.listen();
    }

  }

  regeditCalendar(calda: CalendarComponent) {
    this._gesture = new TdlGesture(this._plt, this, this._gestureCtrl, this._domCtrl, calda);
    this._gesture.listen();
  }


  ngAfterViewInit() {
    this.tdlServ.initLsData().then(data => {
      this.monthActivityDatas = data;
      this.gotoEl("#day" + moment().format("YYYYMMDD"));
    });

    // this.contentD.enableJsScroll();

    this.emitService.registerSelectDate((selectDate: moment.Moment) => {
      this.gotoEl("#day" + selectDate.format("YYYYMMDD"));

    });

    this.emitService.register("calendar.change.month", ($data) => {
      this.gotoEl4month("#month" + $data);
      this.listmonth = moment($data + "01");
    });
    setTimeout(() => {

      this.contentD.ionScroll.subscribe(($event: ScrollEvent) => {
        try {


          if (!$event) return;

          //显示当前顶部滑动日期
          if (!this.option.loopmonth) {
            this.option.loopmonth = !this.option.loopmonth;
            for (let i = this.monthActivityDatas.length - 1; i >= 0; i--) {
              //let monthActivityData = this.monthActivityDatas[0];
              let monobj = moment(this.monthActivityDatas[i].month + "/01");
              let key = "#month" + monobj.format("YYYYMM");
              let el = this.el.nativeElement.querySelector(key);
              // if (el && $event.scrollTop - el.offsetTop < el.clientHeight && $event.scrollTop - el.offsetTop > 0) {
              if (el && $event.scrollTop - el.offsetTop > 0) {
                //this.headerDate = moment(scdlData.d).format("YYYY/MM/DD");
                //this.headerMoment = moment(scdlData.d);
                //this.feedback.audioTrans();
                this.option.loopmonth = !this.option.loopmonth;

                //准备发出emit
                if (this.option.canscroll) {
                  if (this.listmonth.isBefore(monobj)) {
                    this.emitService.emit("list.change.month", "next");
                  }
                  if (this.listmonth.isAfter(monobj)) {
                    this.emitService.emit("list.change.month", "prev");
                  }

                }
                this.listmonth = monobj;
                break;
              }
            }


          }

          if (this.option.isgetData) return;

          if ($event.directionY == 'up') {

            if ($event.scrollTop < 10000) {
              this.contentD.scrollTo(0, 10100, 100);
              return;
            }

            if ($event.scrollTop < 11000) {
              // this.contentD._scroll.stop();
              // this.setScroll(false);
              this.option.isgetData = true;

              this.tdlServ.throughData(PageDirection.PageDown).then(data => {
                // this.gotoEl4month(scdId);
                // console.log($event.directionY + "11111down");

                this.changeDetectorRef.markForCheck();
                this.changeDetectorRef.detectChanges();
                this.option.isgetData = false;

                // this.setScroll(true);
                // setTimeout(()=>{

                // this.setScroll(false);
                // this.isgetData  = !this.isgetData;
                // },200);
              })
            }
          }

          if ($event.directionY == 'down') {
            // console.log("***********************" + $event.scrollTop)
            if ($event.scrollTop + 1000 > this.grid.nativeElement.clientHeight - $event.scrollElement.clientHeight) {

              this.option.isgetData = true;

              this.tdlServ.throughData(PageDirection.PageUp).then(data => {

                this.changeDetectorRef.markForCheck();
                this.changeDetectorRef.detectChanges();
                this.option.isgetData = false;
              })
            }
          }

        } catch (e) {
          console.log(e);

        }

        // //显示当前顶部滑动日期
        // for (let scdlData of this.monthActivityDatas) {
        //   let el = this.el.nativeElement.querySelector("#day" + scdlData.id);
        //   if (el && $event.scrollTop - el.offsetTop < el.clientHeight && $event.scrollTop - el.offsetTop > 0) {
        //     this.headerDate = moment(scdlData.d).format("YYYY/MM/DD");
        //     this.headerMoment = moment(scdlData.d);
        //     //this.feedback.audioTrans();
        //     break;
        //   }
        // }

      });
    }, 2000);

    new BScroll('.monthActivityWapper', {
      scrollY: true,
      disableMouse: false,
      disableTouch: true
      // infinity: {
      //   fetch(count) {
      //     // 获取大于 count 数量的数据，该函数是异步的，它需要返回一个 Promise。
      //     // 成功获取数据后，你需要 resolve 数据数组（也可以 resolve 一个 Promise）。
      //     // 数组的每一个元素是列表数据，在 render 方法执行的时候会传递这个数据渲染。
      //     // 如果没有数据的时候，你可以 resolve(false)，来告诉无限滚动列表已经没有更多数据了。
      //   }
      //   render(item, div) {
      //     // 渲染每一个元素节点，item 是数据，div 是包裹元素节点的容器。
      //     // 该函数需要返回渲染后的 DOM 节点。
      //   },
      //   createTombstone() {
      //     // 返回一个墓碑 DOM 节点。
      //   }
      // }
    })
  }

  gotoEl(id) {
    setTimeout(() => {
      try {
        if (this.currDayel && this.currDayel.className.indexOf("no-content") > -1) {
          this.renderer2.removeClass(this.currDayel, "item-display");
          this.renderer2.addClass(this.currDayel, "item-no-display");
        }
        this.currDayel = this.el.nativeElement.querySelector(id);
        //
        if (this.currDayel && this.currDayel.className.indexOf("no-content") > -1) {
          this.renderer2.removeClass(this.currDayel, "item-no-display");
          this.renderer2.addClass(this.currDayel, "item-display");
        }


        if (this.currDayel) {
          this.contentD.scrollTo(0, this.currDayel.offsetTop + 2, 300);
        } else {
          this.gotoEl(id);
        }
      } catch (e) {
      }

    }, 200);
  }

  gotoEl4month(id) {
    setTimeout(() => {
      try {
        let currmonthel = this.el.nativeElement.querySelector(id);

        if (currmonthel) {
          this.contentD.scrollTo(0, currmonthel.offsetTop + 2, 300);
        } else {
          this.gotoEl4month(id);
        }
      } catch (e) {
        console.log(e)
      }
    }, 200);

  }

  toMemo(day) {

    this.util.createModal(DataConfig.PAGE._DAILYMEMOS_PAGE, day,ModalTranType.scale).present();
  }

  toPlanItem(item) {
    let p: ScdPageParamter = new ScdPageParamter();
    p.si = item.jti;


    this.util.createModal(DataConfig.PAGE._COMMEMORATIONDAY_PAGE, p,ModalTranType.scale).present();
  }

  async acceptInvite($event, event) {
    $event.stopPropagation();  // 阻止冒泡
    $event.preventDefault(); // 忽略事件传递
    event.invitestatus = InviteState.Accepted;

    if (event && !event.type && event.jti) {
      await this.calendarService.acceptReceivedPlanItem(event.jti);
    }
    if (event && event.type == EventType.Agenda) {
      await this.eventService.acceptReceivedAgenda(event.evi);
    }
  }

  async rejectInvite($event, event) {
    $event.stopPropagation();  // 阻止冒泡
    $event.preventDefault(); // 忽略事件传递
    event.invitestatus = InviteState.Rejected;

    if (event && !event.type && event.jti) {
      await this.calendarService.rejectReceivedPlanItem(event.jti);
    }
    if (event && event.type == EventType.Agenda) {
      await this.eventService.rejectReceivedAgenda(event.evi);
    }
  }

  toDetail(si, d, type, gs) {

    let p: ScdPageParamter = new ScdPageParamter();
    p.si = si;
    p.d = moment(d);
    p.gs = gs;

    this.feedback.audioClick();
    if (gs == "0") {
      //本人画面
      if (type == EventType.Agenda) {

        this.util.createModal(DataConfig.PAGE._AGENDA_PAGE, p,ModalTranType.scale).present();
      }
      if (type == EventType.Task) {
        // this.modalCtr.create(DataConfig.PAGE._TASK_PAGE, p).present();
      }
    } else if (gs == "1") {
      //受邀人画面
      this.util.createModal(DataConfig.PAGE._AGENDA_PAGE, p,ModalTranType.scale).present();
    } else {
      //系统画面
      // this.modalCtr.create(DataConfig.PAGE._TDDS_PAGE, p).present();
    }

  }

  toAdd(d) {
    let p: ScdPageParamter = new ScdPageParamter();
    p.d = moment(d);
    this.feedback.audioClick();
    this.util.createModal(DataConfig.PAGE._AGENDA_PAGE, p,ModalTranType.scale).present();
  }

}
