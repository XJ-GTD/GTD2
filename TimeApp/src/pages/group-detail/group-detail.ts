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
  // data1: object = {
  //   groupId:1,
  //   groupName:'开发一组',
  //   groupLabel:[//标签
  //     {
  //       labelId:1,
  //       labelName:'工作',
  //     },{
  //       labelId:2,
  //       labelName:'生活',
  //     },{
  //       labelId:3,
  //       labelName:'娱乐',
  //     }
  //   ],
  //   gtdGroupMember:[//群成员
  //     {
  //       userId:1,
  //       userName:'张三',
  //       userContact:'17712341234'
  //     },{
  //       userId:2,
  //       userName:'李四',
  //       userContact:'17712345677'
  //     },{
  //       userId:3,
  //       userName:'王五',
  //       userContact:'18712345678'
  //     },{
  //       userId:4,
  //       userName:'赵六',
  //       userContact:'17612345678'
  //     }
  //   ]
  // }

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
    this.navCtrl.push('GroupEditPage',this.data1)
  }

}
