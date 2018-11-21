import {Component, ElementRef, Input, Renderer2} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ScheduleModel} from "../../model/schedule.model";
import {ParamsService} from "../../service/params.service";
import {ScheduleOutModel} from "../../model/out/schedule.out.model";
import {AppConfig} from "../../app/app.config";
import {HttpClient} from "@angular/common/http";
import {CalendarService} from "../../service/calendar.service";
import {UtilService} from "../../service/util.service";
import {BaseSqliteService} from "../../service/sqlite-service/base-sqlite.service";
import {UEntity} from "../../entity/u.entity";
import {UserSqliteService} from "../../service/sqlite-service/user-sqlite.service";
import {UoModel} from "../../model/out/uo.model";

/**
 * Generated class for the HomeWorkListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-work-list',
  templateUrl: 'home-work-list.html',
})
export class HomeWorkListPage {

  schedule: ScheduleModel;
  scheduleList: Array<ScheduleModel>;
  findSchedule: ScheduleOutModel; //查询日程条件
  u:UEntity;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private paramsService: ParamsService,
              private calendarService:CalendarService,
              private http: HttpClient,
              private util:UtilService,
              private rnd: Renderer2,
              private sqliteService:BaseSqliteService,
              private userSqlite:UserSqliteService,
              private el: ElementRef) {
    this.scheduleList = [];
    console.log('ionViewDidLoad HomeWorkListPage');
    this.calendarService.getSelectDay(this);
    this.init()
  }

  init(){
    let uo=new UoModel();
    this.u = new UEntity();
    this.userSqlite.select(this.u,uo)
      .then(data=>{
        if(data && data.rows && data.rows.length>0){
          this.u=data.rows.item(0);
        }
      })
  }
  /**
   * Height of the tabs
   */
  @Input()
  set height(val: number) {
    this.rnd.setStyle(this.el.nativeElement, 'height', val + 'px');
  }

  get height(): number {
    return this.el.nativeElement.offsetHeight;
  }

  //展示数据详情
  showScheduleDetail(schedule){
    this.schedule = new ScheduleModel();
    this.schedule = schedule;
    this.paramsService.schedule = this.schedule;
    console.log("schedule:" + this.paramsService.schedule);
    this.navCtrl.push("ScheduleDetailPage",this.schedule);
  }
  //查询当天日程
  findTodaySchedule($event) {
    // this.sqliteService.addRctest(new Date(),1980,1).then(data=>{
    //     let datas=data;
    //     console.log(data);
    // })
    console.log($event);
    let eventDate = new Date($event.time);
    let dateStr2 = eventDate.toDateString();
    dateStr2 = eventDate.toLocaleDateString();
    dateStr2 = eventDate.toLocaleString()
    let year = eventDate.getFullYear();
    let month = eventDate.getMonth()+1;
    let day = eventDate.getDate();
    let monthStr = month+"";
    if(month<10){
      monthStr = '0'+month;
    }
    let dayStr = day +"";
    if(day<10){
      dayStr='0'+day;
    }

     let findSchedule = new ScheduleOutModel();
    findSchedule = new ScheduleOutModel();
    findSchedule.scheduleStartTime = year + "-" + month + "-" + day + " 00:00";
    findSchedule.scheduleDeadline = year + "-" + month + "-" + day + " 23:59";
    //findSchedule.userId = this.paramsService.user.userId;
    findSchedule.userId = this.u.uI;
    console.log("scheduleStartTime:" + findSchedule.scheduleStartTime + " | scheduleDeadline:" + findSchedule.scheduleDeadline);
    this.scheduleList = [];
    let dateStr=year + "-" + monthStr + "-" + dayStr;
    this.sqliteService.executeSql('select substr(pd,12,16) dateStr,gtdd.* from GTD_D gtdd where substr(pd,1,10)=?'
      ,[dateStr])
      .then(data=>{
        if(data && data.rows && data.rows.length>0){
          for(let i=0;i<data.rows.length;i++){
            let mo = new ScheduleModel();
            mo.scheduleStartTime = data.rows.item(i).dateStr;
            mo.scheduleName = data.rows.item(i).son;
            this.scheduleList.push(mo);
          }
        }
      })

    // this.http.post(AppConfig.SCHEDULE_FIND_URL, this.findSchedule, {
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   responseType: 'json'
    // })
    //   .subscribe(data => {
    //     // let datatype: any;
    //     // datatype = data;
    //     // if (datatype.code == 0) {
    //     //   this.scheduleList = datatype.data.scheduleJoinList;
    //     // } else {
    //     //   console.log("error message:" + datatype.message);
    //     // }
    //     let len = UtilService.randInt(2,13);
    //     for(let i=0;i<len;i++){
    //       let mo = new ScheduleModel();
    //       mo.scheduleStartTime = "05:00";
    //       mo.scheduleName = "mytest 我的车市"
    //       this.scheduleList.push(mo);
    //
    //     }
    //   })

    //查询本地日历日程
    this.sqliteService.executeSql("SELECT localId,scheduleName,scheduleStartTime,scheduleDeadLine FROM GTD_C WHERE scheduleStartTime BETWEEN "+"'"+findSchedule.scheduleStartTime+"'"+" AND "+"'"+findSchedule.scheduleDeadline+"'",[]).then(data => {
      if (!!!!data && !!!!data.rows && data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          let mo = new ScheduleModel();
          mo.scheduleStartTime =data.rows.item(i).scheduleStartTime;
          mo.scheduleName = data.rows.item(i).scheduleName;
          mo.scheduleDeadline=data.rows.item(i).scheduleDeadLine;
          this.scheduleList.push(mo);
          //alert(data.rows.item(i));
        }
        if(data.rows.length>0){
          console.log("-------"+data.rows.item(0).SCHEDULE_TITLE);
          //alert(data.rows.item(0).state+","+data.rows.item(0).remind_time)
        }
      }
    })
      .catch(err=>{
        //alert("err");
        //alert(err);
      });

  }

}
