import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import { AppConfig } from "../../app/app.config";
import { HttpClient } from "@angular/common/http";
import {ParamsService} from "../../service/params.service";
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
    this.groupFind = new FindOutModel();
    this.groupFind.userId = this.paramsService.user.userId;
    this.groupFind.findType = 2
    this.findGroupList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupListPage');

  }

  init(){

  }

  //调用查询群组/个人接口
  findGroupList(){
    this.edit();
    this.http.post(AppConfig.GROUP_FIND_URL, {
      userId:this.groupFind.userId,
      findType:this.groupFind.findType
    })
      .subscribe(data => {
        this.data = data;
        let loader = this.loadingCtrl.create({
          content: "服务器繁忙,请稍后再试",
          duration: 1500
        });
        if (this.data.code == 0) {
          this.groupList = [];
          this.groupList = this.data.data.groupList;
          console.log("groupList:" + this.data.data.groupList);
        } else if (this.data.code == -1) {

          // loader.present();
          console.log(this.data.message);
        } else if(this.data.code == 1) {
          loader.present();  //空白页展示
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
    console.log(this.groupFind.findType)
    if(this.findFlag){
      console.log('群组')
      this.paramsService.group = groupDetail;
      this.navCtrl.push('GroupDetailPage');
    }else{
      console.log('个人')
      this.paramsService.group = groupDetail;
      this.navCtrl.push('GroupPersonalEditPage')
    }
  }


  //跳转修改页面
  addORedit(){
    if(this.findFlag){
      //跳转至添加群组页面
      console.log('群组修改')
      this.navCtrl.push('GroupEditPage')
    }else{
      //跳转至添加个人页面
      console.log('个人修改')
      this.navCtrl.push('GroupPersonalEditPage')
    }
  }


  edit(){
    if(this.findFlag == false){
      this.findFlag = true;
      this.groupFind.findType = 2;
    }else {
      this.findFlag = false;
      this.groupFind.findType = 1;
    }
  }

}
