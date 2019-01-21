import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {UEntity} from "../../entity/u.entity";
import {RelmemService} from "../../service/relmem.service";
import {RuModel} from "../../model/ru.model";
import {PageConfig} from "../../app/page.config";

/**
 * Generated class for the PgPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pg',
  // templateUrl: 'pg.html',
  template:'<ion-header>\n' +
  '\n' +
  '  <ion-navbar [hideBackButton]="true">\n' +
  '    <ion-buttons left>\n' +
  '      <button ion-button icon-only (click)="goBack()">\n' +
  '        取消\n' +
  '      </button>\n' +
  '    </ion-buttons>\n' +
  '    <ion-title>选择群成员</ion-title>\n' +
  '    <ion-buttons right>\n' +
  '      <button ion-button icon-only (click)="showSelect()">\n' +
  '        确定\n' +
  '      </button>\n' +
  '    </ion-buttons>\n' +
  '  </ion-navbar>\n' +
  '\n' +
  '</ion-header>\n' +
  '\n' +
  '\n' +
  '<ion-content padding class="page-backgroud-color">\n' +
  '  <div *ngFor="let u of us">\n' +
  '    <ion-item>\n' +
  '      <ion-avatar item-start >\n' +
  '        <img src="http://file03.sg560.com/upimg01/2017/01/932752/Title/0818021950826060932752.jpg">\n' +
  '      </ion-avatar>\n' +
  '      <ion-label>\n' +
  '        <p style="color: #000; line-height: 17px;font-size: 1.7rem">{{u.ran}}</p>\n' +
  '        <!--<p>皮一下很开心</p>-->\n' +
  '      </ion-label>\n' +
  '      <ion-checkbox item-end (ionChange)="selected(u,$event)" [checked]="checkSel(u)"></ion-checkbox>\n' +
  '    </ion-item>\n' +
  '  </div>\n' +
  '</ion-content>\n',
})
export class PgPage {

  uo:UEntity;

  us:Array<RuModel>;
  sel:Array<RuModel> =  Array<RuModel>();
  callback:any;
  // g:RuModel;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private relmemService: RelmemService,
              private viewCtrl: ViewController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PgPage');
    this.queryAllRel();
    this.callback = this.navParams.get("callback");
    this.sel = this.navParams.get("sel");
    // this.g = this.navParams.get("g");
    if(this.sel != undefined){
      console.log(this.sel.length)
    }
  }



  goBack() {
    this.navCtrl.pop();
  }

  showSelect(){
    console.log("点击确定");

    // this.callback(this.sel).then(()=>{
    //   console.log("PgPage跳转PePage")
    //   this.navCtrl.pop();
    // })
    // this.relmemService.addRgus(this.g.id,this.sel).then(data=>{
    //   console.log("增加成员成功 :: " + JSON.stringify(data));
    //   this.viewCtrl.dismiss(this.sel);
    // }).catch(reason => {
    //   console.log("增加成员失败 :: " + JSON.stringify(reason));
    //   this.viewCtrl.dismiss(this.sel);
    // });

    this.viewCtrl.dismiss(this.sel);

  }


  queryAllRel(){
    this.relmemService.getrus(null,null,null,null,'0').then(data=>{
      console.log(data.us.length)
      if(data.code == 0){
        this.us = data.us;
      }
    }).catch(reason => {

    })
  }

  selected(u,event){
    if(this.sel == undefined){
      this.sel = new Array<RuModel>();
    }
    if(event.checked){
      this.sel.push(u)
    }else{
      let tmp = new Array<RuModel>();
      for(let i = 0;i<this.sel.length;i++){
        if(u.id != this.sel[i].id){
          tmp.push(this.sel[i]);
        }
      }
      this.sel = tmp;
    }
    console.log(this.sel.length)
  }

  checkSel(u){
    if(this.sel == undefined){
      return false;
    }
    let tmp = new Array<RuModel>();
    for(let i = 0;i<this.sel.length;i++){
      if(u.id == this.sel[i].id){
        return true;
      }
    }
    return false;
  }


  // ionViewDidLoad(){
  //   console.log("1.0 ionViewDidLoad 当页面加载的时候触发，仅在页面创建的时候触发一次，如果被缓存了，那么下次再打开这个页面则不会触发");
  // }
  // ionViewWillEnter(){
  //   console.log("2.0 ionViewWillEnter 顾名思义，当将要进入页面时触发");
  // }
  // ionViewDidEnter(){
  //   console.log("3.0 ionViewDidEnter 当进入页面时触发");
  // }
  // ionViewWillLeave(){
  //   console.log("4.0 ionViewWillLeave 当将要从页面离开时触发");
  // }
  // ionViewDidLeave(){
  //   console.log("5.0 ionViewDidLeave 离开页面时触发");
  // }
  // ionViewWillUnload(){
  //   console.log("6.0 ionViewWillUnload 当页面将要销毁同时页面上元素移除时触发");
  // }
  //
  // ionViewCanEnter(){
  //   console.log("ionViewCanEnter");
  // }
  //
  // ionViewCanLeave(){
  //   console.log("ionViewCanLeave");
  // }

}
