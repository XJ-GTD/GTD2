import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { Group } from "../../model/group.model";
import { HttpClient } from "@angular/common/http";
import { AppConfig } from "../../app/app.config";
import { ParamsService } from "../../service/params.service";


declare let cordova: any;
/**
 * Generated class for the HomeGroupDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-group-detail',
  templateUrl: 'home-group-detail.html',
  providers: []
})
export class HomeGroupDetailPage {

  data: any;
  groupDetail: Group;
  groupScheduleList: any;
  speechText: string;
  content: string;
  filePath: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              private http: HttpClient,
              private paramsService: ParamsService,
              public platform: Platform) {
    this.groupDetail = this.navParams.get("group");
    this.http.get(AppConfig.SCHEDULE_GROUP_ALL_URL + "/" + this.groupDetail.groupId)
      .subscribe(data => {
       console.log(data);
        this.data =data;
        if (this.data.code == "0") {
          this.groupScheduleList = this.data.data.scheduleInfoList;
        } else {
          this.groupScheduleList = null;
        }
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeGroupDetailPage');
  }

  addScheduleByGroup() {
    this.navCtrl.push('ScheduleAddPage', {'groupId': this.groupDetail.groupId})
  }

  updateSchedule(scheduleId) {

  }

  listenText() {
    try {
      cordova.plugins.xjvoicefromXF.startListen(result=>{
        alert("成功:" + result);

        this.connetXunfei();

      },error=>{
        alert("报错:" + error);
      },true,true);
    } catch (e) {
      alert("问题："+ e)
    }

  }

  connetXunfei() {
    alert("调用成功:" + this.content);
    this.http.post(AppConfig.XUNFEI_URL_AUDIO, {
      content: this.content
    },{
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        console.log(data);
        this.data = data;
        this.speechText = this.data;
        alert("成功:" + this.speechText);
        this.speakText();
      })
  }


  speakText() {
    try {
      cordova.plugins.xjvoicefromXF.startSpeak(result=>{
        alert("成功:" + result);
      },error=>{
        alert("报错:" + error);
      }, this.speechText);
    } catch (e) {
      alert("问题："+ e)
    }
  }


}
