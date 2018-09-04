import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
})
export class GroupListPage {
  data22:object;
  groupORperson: boolean = true;
  groupORpersonname:String;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.data22 = [
      {
        labelId:2,
        qunzu:{
          groupList:[{
            groupId:1,
						groupName:'开发1组',
            groupLabel:[{
              labelId:1,
              labelName:'工作',
              labelType:2,
              userId:2,
              userName:'李四',
              userContact:'13255876092'
            },{
              labelId:1,
              labelName:'生活',
              labelType:2,
              userId:2,
              userName:'李四',
              userContact:'13255876092'
            },{
              labelId:1,
              labelName:'娱乐',
              labelType:2,
              userId:2,
              userName:'李四',
              userContact:'13255876092'
            }]
          },{
            groupId:1,
            groupName:'开发2组',
            groupLabel:[{
              labelId:1,
              labelName:'工作',
              labelType:2,
              userId:2,
              userName:'李四',
              userContact:'13255876092'
            },{
              labelId:1,
              labelName:'生活',
              labelType:2,
              userId:2,
              userName:'李四',
              userContact:'13255876092'
            },{
              labelId:1,
              labelName:'娱乐',
              labelType:2,
              userId:2,
              userName:'李四',
              userContact:'13255876092'
            }]
          }]
        }
      },
      {
        labelId:8,
        qunzu:{
          groupList:[{
            groupId:1,
            groupName:'赵六',
            groupLabel:[{
              labelId:1,
              labelName:'娱乐',
              labelType:2,
              userId:4,
              userName:'赵六',
              userContact:'13255876092'
            }]
          },{
            groupId:3,
            groupName:'李四',
            groupLabel:[{
              labelId:1,
              labelName:'娱乐',
              labelType:2,
              userId:4,
              userName:'李四',
              userContact:'13255876092'
            }]
          }]
        }
      }
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupListPage');
  }

  xiangqing(groupORindividual){
    console.log(groupORindividual)
    this.navCtrl.push('GroupDetailPage',{name:groupORindividual})
  }

  gerenxiangqing(individual){
    console.log(individual)
    this.navCtrl.push('GroupPersonalEditPage',{datas:individual})
  }

  addORedit(){
    this.navCtrl.push('GroupEditPage')
  }

  edit(){
    if(this.groupORperson==false){
      this.groupORperson=true;
      this.groupORpersonname='群组'
    }else {
      this.groupORperson=false;
      this.groupORpersonname='个人'
    }
    console.log(this.groupORperson)
  }

}
