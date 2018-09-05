import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AppConfig} from "../../app/app.config";
import { HttpClient } from "@angular/common/http";

/**
 * Generated class for the GroupEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-personal-edit',
  templateUrl: 'group-personal-edit.html',
})
export class GroupPersonalEditPage {
  groupId:number;
  data3: any;
  isEdit: boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient, public loadingCtrl: LoadingController) {
    this.groupId = navParams.data.groupId;
    this.http.post(AppConfig.GROUP_FIND_SINGLE_URL,{
      userId:2,
      groupId:this.groupId
    }).subscribe(data => {
      this.data3 = data
      console.log(this.data3);
      let loader = this.loadingCtrl.create({
        content: this.data3.message,
        duration: 1500
      });
      if (this.data3.code == "0") {
        loader.present();
        // this.navCtrl.push('HomePage');
      } else {
        loader.present();
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupPersonalEditPage');
  }

  personaledit(){
    if(this.isEdit==true){
      this.isEdit=false;
    }else {
      this.isEdit=true;
    }
  }

}
