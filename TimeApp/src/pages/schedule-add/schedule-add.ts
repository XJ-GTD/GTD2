import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, AlertController } from 'ionic-angular';
import { ParamsService } from "../../service/params.service";
import { HttpClient } from "@angular/common/http";
import { ScheduleModel } from "../../model/schedule.model";
import { AppConfig } from "../../app/app.config";
import {ScheduleOutModel} from "../../model/out/schedule.out.model";
import {GroupFindOutModel} from "../../model/out/groupFind.out.model";

/**
 * Generated class for the ScheduleAddPage page.
 * create by wzy
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-schedule-add',
  templateUrl: 'schedule-add.html',
  providers: []
})
export class ScheduleAddPage {

  data: any;
  contactDetail: any;
  groupNames: Array<string>;
  groupIds: Array<number>;
  schedule: any;
  scheduleOut: ScheduleOutModel;
  groupFind: GroupFindOutModel;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpClient,
              public loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private paramsService: ParamsService) {
    this.groupFind.userId = this.paramsService.user.userId;
    this.init();

  }

  init() {
    //判断：创建/编辑
    if (this.paramsService.schedule != null) {
      this.schedule = new ScheduleModel();
      this.schedule = this.paramsService.schedule;
    } else {
      this.schedule = new ScheduleOutModel();
    }
  }

  /**
   * 选择参与人
   */
  addContact() {
    let alert = this.alertCtrl.create();
    this.groupFind.findType = 2;        //暂为硬代码，默认群组
    this.http.post(AppConfig.GROUP_FIND_URL, this.groupFind, {
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        this.data = data;
        if (this.data.code == 0) {
          alert.setTitle('参与人');
          for (this.contactDetail of this.data.data.groupList) {
            alert.addInput({
              type: 'checkbox',
              label: this.contactDetail.groupName,
              value: this.contactDetail
            })
          }
          alert.addButton('取消');
          alert.addButton({
            text: '确定',
            handler: (data => {
              console.log('checkbox data:' + data);
              this.groupIds = [];
              this.groupNames = [];
              for (this.contactDetail of data) {
                this.groupIds.push(this.contactDetail.groupId);         //上传数据
                this.groupNames.push(this.contactDetail.groupName);   //显示用
              }
            })
          })
          alert.present();
        } else {
          alert.setTitle(this.data.message);
          alert.addButton({
            text: '确定'
          });
        }

      })


  }

  //发布任务入库
  newProject() {
    this.http.post(AppConfig.SCHEDULE_ADD_URL, this.scheduleOut, {
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        this.data = data;
        if (this.data.code == 0) {
          let loader = this.loadingCtrl.create({
            content: this.data.message,
            duration: 1500
          });
          loader.present();
          // this.schedule.scheduleId = this.data.data.scheduleId;
        } else {
          console.log("发布失败");
        }
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScheduleAddPage');
  }

  onBack() {
    this.navCtrl.pop(); /*返回上一个页面*/
  }
}
