import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, AlertController, Navbar} from 'ionic-angular';
import { ParamsService } from "../../service/params.service";
import { HttpClient } from "@angular/common/http";
import { ScheduleModel } from "../../model/schedule.model";
import { AppConfig } from "../../app/app.config";
import { ScheduleOutModel } from "../../model/out/schedule.out.model";
import { FindOutModel } from "../../model/out/find.out.model";
import { LabelOutModel } from "../../model/out/label.out.model";
import { LabelModel } from "../../model/label.model";
import { GroupModel } from "../../model/group.model";

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

  @ViewChild(Navbar) navBar: Navbar;


  private data: any;
  groupIds: Array<number>;
  group: Array<GroupModel>;
  schedule: any;
  scheduleOut: ScheduleOutModel;
  groupFind: FindOutModel;
  labelFind: LabelOutModel;
  labelIds: Array<number>;
  label: Array<LabelModel>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpClient,
              public loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private paramsService: ParamsService) {

    this.init();

  }

  init() {
    //判断：创建/编辑
    if (this.paramsService.schedule != null) {
      this.schedule = new ScheduleModel();
      this.schedule = this.paramsService.schedule;
    } else {
      this.scheduleOut =  new ScheduleOutModel();
      this.schedule = this.scheduleOut;
    }
    this.addContact();
    this.findLabel();
  }

  //查询系统标签
  findLabel() {
    this.labelFind = new LabelOutModel();
    this.labelFind.userId = this.paramsService.user.userId;
    this.labelFind.findType = 2;  //暂为硬代码，默认2 日程

    this.http.post(AppConfig.USER_LABEL_URL, this.labelFind, {
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        this.data = data;
        if (this.data.code == 0) {
          this.label = [];
          this.label = this.data.data.labelList;

        } else {
          let loader = this.loadingCtrl.create({
            content: "服务器繁忙，请稍后再试",
            duration: 1000
          });
          loader.present();
        }
      })
  }

  /**
   * 选择参与人
   */
  addContact() {
    this.groupFind = new FindOutModel();
    this.groupFind.userId= this.paramsService.user.userId;
    this.groupFind.findType = 3;        //暂为硬代码，默认群组
    this.http.post(AppConfig.GROUP_ALL_SHOW_URL, this.groupFind, {
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        this.data = data;
        let loader = this.loadingCtrl.create({
          content: this.data.message,
          duration: 1000
        });
        if (this.data.code == 0) {
          this.group = [];
          this.group = this.data.data.groupList;

        } else if (this.data.code == 1) {
          loader.setContent("暂未找到参与人，请尝试创建参与人吧");
          loader.present();
        } else if (this.data.code == -1) {
          loader.setContent("服务器繁忙，请稍后再试");
          loader.present();
        }

      })


  }

  //发布任务入库
  newProject() {
    this.scheduleOut = new ScheduleOutModel();
    this.schedule.userId = this.paramsService.user.userId;
    /*时间格式规整*/
    if (this.schedule.scheduleStartTime != null && this.schedule.scheduleStartTime != "") {
      this.schedule.scheduleStartTime = this.schedule.scheduleStartTime.replace("T", " ");
      this.schedule.scheduleStartTime = this.schedule.scheduleStartTime.replace(":00Z", "");
    }
    if (this.schedule.scheduleDeadline != null && this.schedule.scheduleDeadline != "") {
      this.schedule.scheduleDeadline = this.schedule.scheduleDeadline.replace("T", " ");
      this.schedule.scheduleDeadline = this.schedule.scheduleDeadline.replace(":00Z", "");
    }
    //事件默认状态：1
    this.schedule.scheduleStatus = 1;
    console.log("groupIds:" + this.schedule.groupIds + " labelIds: " + this.schedule.labelIds);
    this.http.post(AppConfig.SCHEDULE_ADD_URL, this.schedule, {
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        this.data = data;
        let loader = this.loadingCtrl.create({
          content: this.data.message,
          duration: 1500
        });
        if (this.data.code == 0) {
          loader.present();
          this.goBack();
          console.log("发布成功");
        } else {
          loader.present();
          console.log("发布失败" + this.data.message);
        }
      });
  }

  //编辑完成提交
  editFinish() {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScheduleAddPage');
    this.navBar.backButtonClick = this.backButtonClick;
    this.navBar.setBackButtonText("");
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.paramsService.schedule=null;
    this.navCtrl.pop();
  }

  goBack() {
    // 重写返回方法
    this.paramsService.schedule=null;
    this.navCtrl.pop();
    // this.navCtrl.push('GroupListPage');
  }
}
