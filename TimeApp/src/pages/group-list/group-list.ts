import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import { AppConfig } from "../../app/app.config";
import { HttpClient } from "@angular/common/http";
import {ParamsService} from "../../service/params.service";
import {groupList} from "../../model/out/groupList.out.model";
import {FindOutModel} from "../../model/out/find.out.model";

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
  data:any;//数据源
  groupFind:FindOutModel;//用户Id
  groupORperson: boolean = true;//判断是群组还是个人
  groupORpersonname:String;//界面显示
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              private http: HttpClient,
              private paramsService: ParamsService) {
    this.groupFind = new FindOutModel();
    this.groupFind.userId = this.paramsService.user.userId;
    this.groupFind.findType = 2;//默认查询群组
  }

  //调用查询群组/个人接口
  connectors(){
    this.http.post(AppConfig.GROUP_FIND_URL,{
        userId:this.groupFind.userId,
        findType:this.groupFind.findType,
      }
    ).subscribe(data => {
      if(this.groupFind.userId==0&&this.groupFind.userId==null){
        console.log("登陆或网络出错   请重新登陆！")
      }else {
        this.data = data;
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
      }
    })

  }

  ionViewDidLoad() {
    this.connectors();
  }

  //带参数跳转群组详情页面
  xiangqing(groupORindividual){
    this.navCtrl.push('GroupDetailPage',{groupId:groupORindividual})
  }

  //带参数跳转个人页面
  gerenxiangqing(individual){
    this.navCtrl.push('GroupPersonalEditPage',{groupId:individual})
  }

  //跳转修改页面
  addORedit(){
    this.navCtrl.push('GroupEditPage')
  }


  edit(){
    if(this.groupORperson==false){
      this.groupORperson=true;
      this.groupORpersonname='群组'
      this.groupFind.findType = 2;
    }else {
      this.groupORperson=false;
      this.groupORpersonname='个人'
      this.groupFind.findType = 1;
    }
    this.connectors()
  }

}
