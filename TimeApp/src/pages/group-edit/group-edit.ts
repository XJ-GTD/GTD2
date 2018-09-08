import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AppConfig } from "../../app/app.config";
import {HttpClient} from "@angular/common/http";
import {ParamsService} from "../../service/params.service";
import {FindOutModel} from "../../model/out/find.out.model";

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

  data1: any;//上个页面传过来的数据
  labeldata:any;
  member:any;
  testCheckboxOpen:boolean = false;//判断组件是否展示
  testCheckboxLabel:any;//选择的标签
  testCheckboxMember:any;//选择的成员
  groupFind:FindOutModel;//群组成员

  groupMember:any=[{'userContact':12345678,'userId':1,'userName':"scarecrow"},{'userContact':321321,'userId':1,'userName':"admin"}]//死数据，等接口

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private http: HttpClient,
              private paramsService: ParamsService) {
    this.groupFind = new FindOutModel();
    this.groupFind.userId = this.paramsService.user.userId;
    this.groupFind.findType = 1;
    this.data1 = this.navParams.get('data1');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupEditPage');
    this.selectLabelAll();
    this.selectMemberAll();
    console.log(this.data1)
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
    // console.log(this.groupFind.userId,this.data1.data.group.groupId)
    // this.http.post(AppConfig.GROUP_FIND_GROUPMEMBER_URL,{
    //   uesrId:this.groupFind.userId,
    //   groupId:this.data1.data.group.groupId,
    //   findType:2
    // }).subscribe(data => {
    //   console.log(data)
    //   // if(this.groupFind.userId==0&&this.groupFind.userId==null){
    //   //   console.log("登陆或网络出错   请重新登陆！")
    //   // }else {
    //     this.member = data;
    //     let loader = this.loadingCtrl.create({
    //       content: this.member.message,
    //       duration: 1500
    //     });
    //     if (this.labeldata.code == "0") {
    //       loader.present();
    //     } else {
    //       loader.present();
    //     }
    //   // }
    // })

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
    if(this.data1==null){
      //调用查询个人
      console.log('保存成功')
    }else {
      let alert = this.alertCtrl.create();
      alert.setTitle('添加新成员')

      for (let item of this.groupMember) {
        alert.addInput({
          type:'checkbox',
          label:item.userName,
          value:item
        });
      }
      alert.addButton('取消');
      alert.addButton({
        text: '确定',
        handler: data => {
          console.log('Checkbox data:', data);
          this.testCheckboxOpen = false;
          this.testCheckboxMember = data;
          // console.log(this.testCheckboxMember);
        }
      });
      alert.present();
    }
  }

  //添加/删除成员方法
  savegroup(groupName1:HTMLInputElement){
    //调用保存接口
    // console.log(groupName1.value)
    this.http.post(AppConfig.GROUP_ADD_GROUP_URL,{
      "userId":"1",
        "labelId":[1],
        "groupName":"工作群",
        "groupHeadImgUrl":"123",
        "member":[{
          "userId":"1",
          "userName":"scarecrow",
          "userContact":"13721123456"
      }]
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
    // console.log('保存成功')
  }

}


//1 查询所有标签.赋值给value
//2 查询群成员,获取名字和手机号赋值给
//3 把选择的标签和群成员调用接口 传进去
//4 根据返回的数据跳转对应的界面
