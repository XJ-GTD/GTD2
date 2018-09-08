import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import { AppConfig } from "../../app/app.config";
import { HttpClient } from "@angular/common/http";
import {ParamsService} from "../../service/params.service";
import {groupList} from "../../model/out/groupList.out.model";

/**
 * Generated class for the GroupListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-list',
  templateUrl: 'group-list.html',
})
export class GroupListPage {
  data:any;
  findType: number = 2;
  groupORperson: boolean = true;
  groupORpersonname:String;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              private http: HttpClient,) {
    this.connectors(this.findType);
  }

  connectors(findType){
    this.http.post(AppConfig.GROUP_FIND_URL,{
        userId:2,
        findType:findType
      }
    ).subscribe(data => {
      this.data = data;
      console.log(this.data.data.Grouplist)
      let loader = this.loadingCtrl.create({
        content: this.data.message,
        duration: 1500
      });
      if (this.data.code == "0") {
        loader.present();
              // this.navCtrl.push('HomePage');
      } else {
        loader.present();
      }
    })

    // console.log(this.group.groupName)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupListPage');
  }

  xiangqing(groupORindividual){
    console.log(groupORindividual)
    this.navCtrl.push('GroupDetailPage',{groupId:groupORindividual})
  }

  gerenxiangqing(individual){
    console.log(individual)
    this.navCtrl.push('GroupPersonalEditPage',{groupId:individual})
  }

  addORedit(){
    this.navCtrl.push('GroupEditPage')
  }

  edit(){
    if(this.groupORperson==false){
      this.groupORperson=true;
      this.groupORpersonname='群组'
      this.findType = 2;
    }else {
      this.groupORperson=false;
      this.groupORpersonname='个人'
      this.findType = 1;
    }
    this.connectors(this.findType)
  }

}
