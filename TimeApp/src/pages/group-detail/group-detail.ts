import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import { AppConfig } from "../../app/app.config";
import { HttpClient } from "@angular/common/http";
import {ParamsService} from "../../service/params.service";
import {FindOutModel} from "../../model/out/find.out.model";
import {GroupModel} from "../../model/group.model";

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

  groupId:number;//
  data1: any;
  groupFind:FindOutModel;
  groupDetail: GroupModel;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpClient,
              public loadingCtrl: LoadingController,
              private paramsService: ParamsService) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupDetailPage');
    this.init();
  }

  init() {
    this.groupFind = new FindOutModel();
    this.groupFind.userId = this.paramsService.user.userId;   //获取当前用户Id
    this.groupDetail = new GroupModel();
    this.groupDetail = this.paramsService.group;            //获取上个页面点击的群组Id
    //请求查询详情
    // this.http.post(AppConfig.GROUP_FIND_SINGLE_URL,this.groupFind)
    //   .subscribe(data => {
    //   this.data1 = data
    //   // console.log(this.data1.data.group);
    //   let loader = this.loadingCtrl.create({
    //     content: this.data1.message,
    //     duration: 1500
    //   });
    //   if (this.data1.code == "0") {
    //     loader.present();
    //   } else {
    //     loader.present();
    //   }
    // })
  }

  editgroup(){
    this.navCtrl.push('GroupEditPage')
  }

}
