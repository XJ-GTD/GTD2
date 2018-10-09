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

  groupLength: Array<number>;   //动态添加flag
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

  }

  //更新参与人
  updatePlayer() {

  }

  //群组添加成员
  dyAddGroupMember() {

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
