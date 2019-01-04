import { Component, ViewChild } from '@angular/core';
import { App, IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { WebsocketService } from "../../service/util-service/websocket.service";
import { ParamsService } from "../../service/util-service/params.service";
import { XiaojiAlarmclockService } from "../../service/util-service/xiaoji-alarmclock.service";
import { RemindModel } from "../../model/remind.model";
import { ScheduleModel } from "../../model/schedule.model";
import { ScheduleOutModel } from "../../model/out/schedule.out.model";
import { CalendarModel } from "../../model/calendar.model";
import {
  CalendarComponent,
  CalendarComponentMonthChange,
  CalendarComponentOptions
} from "../../components/ion2-calendar";
import { TimeModel } from "../../model/time.model";
import * as moment from "moment";
import {UEntity} from "../../entity/u.entity";
import {WorkService} from "../../service/work.service";
import {UserService} from "../../service/user.service";
import {Ha01Page} from "../ha01/ha01";
import {DwEmitService} from "../../service/util-service/dw-emit.service";
import { HbPage } from "../hb/hb";
import { DataConfig } from "../../app/data.config";
import { PageConfig } from "../../app/page.config";
import {AppConfig} from "../../app/app.config";

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

  noShow:boolean = true;
  showNow:ScheduleModel;
  indexs:any;
  active: number = 0;//当前页面


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
              private paramsService: ParamsService,
              private alarmClock: XiaojiAlarmclockService,
              private userSqlite:UserService,
              private workSqlite:WorkService,
              private dwEmit: DwEmitService,
              private app: App) {

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
    });


    let month = moment().format('YYYY-MM');
    this.findDayConfig(month);

    //示例方法，完成删除
    //在这里完成对数据传递页面的操作
    this.dwEmit.getHaData(data => {
      // alert("HaPage获取了版本数据" + data);
    });
  }

  init() {

    this.showDay = moment().format('dddd YYYY 年 MM 月 DD 日');
    //消息队列接收
    // this.webSocketService.connect(this.paramsService.user.accountQueue);
    // this.webSocketService.connect("1");

    this.scheduleList = [];
    //获取用户信息
    this.u = DataConfig.uInfo;
    // this.userSqlite.getUo()
    //   .then(data=>{
    //     if(data.code==0 ){
    //       this.u=data.u;
    //       //消息队列接收
    //       // this.webSocketService.connect(this.u.aQ);
    //     }else{
    //       // alert(data.message);
    //     }
    //   })

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

  configMonthEventDay($event:CalendarComponentMonthChange){

    console.info($event.newMonth.dateObj)
    let month = moment($event.newMonth.dateObj).format('YYYY-MM');
    this.findDayConfig(month);


  }

  findDayConfig(month){
    this.workSqlite.getMBs(month).then(data=>{
      //成功
      if(data.code==0){
        for(let i=0;i<data.bs.length;i++){
          let mbs=data.bs[i];
          let res:any={};
          res.date=mbs.date;
          //事少
          if(!mbs.im){
            res.cssClass = `hassometing animated bounce`;
          }else{
            //事多
            res.cssClass = `busysometing animated bounce`;
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
  }
  createEvent($event){
    console.info($event)
    this.app.getRootNav().push(PageConfig.SB_PAGE);
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
    let dayStr = moment().set({'year':year,'month':month-1,'date':day}).format('YYYY-MM-DD');
    this.workSqlite.getOd(dayStr).then(data=>{
      if(data && data.slc && data.slc.length>0){
        for(let i=0;i<data.slc.length;i++){
          this.scheduleList.push(data.slc[i]);
        }
      }
    })

    this.ha01Page.findTodaySchedule($event);

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
    let tab1RootModal = this.modalCtr.create(PageConfig.HB_PAGE);
    tab1RootModal.present();
    // this.navCtr.push("HbPage");
  }

  /**
   * 本地日历日程增删
   */
  findEvent(){

  }

  swipeEvent(event){
    console.log(event);
    console.log("当前页面 :: "+ this.active);

    if(event.direction == 2){
      let index = this.active;

      //   3 4 5 6
      // 2 3 4 5
      console.log("向左滑 :: ");
      if(index == this.indexs.length-1){
        console.log("划不动了 :: ");
        return;
      }
      let domList = document.getElementsByName("pop-css");

      //左一左移
      if(index-1 >= 0){
        let dom2 = domList.item(index-1);
        dom2.className = "pop-css activeCssLeft-1";
      }
      //当前页面左移
      let dom:HTMLElement = domList.item(index);
      console.log(dom)
      // dom.style.transform = "translate(-105%,10%)"
      dom.className = "pop-css activeCssLeft ";
      //右一左移
      if(index+1 < this.indexs.length){
        let dom2 = domList.item(index+1);
        dom2.className = "pop-css activeCss";
      }
      //右二左移
      if(index+2 < this.indexs.length){
        let dom2 = domList.item(index+2);
        dom2.className = "pop-css activeCssRight";
      }

      this.active ++;
    }
    if(event.direction == 4){
      console.log("向右滑 :: ");
      let index = this.active;
      if(this.active == 0){
        console.log("划不动了 :: ")
        return;
      }
      //当前页右移
      let domList = document.getElementsByName("pop-css");
      let dom = domList.item(index);
      dom.className = "pop-css activeCssRight ";
      //右一右移
      if(index+1 < domList.length){
        let dom2 = domList.item(index+1);
        dom2.className = "pop-css activeCssRight-1";
      }
      //左一右移
      if(index-1 >= 0){
        let dom2 = domList.item(index-1);
        dom2.className = "pop-css activeCss";
      }
      //左二右移
      if(index-2 >= 0){
        let dom2 = domList.item(index-2);
        dom2.className = "pop-css activeCssLeft";
      }
      this.active --;
    }
  }

  backdropclick = function(e){
    //判断点击的是否为遮罩层，是的话隐藏遮罩层
    if(e.srcElement.className == 'itemClass'){
      this.noShow = true;
    }
    //隐藏滚动条
    //阻止冒泡
    // e.stopPropagation();
  }

  showDetail(schedule,scheduleList){
    if(typeof schedule == "number" ){
      this.indexs = ["1","2","3","4","5","6","7","8"];
      this.active = 1;
    }else {
      this.showNow = schedule;
      this.indexs = scheduleList;
      this.active = scheduleList.indexOf(schedule);
      console.log("scheduleList :: " + scheduleList)
      console.log("indexs.length :: " + scheduleList.length);
    }

    console.log("active :: " + this.active);

    setTimeout(()=>{

      let domList = document.getElementsByName("pop-css");
      console.log(domList.length);

      for(let i = 0;i< domList.length;i++){
        if(this.active == i){
          domList.item(i).className = "pop-css activeCss";
        }
        if( i == this.active-1){
          domList.item(i).className = "pop-css activeCssLeft";
        }
        if( i == this.active+1){
          domList.item(i).className = "pop-css activeCssRight";
        }
        if( i < this.active-1){
          domList.item(i).className = "pop-css activeCssLeft-1";
        }
        if( i > this.active+1){
          domList.item(i).className = "pop-css activeCssRight-1";
        }
        console.log("i :: " + i);
      }
      this.noShow = false;
    },1)



  }

  getEvent($event){
    console.log($event)
  }

  testCl(){
    console.log("点击一次 :: ");
    console.log(" :: " + document);
    // var dom = document.getElementById("1111")
    let domlist = document.getElementsByName("1111");
    for(let i= 0;i< domlist.length;i++){
      //阻止默认滑动事件
      domlist.item(i).addEventListener('touchmove', (e)=> {
        e.preventDefault();
      },true);
    }

  }

  testSw(){
    console.log("滑动一次 ::")
  }

  removeElement(obj){
    let domlist = document.getElementsByName("pop-css");
    console.log("div删除前 ::" + domlist.length);
    let index = this.indexs.indexOf(obj);
    console.log(index);
    console.log(this.indexs.splice(index,1));
    setTimeout(()=>{
      let domlist2 = document.getElementsByName("pop-css");
      console.log("div删除后 ::" + domlist2.length);
      if(this.active < domlist2.length){
        console.log("右补齐 :: ");
        domlist2.item(this.active).className = "pop-css activeCss";
        if(this.active +1 < domlist2.length ){
          domlist2.item(this.active +1 ).className = "pop-css activeCssRight";
        }
      }else if(this.active >0 ){
        console.log("左补齐 :: ");
        domlist2.item(this.active -1).className = "pop-css activeCss";
        if(this.active -1 > 0){
          domlist2.item(this.active-2).className = "pop-css activeCssLeft";
        }
        this.active --;
      }else{
        this.noShow = true;
      }
    },1);
  }

  // ionViewDidLoad(){
  //   console.log("1.0 ionViewDidLoad 当页面加载的时候触发，仅在页面创建的时候触发一次，如果被缓存了，那么下次再打开这个页面则不会触发");
  // }
  // ionViewWillEnter(){
  //   console.log("2.0 ionViewWillEnter 顾名思义，当将要进入页面时触发");
  // }
  // ionViewDidEnter(){
  //   console.log("3.0 ionViewDidEnter 当进入页面时触发");
  // }
  // ionViewWillLeave(){
  //   console.log("4.0 ionViewWillLeave 当将要从页面离开时触发");
  // }
  // ionViewDidLeave(){
  //   console.log("5.0 ionViewDidLeave 离开页面时触发");
  // }
  // ionViewWillUnload(){
  //   console.log("6.0 ionViewWillUnload 当页面将要销毁同时页面上元素移除时触发");
  // }
  //
  // ionViewCanEnter(){
  //   console.log("ionViewCanEnter");
  // }
  //
  // ionViewCanLeave(){
  //   console.log("ionViewCanLeave");
  // }


}

