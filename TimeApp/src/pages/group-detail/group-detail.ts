import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import { AppConfig } from "../../app/app.config";
import { HttpClient } from "@angular/common/http";

/**
 * Generated class for the GroupDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-detail',
  templateUrl: 'group-detail.html',
})
export class GroupDetailPage {
  groupId:number;
  data11: String
  data1: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient,public loadingCtrl: LoadingController,) {
    this.groupId = navParams.get('groupId')
    this.http.post(AppConfig.GROUP_FIND_SINGLE_URL,{
      userId:2,
      groupId:this.groupId
    }).subscribe(data => {
      this.data1 = data
      console.log(this.data1.data.group);
      let loader = this.loadingCtrl.create({
        content: this.data1.message,
        duration: 1500
      });
      if (this.data1.code == "0") {
        loader.present();
        // this.navCtrl.push('HomePage');
      } else {
        loader.present();
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupDetailPage');
  }

  editgroup(){
    this.navCtrl.push('GroupEditPage',{"data1":this.data1})
  }

}
