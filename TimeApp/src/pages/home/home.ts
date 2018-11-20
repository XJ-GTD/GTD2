import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { WebsocketService } from "../../service/websocket.service";
import { ParamsService } from "../../service/params.service";
import { XiaojiAlarmclockService } from "../../service/xiaoji-alarmclock.service";
import { HttpClient } from "@angular/common/http";
import { AppConfig } from "../../app/app.config";
import { RemindModel } from "../../model/remind.model";
import { ScheduleModel } from "../../model/schedule.model";
import { ScheduleOutModel } from "../../model/out/schedule.out.model";
import { CalendarModel } from "../../model/calendar.model";
import {CalendarComponent, CalendarComponentOptions, CalendarController} from "../../components/ion2-calendar";
import { TimeModel } from "../../model/time.model";
import {HomeWorkListPage} from "../home-work-list/home-work-list";
import * as moment from "moment";
import {SuperTabsComponent} from "../../components/ionic2-super-tabs";
import {LightSvgPage} from "../light-svg/light-svg";
import {CalendarService} from "../../service/calendar.service";
import {BaseSqliteService} from "../../service/sqlite-service/base-sqlite.service";




/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: []
})
export class HomePage {

  // page1:any = 'HomeWorkListPage';
  // page2:any = 'HomeWorkListPage';
  // page3:any = 'HomeWorkListPage';
  @ViewChild(CalendarComponent) ion2calendar:CalendarComponent;

  @ViewChild(HomeWorkListPage) homeWorkListPage:HomeWorkListPage;

  tab1Root = 'SpeechPage';
  data: any;
  remindScheduleList: Array<RemindModel>;//提醒时间数据
  remindList: Array<string>;  //全部提醒时间

  calendar: CalendarModel = new CalendarModel();    //当前

  year: number;
  month: number;
  dayList: TimeModel;

  showDay:string;



  //查询日历
  scheduleList: Array<ScheduleModel>;
  findSchedule: ScheduleOutModel; //查询日程条件

  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  options: CalendarComponentOptions = {
    pickMode: 'single',
    from:new Date(1975, 0, 1),
    daysConfig:[]
  };


  constructor(public navCtr: NavController,  public navParams: NavParams,
              public modalCtr: ModalController,
              private webSocketService: WebsocketService,
              private http: HttpClient,
              private paramsService: ParamsService,
              private alarmClock: XiaojiAlarmclockService,
              private sqliteService:BaseSqliteService,
              private calendarService:CalendarService) {

    moment.locale('zh-cn');

    this.init();
    this.setAlarmList();
  }

  ionViewDidLoad() {
    this.homeWorkListPage.height =  window.document.body.clientHeight - 350 - 45 -20;
    console.log('ionViewDidLoad HomePage');

  }

  init() {

  this.showDay = moment().format('dddd YYYY 年 MM 月 DD 日');
    //消息队列接收
    // this.webSocketService.connect(this.paramsService.user.accountQueue);
    this.webSocketService.connect("15000");

    this.scheduleList = [];
    // setTimeout(()=>{
    //   this.sqliteService.executeSql("select substr(playersFinishDate,1,10) finishDate,count(*) numL from GTD_D " +
    //     "where substr(playersFinishDate,1,7)='2018-11'" +
    //     "GROUP BY substr(playersFinishDate,1,10) ",[]).then(data=>{
    //     if(data && data.rows && data.rows.length>0){
    //       this.options.daysConfig.push({
    //         date: new Date('2018-11-10'),
    //         subTitle: `\u25B2`
    //       });
    //       for(let i=0;i<data.rows.length;i++){
    //         if(data.rows.item(i).numL<5){
    //           this.options.daysConfig.push({
    //             date: new Date(data.rows.item(i).finishDate),
    //             cssClass: `hassometing animated bounceIn`
    //           });
    //         }else{
    //           this.options.daysConfig.push({
    //             date: new Date(data.rows.item(i).finishDate),
    //             cssClass: `busysometing animated bounceIn`
    //           });
    //         }
    //
    //       }
    //     }
    //     this.ion2calendar.refresh();
    //   }).catch(e=>{
    //     console.log("GTD_D->:"+e);
    //   })
    //   // this.options.daysConfig.push({
    //   //   date: new Date('2018-11-10'),
    //   //   subTitle: `\u25B2`
    //   // });
    //   // setTimeout(()=>{
    //   //
    //   //   this.options.daysConfig.push({
    //   //     date: new Date('2018-11-12'),
    //   //     cssClass: `hassometing animated bounceIn`
    //   //   });
    //   //   this.ion2calendar.refresh();
    //   //   setTimeout(()=>{
    //   //     this.options.daysConfig.push({
    //   //       date: new Date('2018-11-13'),
    //   //       cssClass: `busysometing animated bounceIn`
    //   //     });
    //   //     this.options.daysConfig.push({
    //   //       date: new Date('2018-11-14'),
    //   //       cssClass: `busysometing animated bounceIn`
    //   //     });
    //   //     this.options.daysConfig.push({
    //   //       date: new Date('2018-11-15'),
    //   //       cssClass: `busysometing animated bounceIn`
    //   //     });
    //   //     this.ion2calendar.refresh();
    //   //   },1000);
    //   //   this.ion2calendar.refresh();
    //   // },1000);
    //   // this.ion2calendar.refresh();
    // },1000);





    // this.calendarControl();
    // let today = new Date();
    //this.findTodaySchedule( today.getFullYear(), today.getMonth() + 1, today.getDate());

  }
  //设置当天全部提醒
  setAlarmList() {

    this.http.post(AppConfig.SCHEDULE_TODAY_REMIND_URL, {
      userId: this.paramsService.user.userId
    },{
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        this.data = data;
        console.log( this.data);

        if (this.data.code == 0) {
          this.remindScheduleList = [];
          this.remindScheduleList = this.data.data.remindList;
          for(let i = 0; i < this.remindScheduleList.length; i++) {
            this.alarmClock.setAlarmClock(this.remindScheduleList[i].remindDate, this.remindScheduleList[i].scheduleName);
          }
        }

      })

  }
  discernTags($event){
    let eventDate = new Date($event.time);
    let year = eventDate.getFullYear();
    let month = eventDate.getMonth()+1;
  }
  //查询当天日程
  findTodaySchedule($event) {

    console.log($event);
    //  this.sqliteService.addRctest().then(data=>{
    //   alert("插入数据：" + data);
    // }).catch((err)=>{
    //   alert(err);
    //  })

    let eventDate = new Date($event.time);
    let year = eventDate.getFullYear();
    let month = eventDate.getMonth()+1;
    let day = eventDate.getDate();
    this.showDay = moment().set({'year':year,'month':month-1,'date':day}).format('dddd YYYY 年 MM 月 DD 日');
    //this.page1.findTodaySchedule($event);
    //this.page2.findTodaySchedule($event);
    //this.page3.findTodaySchedule($event);
    this.calendarService.setSelectDay($event);

    //
    // this.findSchedule = new ScheduleOutModel();
    // this.findSchedule.scheduleStartTime = year + "-" + month + "-" + day + " 00:00";
    // this.findSchedule.scheduleDeadline = year + "-" + month + "-" + day + " 23:59";
    // console.log("scheduleStartTime:" + this.findSchedule.scheduleStartTime + " | scheduleDeadline:" + this.findSchedule.scheduleDeadline);
    // this.findSchedule.userId = this.paramsService.user.userId;
    // this.http.post(AppConfig.SCHEDULE_FIND_URL, this.findSchedule, {
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   responseType: 'json'
    // })
    //   .subscribe(data => {
    //     this.data = data;
    //     console.log("data:" + this.data.toString());
    //
    //     if (this.data.code == 0) {
    //       this.scheduleList = this.data.data.scheduleJoinList;
    //       console.log("data:" + this.data.data);
    //     } else {
    //       console.log("error message:" + this.data.message);
    //     }
    //   })
  }

  showUserDetail() {
    console.log("跳转user" );
    this.navCtr.push("UserDetailPage");
  }

  gotoToday(){
    this.ion2calendar.setViewDate(moment().format("YYYY-MM-DD"));
  }
  openVoice() {
    let tab1RootModal  = this.modalCtr.create("SpeechPage");
    tab1RootModal.present();
  }
}
