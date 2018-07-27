import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Group} from "../../model/group.model";
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "../../app/app.config";


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
  templateUrl: 'home-group-detail.html'
})
export class HomeGroupDetailPage {

  data: any;
  groupDetail: Group;
  groupScheduleList: any;
  speechText: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              private http: HttpClient) {
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

  callVoicePlugin() {
    alert("插件开启");

    try {
      cordova.plugins.VoicePlugin.coolMethod("今天好运气，一老狼请吃鸡呀！",result=>{
        alert(result);
        alert("插件ing");
      },error=>{
        alert(error);
      });
    } catch (e) {
      alert("问题："+ e)
    }

    alert("插件关闭");
  }

  listenText() {
    try {
      cordova.plugins.XunfeiListenSpeaking.startListen(result=>{
        alert("成功:" + result);
      },error=>{
        alert("报错:" + error);
      },true,true);
    } catch (e) {
      alert("问题："+ e)
    }
  }

  speakText() {
    try {
      cordova.plugins.XunfeiListenSpeaking.startSpeak(result=>{
        alert("成功:" + result);
      },error=>{
        alert("报错:" + error);
      }, this.speechText);
    } catch (e) {
      alert("问题："+ e)
    }
  }

  callvoice() {
    try {
      cordova.plugins.VoicePlugin.numSum(4,6,result=>{
          alert("成功:" + result);
        },error=>{
          alert("报错:" + error);
        });
    } catch (e) {
      alert("问题："+ e)
    }
  }

}
