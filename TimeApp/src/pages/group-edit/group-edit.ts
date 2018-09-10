import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AppConfig } from "../../app/app.config";
import {HttpClient} from "@angular/common/http";
import {ParamsService} from "../../service/params.service";
import {FindOutModel} from "../../model/out/find.out.model";
import {groupMembers} from "../../model/out/groupMembers.out.model";
import {GroupModel} from "../../model/group.model";

/**
 * Generated class for the GroupEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-edit',
  templateUrl: 'group-edit.html',
})
export class GroupEditPage {

  data1: number;//上个页面传过来的数据
  labeldata:any;
  memberdata:any;
  testCheckboxOpen:boolean = false;//判断组件是否展示
  testCheckboxLabel:any;//选择的标签
  testCheckboxMember:any;//选择的成员
  groupFind:FindOutModel;//群组成员
  groupMembers:groupMembers;


  groupDetail: GroupModel;

  isnull:boolean;//判断是创建还是修改

  groupName:string;//新增群名
  groupMemberName:string;//新增群员名字
  groupMemberContact:string;//新增群员联系方式


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private http: HttpClient,
              private paramsService: ParamsService) {
    this.init();
  }

  init(){
    this.groupFind = new FindOutModel();
    this.groupFind.userId = this.paramsService.user.userId;
    this.groupFind.findType = 1;
    this.groupDetail = new GroupModel();
    this.groupDetail = this.paramsService.group;
      // this.selectLabelAll();
      // this.selectMemberAll();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupEditPage');
    console.log(this.groupDetail.groupId)
    if(this.groupDetail.isaddORedit!=true){
      console.log(123)
    }

  }

  //获取label标签方法
  selectLabelAll(){
    this.http.post(AppConfig.USER_LABEL_URL,{
      userId:this.groupFind.userId,
      findType:this.groupFind.findType
    }).subscribe(data => {
      // console.log(data)
      if(this.groupFind.userId==0&&this.groupFind.userId==null){
        console.log("登陆或网络出错   请重新登陆！")
      }else {
        this.labeldata = data;
        let loader = this.loadingCtrl.create({
          content: this.labeldata.message,
          duration: 1500
        });
        if (this.labeldata.code == "0") {
          loader.present();
          // this.navCtrl.push('HomePage');
        } else {
          loader.present();
        }
      }
    })
  }

  //获取Member成员方法
  selectMemberAll(){
    this.http.post(AppConfig.GROUP_FIND_GROUPMEMBER_URL,{
      userId:this.groupFind.userId,
      groupId:77,
      findType:2
        }).subscribe(data => {
          // console.log(data)
          // if(this.groupFind.userId==0&&this.groupFind.userId==null){
          //   console.log("登陆或网络出错   请重新登陆！")
          // }else {
            this.memberdata = data;
            let loader = this.loadingCtrl.create({
              content: this.memberdata.message,
              duration: 1500
            });
            if (this.memberdata.code == "0") {
              loader.present();
            } else {
              loader.present();
            }
          // }
        })

  }

  //弹出label标签方法
  showLabelCheckbox(){

    if(this.data1==null){
      //查询所有标签
      this.selectLabelAll()
    }

    let alert = this.alertCtrl.create();
      alert.setTitle('添加新标签');



      for (let item of this.labeldata.data.labelList){
        console.log(item.labelId);
        alert.addInput({
          type: 'radio',
          label: item.labelName,
          value: item.labelId,
          // checked: true
        });
      }
      alert.addButton('取消');
      alert.addButton({
        text: '确定',
        handler: data => {
          console.log('Checkbox data:', data);
          this.testCheckboxOpen = false;
          this.testCheckboxLabel = data;
        }
      });
      alert.present();
  }

  //弹出成员方法
  showMemberCheckbok(){

    this.selectMemberAll()

    // if(this.data1==null){
    //   //调用查询个人
    //   console.log('保存成功')
    // }else {
    //   let alert = this.alertCtrl.create();
    //   alert.setTitle('添加新成员')
    //
    //   for (let item of this.groupMember) {
    //     alert.addInput({
    //       type:'checkbox',
    //       label:item.userName,
    //       value:item
    //     });
    //   }
    //   alert.addButton('取消');
    //   alert.addButton({
    //     text: '确定',
    //     handler: data => {
    //       console.log('Checkbox data:', data);
    //       this.testCheckboxOpen = false;
    //       this.testCheckboxMember = data;
    //       // console.log(this.testCheckboxMember);
    //     }
    //   });
    //   alert.present();
    // }
  }

  //添加/删除成员方法
  savegroup(){

    console.log("添加获取的数据",this.groupName,this.groupMemberName,this.groupMemberContact)



    //调用保存接口
    this.http.post(AppConfig.GROUP_ADD_GROUP_URL,{
      "userId":this.groupFind.userId,
        "labelId":this.testCheckboxLabel,
        "groupName":this.groupName,
        "groupHeadImgUrl":"123",
        "member":[{"userName":this.groupMemberName,"userContact":this.groupMemberContact}]   //[{"userId":"1","userName":"scarecrow","userContact":"110"}]
    }).subscribe(data => {
      // console.log(data)
      if(this.groupFind.userId==0&&this.groupFind.userId==null){
        console.log("登陆或网络出错   请重新登陆！")
      }else {
        this.labeldata = data;
        let loader = this.loadingCtrl.create({
          content: this.labeldata.message,
          duration: 1500
        });
        if (this.labeldata.code == "0") {
          loader.present();
          console.log('保存成功')
          // this.navCtrl.push('HomePage');
        } else {
          loader.present();
        }
      }
    })

  }

  // addGroupUser(){
  //
  //   this.http.post(AppConfig.GROUP_ADD_URL,{
  //
  //   })
  // }
}


//1 查询所有标签.赋值给value
//2 查询群成员,获取名字和手机号赋值给
//3 把选择的标签和群成员调用接口 传进去
//4 根据返回的数据跳转对应的界面
