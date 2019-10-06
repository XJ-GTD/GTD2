import {Component, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, MenuController, ModalController, NavController, Platform} from 'ionic-angular';
import {CalendarComponent, CalendarComponentOptions, CalendarDay} from "../../components/ion2-calendar";
import {HService} from "./h.service";
import * as moment from "moment";
import {AiComponent} from "../../components/ai/answer/ai";
import {EmitService} from "../../service/util-service/emit.service";
import {HData, ScdPageParamter} from "../../data.mapping";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {DataConfig} from "../../service/config/data.config";
import {UserConfig} from "../../service/config/user.config";
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {EventService} from "../../service/business/event.service";
import {EffectService} from "../../service/business/effect.service";
import {MemoData, MemoService} from "../../service/business/memo.service";
import {SettingsProvider} from "../../providers/settings/settings";
import {AipPage} from "../aip/aip";
import {TdlPage} from "../tdl/tdl";
import {TestDataService} from "../../service/testData.service";

/**
 * Generated class for the 首页 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-h',
  template: `
    <ion-content>
        <ion-calendar #calendar
                      [options]="options"
                      (onSelect)="onSelect($event)"
                      (onPress)="onPress($event)"
                      (viewShow) = "viewShow($event)">
        </ion-calendar>
      
        <page-tdl #tdl ></page-tdl>
      <ion-fab bottom right class="shortcut">
        <button ion-fab mini>
          <ion-icon name="add"></ion-icon>
        </button>
        <ion-fab-list side="top">        
          <button ion-fab (click)="todoList()">
            重要
          </button>
          <!--<button ion-fab (click)="todoscrumList()">-->
            <!--<ion-icon name="clock" color="danger"></ion-icon>-->
          <!--</button>-->
          <button ion-fab  (click)="newcd()">
            活动
          </button>
          <button ion-fab  (click)="newpi()">
            日历项
          </button>
          <button ion-fab  (click)="toMemo()">
            备忘
          </button>
          <button ion-fab  (click)="testDate()">
            测试
          </button>
        </ion-fab-list>
      </ion-fab>
      <ion-fab bottom right>
        <button ion-fab mini (click)="openAi()">
          <ion-icon name="chatbubbles"></ion-icon>
        </button>
      </ion-fab>
    </ion-content>
  `,
})
export class HPage {
  @ViewChild('aiDiv')
  aiDiv: AiComponent;
  @ViewChild('calendar')
  calendar: CalendarComponent;
  @ViewChild('tdl')
  tdl: TdlPage;
  selectedTheme: string;

  aiready: boolean = false;

  hdata: HData;
  options: CalendarComponentOptions = {
    pickMode: 'single',
    from: new Date(1900, 0, 1),
    to: new Date(2299, 0, 1),
    daysConfig: []
  };


  constructor(private hService: HService,
              private iab: InAppBrowser,
              private navController: NavController,
              private renderer2: Renderer2,
              private modalCtr: ModalController,
              private menuController: MenuController,
              private emitService: EmitService,
              private feedback: FeedbackService,
              private effectService: EffectService,
              private  evtserv: EventService,
              private sqlexce: SqliteExec, private  momserv: MemoService,
              private testDataService:TestDataService) {
    this.hdata = new HData();


  }
  viewShow($event:boolean){
    this.tdl.setScroll(!$event);
  }

  openm() {
    this.menuController.open();
  }

  openAi() {
    this.modalCtr.create(AipPage).present();
  }

  ionViewDidLoad() {
    // 初始化同步
    this.effectService.syncStart();

     this.tdl.regeditCalendar(this.calendar);
    // websocket连接成功消息回调
    this.emitService.register("on.websocket.connected", () => {
      this.aiready = true;
      DataConfig.RABBITMQ_STATUS = "connected";
    });

    // websocket断开连接消息回调
    this.emitService.register("on.websocket.closed", () => {
      this.aiready = false;
      DataConfig.RABBITMQ_STATUS = "";
    });

    //本地通知跳转共享日程页面
    this.emitService.registerNewMessageClick((data) => {

      let p: ScdPageParamter = new ScdPageParamter();
      p.si = data.id;
      p.d = moment(data.d);
      this.modalCtr.create(DataConfig.PAGE._AGENDA_PAGE, p).present();
    });

    this.emitService.registerRef(data => {
      //this.calendar.createMonth(this.calendar.monthOpt.original.time);
    });

    //极光推送跳转打开外部网页
    this.emitService.register('on.urlopen.message.click', (data) => {
      console.log("Open extend url message to show " + JSON.stringify(data));

      if (data && data.eventdata && data.eventdata.url) {
        console.log("Open href " + data.eventdata.url);
        let browser = this.iab.create(data.eventdata.url, "_system");
        //browser.show();
      }
    });

    //极光推送跳转共享日程页面
    this.emitService.register('on.agendashare.message.click', (data) => {
      console.log("Share agenda message to show " + JSON.stringify(data));

      let p: ScdPageParamter = new ScdPageParamter();
      p.si = data.si;
      p.d = moment(data.sd);
      p.gs = data.sr;
      this.modalCtr.create(DataConfig.PAGE._AGENDA_PAGE, p).present();
    });

    this.emitService.register('on.agenda.shareevents.message.click', (data) => {
      console.log("Agenda share events message to show " + JSON.stringify(data));

      let p: ScdPageParamter = new ScdPageParamter();
      p.si = data.si;
      p.d = moment(data.sd);
      this.modalCtr.create(DataConfig.PAGE._AGENDA_PAGE, p).present();
    });

    //冥王星远程服务地址刷新完成
    //更新每小时天气服务任务
    this.emitService.register('on.mwxing.global.restful.flashed', () => {
      this.hService.putHourlyWeather(UserConfig.account.id);
    });
    //初始化时自动触发一次
    this.hService.putHourlyWeather(UserConfig.account.id);

    //每日简报消息回调
    this.emitService.register('on.dailyreport.message.click', (data) => {
      console.log("Daily report message clicked.")
      let timestamp: number = data.eventdata ? data.eventdata['timestamp'] : (moment().unix() * 1000);

      if (!timestamp) {
        timestamp = moment().unix() * 1000;
      }

      this.todoList({
        time: timestamp,
        isToday: false,
        selected: false,
        disable: false,
        cssClass: ''
      });
    });

    //操作反馈消息回调
    this.emitService.register('on.feedback.message.click', (data) => {
      let scd = data.eventdata ? data.eventdata['scd'] : null;
      if (scd && scd.si) {
        this.gotodetail(scd);
      }
    });

    this.emitService.emit("on.homepage.init");
    console.log("MWxing initialized.")
  }

  onPress(pressDay) {
    this.hService.centerShow(pressDay).then(d => {
      this.hdata = d;
      this.newcd();
    })

  }


  newcd() {

//     if (1==1){
//  /*     let ev = new EvTbl();
//       this.sqlexce.dropByParam(ev);
//       this.sqlexce.createByParam(ev);*/
//
// /*     let ca =  new CaTbl();
//       this.sqlexce.dropByParam(ca);
//       this.sqlexce.createByParam(ca);*/
//
// /*      let t =  new TTbl();
//       this.sqlexce.dropByParam(t);
//       this.sqlexce.createByParam(t);*/
//
// /*      let fj =  new FjTbl();
//       this.sqlexce.dropByParam(fj);
//       this.sqlexce.createByParam(fj);*/
//
// /*      let mom =  new MomTbl();
//       this.sqlexce.dropByParam(mom);
//       this.sqlexce.createByParam(mom);*/
//
// /*      let jta =  new JtaTbl();
//       this.sqlexce.dropByParam(jta);
//       this.sqlexce.createByParam(jta);*/
//
// /*      let par =  new ParTbl();
//       this.sqlexce.dropByParam(par);
//       this.sqlexce.createByParam(par);*/
//
// /*      let mrk =  new MrkTbl();
//       this.sqlexce.dropByParam(mrk);
//       this.sqlexce.createByParam(mrk);*/
//
// /*      let jha =  new JhaTbl();
//       this.sqlexce.dropByParam(jha);
//       this.sqlexce.createByParam(jha);*/
//
// /*      let wa =  new WaTbl();
//       this.sqlexce.dropByParam(wa);
//       this.sqlexce.createByParam(wa);*/
//
//
//       /*let agdata = {} as   AgendaData;
//       agdata.evn = "测试重复日程添加0827";
//       agdata.sd = "2019/08/27";
//
//       let rtjon = new RtJson();
//       rtjon.cycletype = anyenum.CycleType.w;
//       rtjon.over.value = "2";
//       rtjon.over.type = anyenum.OverType.times;
//       rtjon.cyclenum = 3;
//       rtjon.openway = anyenum.OpenWay.Wednesday;
//
//       agdata.rtjson = rtjon;
//
//       let txjson = new TxJson();
//       txjson.type = anyenum.TxType.m30;
//       agdata.txjson = txjson;
//
//       agdata.al = "1";
//       agdata.st = "11:20";
//       agdata.ct = 20;
//       this.evtserv.saveAgenda(agdata).then(data=>{
//         console.log(JSON.stringify(data));
//       });*/
//
//       let mom = {} as MemoData;
//       this.momserv.saveMemo(mom);
//       return ;
//     }
    let p: ScdPageParamter = new ScdPageParamter();

    if (this.hdata.selectDay){
      p.d = moment(this.hdata.selectDay.time);
    }else{
      p.d = moment();
    }

    this.feedback.audioPress();
    this.modalCtr.create(DataConfig.PAGE._AGENDA_PAGE, p).present();
  }

  newpi() {
    let p: ScdPageParamter = new ScdPageParamter();

    if (this.hdata.selectDay){
      p.d = moment(this.hdata.selectDay.time);
    }else{
      p.d = moment();
    }

    this.feedback.audioPress();
    this.modalCtr.create(DataConfig.PAGE._COMMEMORATIONDAY_PAGE, p).present();
  }

//查询当天日程
  onSelect(selectDay
             :
             CalendarDay
  ) {
    this.feedback.audioClick();
    if (selectDay) this.emitService.emitSelectDate(moment(selectDay.time));
    this.hService.centerShow(selectDay).then(d => {
      //双机进入列表
      if (this.hdata.selectDay == selectDay && selectDay) {
        this.gotolist();
      }
      this.hdata = d;
    })
  }

  todoList(day ?: CalendarDay) {
    let selectDay: CalendarDay = day ? day : this.hdata.selectDay;

    this.modalCtr.create(DataConfig.PAGE._DO_PAGE, selectDay).present();
  }

  todoscrumList(day ?: CalendarDay) {
    let selectDay: CalendarDay = day ? day : this.hdata.selectDay;

    // this.modalCtr.create(DataConfig.PAGE._DOSCRUM_PAGE, selectDay).present();
  }

  gotolist() {
    this.menuController.open("ls");
    //this.navController.push(DataConfig.PAGE._TDL_PAGE, {selectDay: this.hdata.selectDay.time});
  }

  gotojt(jt) {
    let p: ScdPageParamter = new ScdPageParamter();
    p.si = jt.si;
    p.d = moment(jt.sd);
    p.gs = "3";

    this.modalCtr.create(DataConfig.PAGE._AGENDA_PAGE, p).present();
  }

  gotodetail(scd) {
    let p: ScdPageParamter = new ScdPageParamter();
    p.si = scd.si;
    p.d = moment(scd.sd);
    p.gs = scd.gs;

    if (scd.gs == "0") {
      //本人画面
      this.modalCtr.create(DataConfig.PAGE._AGENDA_PAGE, p).present();
    } else if (scd.gs == "1") {
      //受邀人画面
      this.modalCtr.create(DataConfig.PAGE._AGENDA_PAGE, p).present();
    } else {
      //系统画面
      this.modalCtr.create(DataConfig.PAGE._AGENDA_PAGE, p).present();
    }
  }

  testDate(){
    this.testDataService.createcal();
  }

  toMemo() {


    let day: string = moment().format("YYYY/MM/DD");
    let modal = this.modalCtr.create(DataConfig.PAGE._MEMO_PAGE, {day: day});
    modal.onDidDismiss(async (data) => {
      if (data && data.memo && typeof data.memo === 'string') { // 创建新备忘
        let memo: MemoData = {} as MemoData;

        memo.sd = data.day;
        memo.mon = data.memo;

        await this.momserv.saveMemo(memo);
      }
    });
    modal.present();
  }

}
