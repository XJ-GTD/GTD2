import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, Navbar, NavController, NavParams} from 'ionic-angular';
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
  providers: []
})
export class GroupDetailPage {
  @ViewChild(Navbar) navBar: Navbar;

  groupFind:FindOutModel;
  groupDetail: GroupModel;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpClient,
              private loadingCtrl: LoadingController,
              private paramsService: ParamsService) {
    this.init();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupDetailPage');
    this.navBar.backButtonClick = this.backButtonClick;
    console.log('GroupDetailPage',this.groupDetail)
  }

  //默认页面初始化
  init() {
    this.groupFind = new FindOutModel();
    this.groupFind.userId = this.paramsService.user.userId;   //获取当前用户Id
    this.groupDetail = new GroupModel();
    this.groupDetail = this.paramsService.group;            //获取上个页面点击的群组Id
  }

  //跳转修改页面
  editgroup(){
    this.navCtrl.push('GroupEditPage')
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.paramsService.group=null;
    this.navCtrl.pop();
  };
}
