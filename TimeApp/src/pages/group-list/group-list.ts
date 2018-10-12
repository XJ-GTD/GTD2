import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, Navbar, NavController, NavParams} from 'ionic-angular';
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
  providers: []
})
export class GroupListPage {

  data: any;//数据源

  groupType: string = "group";    //判断是群组：group / 个人：person
  typeNameG: string = "群组";
  typeNameP: string = "个人";
  findPlayer: FindOutModel;//用户Id

  playerList: Array<GroupModel>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private http: HttpClient,
              private paramsService: ParamsService) {

    this.init();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupListPage');
  }

  init(){
    this.findPlayer = new FindOutModel();
    this.findPlayer.userId = this.paramsService.user.userId;

    this.playerList = [];
    this.findGroupList(this.groupType);

  }

  /**
   * 查询参与人列表
   * @param type 群组：group / 个人：person
   */
  findGroupList(type){
    if (type == "person") {
      this.findPlayer.findType = 1;
    } else if (type == "group") {
      this.findPlayer.findType = 2;
    }

    this.http.post(AppConfig.GROUP_FIND_URL, this.findPlayer, AppConfig.HEADER_OPTIONS_JSON)
      .subscribe(data => {
        this.data = data;
        console.log("参与人列表数据：" + this.data);

        let loader = this.loadingCtrl.create({
          content: "服务器繁忙,请稍后再试",
          duration: 1500
        });

        if (this.data.code == 0) {
          console.log("groupList:" + this.data.data.groupList);
          this.playerList = this.data.data.groupList;
        } else if (this.data.code == -1) {
          console.log(this.data.message);
          loader.present();
        } else if(this.data.code == 1) {
          this.playerList = [];
        }

      })

  }

  //新建群组/个人
  addPlayer(type){
    this.paramsService.groupType = type;
    this.paramsService.group = null;
    this.navCtrl.push('GroupAddPage',{popPage: this.navParams.get("popPage")});

  }

  //详情页面
  playerShowDetail(groupDetail){

    console.log('跳转参与人详情');
    this.paramsService.groupType = this.groupType;
    this.paramsService.group = groupDetail;
    this.navCtrl.push('GroupDetailPage');

  }

  //编辑页面
  groupEdit(groupDetail){
    console.log('跳转参与人编辑');
    this.paramsService.groupType = this.groupType;
    this.paramsService.group = groupDetail;
    this.navCtrl.push('GroupAddPage');
  }

  //删除群组
  deletePlayer(groupId) {

    this.findPlayer.groupId = groupId;
    this.findPlayer.userId = this.paramsService.user.userId;
    this.http.post(AppConfig.GROUP_DELETE_GROUP_URL, this.findPlayer, AppConfig.HEADER_OPTIONS_JSON)
      .subscribe(data => {
        this.data = data;
        console.log("删除群组：" + this.data);

        let loader = this.loadingCtrl.create({
          content: this.data.message,
          duration: 1500
        });

        if (this.data.code == 0) {
          console.log("删除群组：" + this.data.message);
          loader.present();
          this.refreshPage();
        } else if (this.data.code == -1) {
          loader.present();
        } else if(this.data.code == 1) {
          console.log("删除群组：" + this.data.message);
          loader.present()
        }

      })
  }

  refreshPage(){
    this.navCtrl.setRoot('GroupListPage', {popPage: this.navParams.get("popPage")});
  }

  //返回方法
  goBack() {
    this.navCtrl.setRoot(this.navParams.get("popPage"));
  }

}
