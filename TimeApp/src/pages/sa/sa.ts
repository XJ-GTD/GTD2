import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController, Navbar, NavController, NavParams } from 'ionic-angular';
import { ParamsService } from "../../service/util-service/params.service";
import { ScheduleModel } from "../../model/schedule.model";
import { XiaojiAlarmclockService } from "../../service/util-service/xiaoji-alarmclock.service";
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "../../app/app.config";
import {ScheduleOutModel} from "../../model/out/schedule.out.model";
import {WorkService} from "../../service/work.service";
import {RcModel} from "../../model/rc.model";
import {LbModel} from "../../model/lb.model";

/**
 * Generated class for the SaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sa',
  templateUrl: 'sa.html',
  providers: []
})
export class SaPage {
  @ViewChild(Navbar) navBar: Navbar;

  data: any;
  schedule: ScheduleModel;
  rc:RcModel;
  lbs:Array<LbModel>;
  updateSchedule: ScheduleOutModel; //更新日程状态

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private paramsService: ParamsService,
              private http: HttpClient,
              public modalCtrl: ModalController,
              private work:WorkService,
              private alarmClock: XiaojiAlarmclockService) {
    this.init();
  }

  init() {
    this.schedule = new ScheduleModel();
    this.schedule = this.navParams.data;
    this.rc = new RcModel();
    this.work.getds(this.schedule.scheduleId).then(data=>{
      this.rc = data;
    }).catch(e=>{
      alert(e.message)
    })
    /*时间格式规整*/
    if (this.schedule.scheduleStartTime != null && this.schedule.scheduleStartTime != "") {
      this.schedule.scheduleStartTime = this.schedule.scheduleStartTime.replace(" ", "T");
      // this.schedule.scheduleStartTime = this.schedule.scheduleStartTime.replace(":00Z", "");
    }
    if (this.schedule.scheduleDeadline != null && this.schedule.scheduleDeadline != "") {
      this.schedule.scheduleDeadline = this.schedule.scheduleDeadline.replace(" ", "T");
      // this.schedule.scheduleDeadline = this.schedule.scheduleDeadline.replace(":00Z", "");
    }
    this.lbs = new Array<LbModel>();
    //查询系统标签
    this.work.getlbs().then(data=>{
      if(data.code == 0){
        this.lbs = data.lbs;
        console.log('标签查询成功')

      }
    }).catch(reason => {

    })
  }

  //设置闹钟
  setAlarm() {
    let myModal = this.modalCtrl.create('SdPage');
    myModal.onDidDismiss(data => {

      console.log("remindTime" + data);
      this.alarmClock.setAlarmClock(data, this.schedule.scheduleName);

    });
    myModal.present();
  }

  //日程完成状态改变
  changeState() {
    // this.updateSchedule = new ScheduleOutModel();
    // this.updateSchedule.scheduleId;
    // this.updateSchedule.playersStatus = 0;
    // this.updateSchedule.userId = this.paramsService.user.userId;
    // this.http.post(AppConfig.SCHEDULE_UPDATE_STATE_URL, this.updateSchedule, {
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   responseType: 'json'
    // })
    //   .subscribe(data => {
    //     this.data = data;
    //     console.log("日程完成状态：" + this.data);
    //   });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SaPage');
    this.navBar.backButtonClick = this.backButtonClick;
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.paramsService.schedule=null;
    this.navCtrl.pop();
  }



}
