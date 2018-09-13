import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, Navbar, NavController, NavParams} from 'ionic-angular';
import {AppConfig} from "../../app/app.config";
import { HttpClient } from "@angular/common/http";
import {FindOutModel} from "../../model/out/find.out.model";
import {GroupModel} from "../../model/group.model";
import {ParamsService} from "../../service/params.service";
// import {groupMembers, groupMembers} from "../../model/out/groupMembers.out.model";

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
  data:any;//接口返回数据
  member:any;//接收群成员

  groupFind:FindOutModel;//用户信息传入
  groupDetail: GroupModel;//群组信息传入
  groupName:string;//用户输入的联系人名称
  userContact:string;//用户输入的联系人电话

  @ViewChild(Navbar) navBar: Navbar;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpClient,
              public loadingCtrl: LoadingController,
              private paramsService: ParamsService) {
    this.init();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupPersonalEditPage');
    this.navBar.backButtonClick = this.backButtonClick;
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.paramsService.group=null;
    this.navCtrl.pop();
  }

  init() {
    this.groupFind = new FindOutModel();
    this.groupFind.userId = this.paramsService.user.userId;   //获取当前用户Id
    this.groupDetail = new GroupModel();
    this.groupDetail = this.paramsService.group;            //获取上个页面点击的群组Id
    this.getPersonal();
  }

  //点击事件方法
  personaledit(){
    if(this.groupDetail==null&&this.groupDetail==undefined){
      this.addPersonal();
    }else {
      this.dataPersonal();
      this.updatePersonal();
    }
  }

  //处理群成员数据方法
  dataPersonal(){
    for (let i of this.member){
      if(i.memberStatus==1){
        this.member = i
      }
    }
    this.member.memeberName = this.groupName;
    this.member.memeberContact = this.userContact;
  }

  //添加添加接口
  addPersonal(){
    this.http.post(AppConfig.GROUP_ADD_GROUP_URL,{
      "userId":this.groupFind.userId,
      "labelId":8,
      "groupName":this.groupName,
      "groupHeadImgUrl":"123",
      "member":[{"userName":this.groupName,"userContact":this.userContact}]
    }).subscribe(data => {
      this.data = data;

        let loader = this.loadingCtrl.create({
          content: this.data.message,
          duration: 1500
        });
        if (this.data.code == "0") {
          loader.present();
          console.log('保存成功');
          this.navCtrl.push('HomePage');
        } else {
          loader.present();
        }
    })
  }

  // 修改接口
  updatePersonal(){
    console.log(this.member)
    this.http.post(AppConfig.GROUP_UPDATE_GROUP_URL,{
      userId:this.groupFind.userId,
      groupId:this.groupDetail.groupId,
      labelId:8,
      groupName:this.groupName,
      groupHeadImgUrl:"233333",
      member:this.member
    }).subscribe(data => {
      this.data = data;
      let loader = this.loadingCtrl.create({
        content: this.data.message,
        duration: 1500
      });
      if (this.data.code == "0") {
        loader.present();
        console.log('修改成功')
        this.navCtrl.push('HomePage');
      } else {
        loader.present();
      }
    })
  }

  //获取成员
  getPersonal(){

    if(this.groupDetail!=null&&this.groupDetail!=undefined){
      this.http.post(AppConfig.GROUP_FIND_GROUPMEMBER_URL,{
        userId:this.groupFind.userId,
        groupId:this.groupDetail.groupId,
        findType:2
      }).subscribe(data => {
        this.data = data;
        console.log("输出群成员",data)
        let loader = this.loadingCtrl.create({
          content: this.data.message,
          duration: 1500
        });
        if (this.data.code == "0") {
          loader.present();
          this.member= this.data.data.groupMemberList;
        } else {
          loader.present();
        }
      })
    }
  }
}
