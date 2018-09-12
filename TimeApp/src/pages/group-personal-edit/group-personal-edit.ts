import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AppConfig} from "../../app/app.config";
import { HttpClient } from "@angular/common/http";
import {FindOutModel} from "../../model/out/find.out.model";
import {GroupModel} from "../../model/group.model";
import {ParamsService} from "../../service/params.service";

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
  groupFind:FindOutModel;
  groupDetail: GroupModel;
  isEdit: boolean = true;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpClient,
              public loadingCtrl: LoadingController,
              private paramsService: ParamsService) {
    this.init();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupPersonalEditPage');
  }

  init() {
    this.groupFind = new FindOutModel();
    this.groupFind.userId = this.paramsService.user.userId;   //获取当前用户Id
    this.groupDetail = new GroupModel();
    this.groupDetail = this.paramsService.group;            //获取上个页面点击的群组Id
    this.groupDetail.isaddORedit = true;
  }

  personaledit(){
    if(this.isEdit==true){
      this.isEdit=false;
    }else {
      this.isEdit=true;
    }
  }

  //获取个人详情
  getGroup(){

  }

}
