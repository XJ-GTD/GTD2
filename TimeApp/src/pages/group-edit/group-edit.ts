import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

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
  testCheckboxOpen:boolean = false;//判断组件是否展示
  testCheckboxLabel:any;//选择的标签
  testCheckboxMember:any;//选择的成员

  groupMember:any=[{'userContact':12345678,'userId':1,'userName':"scarecrow"},{'userContact':321321,'userId':1,'userName':"admin"}]

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController) {
    this.data1 = this.navParams.get('data1');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupEditPage');
  }

  showLabelCheckbox(){
    if(this.data1==null){
      alert('123')
      //查询所有标签
    }else {
      let alert = this.alertCtrl.create();
      alert.setTitle('添加新标签');

      for (let item of this.data1.data.group.groupLabel){
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
  }

  showMemberCheckbok(){
    // alert(123);
    if(this.data1==null){
      //调用查询个人
      alert('保存成功')
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

  savegroup(groupName:HTMLInputElement){
    //调用保存接口
    // console.log(groupName.value)
    alert('保存成功')
  }

}


//1 查询所有标签.赋值给value
//2 查询群成员,获取名字和手机号赋值给
//3 把选择的标签和群成员调用接口 传进去
//4根据返回的数据跳转对应的界面
//
