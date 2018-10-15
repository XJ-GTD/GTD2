import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from "@angular/common/http";
import { ParamsService } from "../../service/params.service";
import { GroupModel } from "../../model/group.model";
import { LabelOutModel } from "../../model/out/label.out.model";
import { AppConfig } from "../../app/app.config";
import { LabelModel } from "../../model/label.model";
import { FormBuilder } from "@angular/forms";
import { GroupMemberModel } from "../../model/groupMember.model";

/**
 * Generated class for the GroupAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-add',
  templateUrl: 'group-add.html',
})
export class GroupAddPage {

  data: any;

  groupMemberList: Array<GroupMemberModel>;   //动态添加
  groupMember: GroupMemberModel;    //群成员

  isAddOrEdit: boolean = true; //false:编辑 true:新增

  addType: string;    //页面标题
  playerDetail: GroupModel;   //参与人详情
  playerType: string;   //参与人类型 person:个人  group：群组

  labelFind: LabelOutModel;   //标签查询用
  labels: Array<LabelModel>;   //标签数据

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: HttpClient,
              private formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              private paramsService: ParamsService) {

    this.init();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupAddPage');
  }

  init() {
    this.playerType = this.paramsService.groupType;

    this.playerDetail = new GroupModel();

    if (this.paramsService.group != null) {
      this.addType = "编辑";
      this.isAddOrEdit = !this.isAddOrEdit;
      this.playerDetail = this.paramsService.group;

      this.groupMemberList = this.playerDetail.groupMembers;
      this.groupMember = this.groupMemberList[0];
      for (let i = 0; i < this.groupMemberList.length; i++) {
        this.groupMemberList[i].index = i + 1;
      }

      this.playerDetail.labelIds = [];
      for (let i = 0; i < this.playerDetail.labelList.length; i++) {
        this.playerDetail.labelIds.push(this.playerDetail.labelList[i].labelId);
      }
    } else {
      this.addType = "新增";
      this.groupMember = new GroupMemberModel();
      this.groupMemberList = [];

      this.groupMember.index = 1;
      this.groupMemberList.push(this.groupMember);

    }

    if (this.playerType == 'person') {
      this.findLabel(3);
    }else if (this.playerType == 'group') {
      this.findLabel(1);
    }

  }


  //提交保存
  savePlayer(type) {

    if (type == "编辑") {
      this.updatePlayer();
    } else if (type == "新增") {
      this.addPlayer();
    }
  }

  //创建新参与人
  addPlayer() {
    if (this.playerType == 'person') {
      this.playerDetail.userId = this.paramsService.user.userId;
      this.playerDetail.groupMembers = this.groupMemberList;
      this.playerDetail.groupName = this.groupMemberList[0].userName;
      this.playerDetail.labelIds = [];
      this.playerDetail.labelIds.push(this.labels[0].labelId);
      this.playerDetail.groupHeadImg = "./assets/imgs/headImg.jpg";
    } else if (this.playerType == 'group') {
      this.playerDetail.userId = this.paramsService.user.userId;
      this.playerDetail.groupMembers = this.groupMemberList;
      this.playerDetail.groupHeadImg = "./assets/imgs/headImg.jpg";
    }

    this.http.post(AppConfig.GROUP_ADD_GROUP_URL, this.playerDetail, AppConfig.HEADER_OPTIONS_JSON)
      .subscribe(data => {
        console.log("data: " + data);
        this.data = data;
        let loader = this.loadingCtrl.create({
          content: this.data.message,
          duration: 1000
        });

        if (this.data.code == 0) {
          loader.present();
          this.goBack();
        } else {
          console.log("group add error message: " + this.data.message);
          loader.present();
        }
      })
  }

  //更新参与人
  updatePlayer() {
    this.playerDetail.userId = this.paramsService.user.userId;
    this.playerDetail.groupMembers = this.groupMemberList;
    this.playerDetail.groupHeadImg = "./assets/imgs/headImg.jpg";

    this.http.post(AppConfig.GROUP_UPDATE_GROUP_URL, this.playerDetail, AppConfig.HEADER_OPTIONS_JSON)
      .subscribe(data => {
        console.log("data: " + data);
        this.data = data;
        let loader = this.loadingCtrl.create({
          content: this.data.message,
          duration: 1000
        });

        if (this.data.code == 0) {
          loader.present();
          this.goBack();
        } else {
          console.log("group add error message: " + this.data.message);
          loader.present();
        }
      })
  }

  //群组添加/删除成员
  //1加2减
  dyAddGroupMember(flag) {
    console.log("add member");
    if (flag == 1)  {
      this.groupMember = new GroupMemberModel();
      this.groupMember.index = this.groupMemberList.length + 1;
      this.groupMemberList.push(this.groupMember);
    } else if (flag == 2) {
      this.groupMemberList.pop();
    }

  }


  //查询系统标签
  findLabel(type) {
    this.labelFind = new LabelOutModel();
    this.labelFind.userId = this.paramsService.user.userId;
    this.labelFind.findType = type;  //暂为硬代码，默认群组

    this.http.post(AppConfig.USER_LABEL_URL, this.labelFind, AppConfig.HEADER_OPTIONS_JSON)
      .subscribe(data => {
        this.data = data;
        if (this.data.code == 0) {
          this.labels = [];
          this.labels = this.data.data.labelList;

        } else {
          let loader = this.loadingCtrl.create({
            content: "服务器繁忙，请稍后再试",
            duration: 1000
          });
          loader.present();
        }
      })
  }

  goBack() {
    // 重写返回方法
    this.paramsService.group=null;
    this.paramsService.groupType = null;
    // this.navCtrl.pop();
    this.navCtrl.setRoot('GroupListPage',{popPage: this.navParams.get("popPage")});
  }
}
