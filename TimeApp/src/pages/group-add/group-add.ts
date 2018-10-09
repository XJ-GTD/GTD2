import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, Navbar, NavController, NavParams} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {ParamsService} from "../../service/params.service";
import {GroupModel} from "../../model/group.model";
import {LabelOutModel} from "../../model/out/label.out.model";
import {AppConfig} from "../../app/app.config";
import {LabelModel} from "../../model/label.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GroupMemberModel} from "../../model/groupMember.model";

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
  label: Array<LabelModel>;   //标签数据

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
      this.playerDetail = this.paramsService.group;
    } else {
      this.addType = "新增";
      this.groupMember = new GroupMemberModel();
      this.groupMemberList = [];

      this.groupMember.index = 1;
      this.groupMemberList.push(this.groupMember);
    }

    this.findLabel();

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
    this.playerDetail.userId = this.paramsService.user.userId;
    this.playerDetail.groupMembers = this.groupMemberList;
    this.playerDetail.groupHeadImgUrl = "./assets/imgs/headImg.jpg";
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
  findLabel() {
    this.labelFind = new LabelOutModel();
    this.labelFind.userId = this.paramsService.user.userId;
    this.labelFind.findType = 1;  //暂为硬代码，默认群组

    this.http.post(AppConfig.USER_LABEL_URL, this.labelFind, AppConfig.HEADER_OPTIONS_JSON)
      .subscribe(data => {
        this.data = data;
        if (this.data.code == 0) {
          this.label = [];
          this.label = this.data.data.labelList;

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
    this.navCtrl.pop();
  }
}
