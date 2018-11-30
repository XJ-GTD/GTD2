import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { WebsocketService } from "../../service/util-service/websocket.service";
import { ParamsService } from "../../service/util-service/params.service";
import { XiaojiAlarmclockService } from "../../service/util-service/xiaoji-alarmclock.service";
import { HttpClient } from "@angular/common/http";
import { AppConfig } from "../../app/app.config";
import { RemindModel } from "../../model/remind.model";
import { ScheduleModel } from "../../model/schedule.model";
import { ScheduleOutModel } from "../../model/out/schedule.out.model";
import { CalendarModel } from "../../model/calendar.model";
import {CalendarComponent, CalendarComponentOptions, CalendarController} from "../../components/ion2-calendar";
import { TimeModel } from "../../model/time.model";
import * as moment from "moment";
import {CalendarService} from "../../service/calendar.service";
import {BaseSqliteService} from "../../service/sqlite-service/base-sqlite.service";
import {UEntity} from "../../entity/u.entity";
import {WorkService} from "../../service/work.service";
import {UserService} from "../../service/user.service";
import {Ha01Page} from "../ha01/ha01";
import {PlayerService} from "../../service/player.service";
import {RcEntity} from "../../entity/rc.entity";
import {RcpEntity} from "../../entity/rcp.entity";


/**
 * Generated class for the HaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ha',
  templateUrl: 'ha.html',
  providers: []
})
export class HaPage {

  // page1:any = 'HomeWorkListPage';
  // page2:any = 'HomeWorkListPage';
  // page3:any = 'HomeWorkListPage';
  @ViewChild(CalendarComponent) ion2calendar:CalendarComponent;

  @ViewChild(Ha01Page) ha01Page:Ha01Page;

  tab1Root = 'HbPage';
  data: any;
  remindScheduleList: Array<RemindModel>;//提醒时间数据
  remindList: Array<string>;  //全部提醒时间

  calendar: CalendarModel = new CalendarModel();    //当前

  year: number;
  month: number;
  dayList: TimeModel;

  showDay:string;
  u:UEntity;


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
              private userSqlite:UserService,
              private workSqlite:WorkService,
              private calendarService:CalendarService,
              private playerService:PlayerService) {

    moment.locale('zh-cn');

    this.init();
    this.setAlarmList();
  }

  ionViewDidLoad() {
    this.ha01Page.height =  window.document.body.clientHeight - 350 - 45 -20;
    console.log('ionViewDidLoad HaPage');

    //this.findEvent();

    document.addEventListener('resume',()=>{
      // this.findEvent();
    })
  }

  init() {

    this.showDay = moment().format('dddd YYYY 年 MM 月 DD 日');
    //消息队列接收
    // this.webSocketService.connect(this.paramsService.user.accountQueue);
    // this.webSocketService.connect();

    this.scheduleList = [];
    //获取用户信息
    this.u = new UEntity();
    this.userSqlite.getUo()
      .then(data=>{
        if(data.code==0 ){
          this.u=data.u;
          //消息队列接收
          this.webSocketService.connect(this.u.aQ);
        }else{
          alert(data.message);
        }
      })
    let month = moment().format('YYYY-MM');
    this.workSqlite.getMBs(month).then(data=>{
      //成功
      if(data.code==0){
        for(let i=0;i<data.bs.length;i++){
          let mbs=data.bs[i];
          let res:any={};
          res.date=mbs.date;
          //事少
          if(!mbs.im){
            res.cssClass = `hassometing animated fadeInDown`;
          }else{
            //事多
            res.cssClass = `busysometing animated fadeInDown`;
          }
          //有消息
          if(mbs.iem){
            res.subTitle=`\u2022`;
          }
          this.options.daysConfig.push(res);
        }
        this.ion2calendar.refresh();
      }
    })
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

    // this.sqliteService.executeSql("DROP TABLE GTD_C",[]);
    // this.sqliteService.executeSql("DROP TABLE GTD_D",[]);
    // this.sqliteService.createTable();
    //this.playerService.addPlayer("SUUID","日程A","1","1","2018-11-29 14:25","2018-11-29 14:26","PUUID","日程别名","1","1","2018-11-29 14:25","1","1","1");
  }
  //设置当天全部提醒
  setAlarmList() {

    // this.http.post(AppConfig.SCHEDULE_TODAY_REMIND_URL, {
    //   //userId: this.paramsService.user.userId
    //   userId:this.u.uI
    // },{
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   responseType: 'json'
    // })
    //   .subscribe(data => {
    //     this.data = data;
    //     console.log( this.data);
    //
    //     if (this.data.code == 0) {
    //       this.remindScheduleList = [];
    //       this.remindScheduleList = this.data.data.remindList;
    //       for(let i = 0; i < this.remindScheduleList.length; i++) {
    //         this.alarmClock.setAlarmClock(this.remindScheduleList[i].remindDate, this.remindScheduleList[i].scheduleName);
    //       }
    //     }
    //
    //   })

  }
  discernTags($event){
    let eventDate = new Date($event.time);
    let year = eventDate.getFullYear();
    let month = eventDate.getMonth()+1;
  }

  createEvent($event){
    alert($event)
  }
  //查询当天日程
  findTodaySchedule($event) {


    if (!$event) {
      return;
    }

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

    let findSchedule = new ScheduleOutModel();
    if(day>=10&&month>=10) {
      findSchedule.scheduleStartTime = year + "-" + month + "-" + day + " 00:00";
      findSchedule.scheduleDeadline = year + "-" + month + "-" + day + " 23:59";
    }else if(day<10&&month>=10){
      findSchedule.scheduleStartTime = year + "-" + month + "-0" + day + " 00:00";
      findSchedule.scheduleDeadline = year + "-" + month + "-0" + day + " 23:59";
    }else if(day>=10&&month<10){
      findSchedule.scheduleStartTime = year + "-0" + month + "-" + day + " 00:00";
      findSchedule.scheduleDeadline = year + "-0" + month + "-" + day + " 23:59";
    }else{
      findSchedule.scheduleStartTime = year + "-0" + month + "-0" + day + " 00:00";
      findSchedule.scheduleDeadline = year + "-0" + month + "-0" + day + " 23:59";
    }

    //查询选中那天的日历日程
    this.playerService.getLocalSchedule(findSchedule.scheduleStartTime, findSchedule.scheduleDeadline).then(data => {
      for(let i=0;i<data.length;i++){
        this.scheduleList.push(data[i]);
      }
      //alert(JSON.stringify(this.scheduleList[0]));
    })

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
    this.navCtr.push("UcPage");
  }

  gotoToday(){
    this.ion2calendar.setViewDate(moment().format("YYYY-MM-DD"));
  }
  openVoice() {
    let tab1RootModal  = this.modalCtr.create("HbPage");
    tab1RootModal.present();
  }

  /**
   * 本地日历日程增删
   */
  findEvent(){
    this.calendarService.findEvent().then(data=>{

    })
  }
}

