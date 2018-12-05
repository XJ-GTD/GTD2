import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UEntity} from "../../entity/u.entity";
import {UserService} from "../../service/user.service";
import { RelmemService} from "../../service/relmem.service";
import {RuModel} from "../../model/ru.model";

/**
 * Generated class for the PaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pa',
  templateUrl: 'pa.html',
})
export class PaPage {

  relation: any = 'group' ;
  indexs : any;
  uo:UEntity;

  us: Array<RuModel>;
  gs: Array<RuModel>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public userService: UserService,
              public relmemService: RelmemService) {
    this.init();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaPage');
    this.indexs=[1,2,3,4,5,6,7,8,9];

  }

  init(){
    console.log("查询登陆用户")
    this.userService.getUo().then(data=>{
      if(data.code == 0){
        this.uo = data.u;
      }
    }).catch(reason => {

    })
    console.log("查询个人");
    this.queryPersional();
    console.log("查询群组")
    this.queryGroup();
  }

  toAddMemebr(){
    console.log('PaPage跳转PfPage')
    this.navCtrl.push('PfPage',{uo:this.uo});
  }

  toGroupMember(g){
    console.log('PaPage跳转PdPage')
    this.navCtrl.push('PdPage',{g:g});
  }

  toGroupCreate(){
    console.log('PaPage跳转PePage')
    this.navCtrl.push("PePage");
  }

  toMemberDetail(u){
    console.log('PaPage跳转PbPage')
    this.navCtrl.push("PbPage",{u:u});
  }

  goBack() {
    this.navCtrl.pop();
  }

  queryPersional(){
    this.relmemService.getrus("","","","","0").then(data=>{
      console.log(data)
      if(data.us != null && data.us != undefined && data.us.length > 0){
        console.log(data.us.length + "联系人不为空::" + data.us);
        this.us = data.us;
      }else{
        console.log("个人查询错误")
      }
    }).catch( reason => {
      console.log("个人查询错误::" + reason.message)
    });
  }

  delPersional(u){
    this.relmemService.delRu(u.id).then(data=>{
      if(data.code == 0){
        console.log("删除成功");
        this.queryPersional()
      }else{
        console.log("删除失败");
      }
    }).catch(reason => {
      console.log("删除异常::" + reason.message);
    })
  }

  delGroup(g){
    this.relmemService.delRu(g.id).then(data=>{
      if(data.code == 0){
        console.log("删除成功");
        this.queryGroup()
      }else{
        console.log("删除失败");
      }
    }).catch(reason => {
      console.log("删除异常::" + reason.message);
    })
  }

  queryGroup(){
    this.relmemService.getrus(null,null,null,null,'1').then(data=>{
      if(data.code == 0 && data.us != null && data.us != undefined && data.us.length > 0 ){
        console.log("查询群组成功");
        this.gs = data.us;
      }else{
        console.log("查询群组失败")
      }
    }).catch(reason => {
      console.log("查询群组失败")
    });
  }

}
