import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import { AppConfig } from "../../app/app.config";
import { HttpClient } from "@angular/common/http";
import {ParamsService} from "../../service/params.service";
import {groupList} from "../../model/out/groupList.out.model";
import {FindOutModel} from "../../model/out/find.out.model";
import {GroupModel} from "../../model/group.model";

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
  findFlag: boolean = false;//判断是群组还是个人
  groupORpersonname:String;//界面显示
  groupList: Array<GroupModel>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private http: HttpClient,
              private paramsService: ParamsService) {

  }

  ionViewDidLoad() {
    this.init();
  }

  //调用查询群组/个人接口
  init(){
    this.groupFind = new FindOutModel();
    this.groupFind.userId = this.paramsService.user.userId;
    this.edit();
    this.http.post(AppConfig.GROUP_FIND_URL, this.groupFind)
      .subscribe(data => {
        this.data = data;
        let loader = this.loadingCtrl.create({
          content: this.data.message,
          duration: 1500
        });
        if (this.data.code == 0) {
          this.groupList = [];
          this.groupList = this.data.data.groupList;

        } else if (this.data.code == -1) {
          loader.present();
          console.log(this.data.message);
        } else {
          loader.present();
          console.log(this.data.message);
        }
        /*if(this.groupFind.userId == 0 && this.groupFind.userId == null){
          console.log("登陆或网络出错   请重新登陆！")
        }else {
          this.data = data;

          if (this.data.code == "0") {
            loader.present();
            // this.navCtrl.push('HomePage');
          } else {
            loader.present();
          }
        }*/
      })

  }

  //带参数跳转详情页面
  groupShowDetail(groupDetail){
    this.paramsService.group = groupDetail;
    this.navCtrl.push('GroupDetailPage');
  }


  //跳转修改页面
  addORedit(){
    this.navCtrl.push('GroupEditPage')
  }


  edit(){
    if(this.findFlag == false){
      this.findFlag = true;
      this.groupORpersonname='群组';
      this.groupFind.findType = 2;
    }else {
      this.findFlag = false;
      this.groupORpersonname='个人';
      this.groupFind.findType = 1;
    }
  }

}
