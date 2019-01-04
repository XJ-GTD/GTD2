import {Component, ElementRef, Input, Renderer2} from '@angular/core';
import {App, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ScheduleModel} from "../../model/schedule.model";
import {ParamsService} from "../../service/util-service/params.service";
import {ScheduleOutModel} from "../../model/out/schedule.out.model";
import {UtilService} from "../../service/util-service/util.service";
import {UEntity} from "../../entity/u.entity";
import {WorkService} from "../../service/work.service";
import {UserService} from "../../service/user.service";
import {HaPage} from "../ha/ha";
import {DataConfig} from "../../app/data.config";

/**
 * Generated class for the Ha01Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ha01',
  templateUrl: 'ha01.html',
})
export class Ha01Page {

  schedule: ScheduleModel;
  scheduleList: Array<ScheduleModel>;
  findSchedule: ScheduleOutModel; //查询日程条件
  u:UEntity;
  haPage:HaPage;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private paramsService: ParamsService,
              private util:UtilService,
              private rnd: Renderer2,
              private userSqlite:UserService,
              private workSqlite:WorkService,
              private el: ElementRef,
              private app: App) {
    this.scheduleList = [];
    console.log('ionViewDidLoad Ha01Page');
    //this.calendarService.getSelectDay(this);
    this.init()
  }

  init(){
    this.u = DataConfig.uInfo;
    console.log("ha01 获取用户信息："+JSON.stringify(this.u))
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
    console.log("schedule :: " + JSON.stringify(schedule));
    this.schedule = new ScheduleModel();
    this.schedule = schedule;
    this.paramsService.schedule = this.schedule;
    console.log("schedule:" + JSON.stringify(this.paramsService.schedule));
    this.app.getRootNav().push("SaPage",this.schedule);
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
        for(let i=0;i<data.slc.length;i++){
          this.scheduleList.push(data.slc[i]);
        }
      }
    })

  }


  showDetail(itm){
    this.haPage.showDetail(itm,this.scheduleList);
  }

  setData(page){
    this.haPage = page;
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
