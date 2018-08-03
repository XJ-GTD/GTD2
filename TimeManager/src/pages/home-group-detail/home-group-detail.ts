import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { Group } from "../../model/group.model";
import { HttpClient } from "@angular/common/http";
import { AppConfig } from "../../app/app.config";
import { File } from "@ionic-native/file";
import { Base64 } from "@ionic-native/base64";


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
              public platform: Platform,
              public file: File,
              public base64: Base64) {
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

 /* callVoicePlugin() {
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
  }*/

  listenText() {
    try {
      cordova.plugins.xunfeiListenSpeaking.startListen(result=>{
        alert("成功:" + result);
        this.filePath = this.file.externalRootDirectory + "/msc/iat.wav";
        alert(this.filePath);
        this.base64.encodeFile(this.filePath).then((base64File: string) => {
          this.content = base64File;
          this.connetXunfei();
        }, (err) => {
          alert(err);
        });

      },error=>{
        alert("报错:" + error);
      },true,true);
    } catch (e) {
      alert("问题："+ e)
    }

  }

  connetXunfei() {
    alert("调用成功:" + this.content);
    this.http.post(AppConfig.XUNFEI_URL_TEXT, {
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
      cordova.plugins.xunfeiListenSpeaking.startSpeak(result=>{
        alert("成功:" + result);
      },error=>{
        alert("报错:" + error);
      }, this.speechText);
    } catch (e) {
      alert("问题："+ e)
    }
  }

  /*callvoice() {
    try {
      cordova.plugins.VoicePlugin.numSum(4,6,result=>{
          alert("成功:" + result);
        },error=>{
          alert("报错:" + error);
        });
    } catch (e) {
      alert("问题："+ e)
    }
  }*/

}
