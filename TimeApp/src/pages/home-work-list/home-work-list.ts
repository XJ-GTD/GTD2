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
import {WorkSqliteService} from "../../service/sqlite-service/work-sqlite.service";
import {WorkService} from "../../service/work.service";
import {UserService} from "../../service/user.service";

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
              private userSqlite:UserService,
              private workSqlite:WorkService,
              private el: ElementRef) {
    this.scheduleList = [];
    console.log('ionViewDidLoad HomeWorkListPage');
    this.calendarService.getSelectDay(this);
    this.init()
  }

  init(){
    let uo=new UoModel();
    this.u = new UEntity();
    this.userSqlite.getUo()
      .then(data=>{
        if(data.code==0){
          this.u=data.u;
        }else{
          alert(data.message)
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
    //findSchedule.userId = this.paramsService.user.userId;
    findSchedule.userId = this.u.uI;
    console.log("scheduleStartTime:" + findSchedule.scheduleStartTime + " | scheduleDeadline:" + findSchedule.scheduleDeadline);
    this.scheduleList = [];
    let dateStr=year + "-" + monthStr + "-" + dayStr;
    this.workSqlite.getOd(dateStr).then(data=>{
      if(data.code==0){
        for(let i=0;i<data.sjl.length;i++){
          let mo = new ScheduleModel();
          mo.scheduleStartTime = data.sjl[i].tm
          mo.scheduleName = data.sjl[i].son;
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
      this.sqliteService.executeSql("SELECT GTD_C.sN,GTD_C.lI,GTD_D.cd,GTD_D.pd FROM GTD_C JOIN GTD_D ON GTD_C.sI=GTD_D.sI AND GTD_C.sI IN (SELECT sI FROM GTD_D WHERE cd BETWEEN "+"'"+findSchedule.scheduleStartTime+"'"+" AND "+"'"+findSchedule.scheduleDeadline+"')",[]).then(data => {
      // this.sqliteService.executeSql("SELECT sI FROM GTD_C",[]).then(msg=>{
      //   alert(JSON.stringify(data)+" "+JSON.stringify(msg));
      //
      // });
        //alert(JSON.stringify(data.rows.item(0)));
      if (!!!!data && !!!!data.rows && data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          let mo = new ScheduleModel();
          mo.scheduleStartTime =data.rows.item(i).cd;
          mo.scheduleName = data.rows.item(i).sN;
          //mo.scheduleDeadline=data.rows.item(i).pd;
          this.scheduleList.push(mo);

        }
        if(data.rows.length>0){
          //console.log("-------"+data.rows.item(0).SCHEDULE_TITLE);
          //alert(data.rows.item(0).state+","+data.rows.item(0).remind_time)
        }
      }
    })
      .catch(err=>{
        alert("err:"+JSON.stringify(err));
      });

  }

}
