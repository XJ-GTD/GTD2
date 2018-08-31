import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  data1: object = {
    groupId:1,
    groupName:'开发一组',
    groupLabel:[//标签
      {
        labelId:1,
        labelName:'工作',
      },{
        labelId:2,
        labelName:'生活',
      },{
        labelId:3,
        labelName:'娱乐',
      }
    ],
    gtdGroupMember:[//群成员
      {
        userId:1,
        userName:'张三',
        userContact:'17712341234'
      },{
        userId:2,
        userName:'李四',
        userContact:'17712345677'
      },{
        userId:3,
        userName:'王五',
        userContact:'18712345678'
      },{
        userId:4,
        userName:'赵六',
        userContact:'17612345678'
      }
    ]
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupDetailPage');
    console.log(this.data1);
  }

  editgroup(){
    this.navCtrl.push('GroupEditPage',this.data1)
  }

}
