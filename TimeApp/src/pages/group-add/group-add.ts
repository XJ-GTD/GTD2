import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, Navbar, NavController, NavParams} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {ParamsService} from "../../service/params.service";
import {GroupModel} from "../../model/group.model";
import {LabelOutModel} from "../../model/out/label.out.model";
import {AppConfig} from "../../app/app.config";
import {LabelModel} from "../../model/label.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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

  PlayerForm: FormGroup;    //参与人表单验证
  groupName: any;    //群组名
  groupMemberName: any;    //群成员名
  groupMemberContact: any; //群成员联系方式

  addType: string;    //页面标题
  playerDetail: GroupModel;   //群组详情
  playerType: string;   //参与人类型 1:个人  2：群组

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
    this.playerDetail = this.paramsService.group;
    if (this.paramsService.group != null) {
      this.addType = "编辑";
    } else {
      this.addType = "新增";
    }

    this.formInit();
  }

  formInit() {
    this.PlayerForm = this.formBuilder.group({
      groupName:['',Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(10)])],
      groupMemberName: ['', Validators.compose([Validators.required, Validators.minLength(1),Validators.maxLength(10)])],
      groupMemberContact:['',Validators.compose([Validators.required, Validators.minLength(11),Validators.maxLength(11)])]

    });
    this.groupName = this.PlayerForm.controls['groupName'];
    this.groupMemberName = this.PlayerForm.controls['groupMemberName'];
    this.groupMemberContact = this.PlayerForm.controls['groupMemberContact'];
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

  //群组添加成员用
  findGroupMember() {

  }

  goBack() {
    // 重写返回方法
    this.paramsService.group=null;
    this.paramsService.groupType = null;
    this.navCtrl.pop();
  }
}
