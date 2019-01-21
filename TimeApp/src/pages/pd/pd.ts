import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Navbar, ModalController} from 'ionic-angular';
import {UEntity} from "../../entity/u.entity";
import {RelmemService} from "../../service/relmem.service";
import {RuModel} from "../../model/ru.model";
import {PageConfig} from "../../app/page.config";

/**
 * Generated class for the PdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pd',
  template:'<ion-header>' +
  '  <ion-navbar >' +
  '    <ion-title *ngIf="g != undefined">{{g.rN}}</ion-title>' +
  '    <ion-buttons right margin-right>' +
  '      <button ion-button icon-only (click)="addQcy()">' +
  '        <ion-icon name="add"></ion-icon>' +
  '      </button>' +
  '    </ion-buttons>' +
  '  </ion-navbar>' +
  '</ion-header>' +
  '<ion-content padding class="page-backgroud-color">' +
  '  <ion-list>' +
  '    <ion-item-sliding *ngFor="let u of us">' +
  '      <ion-item (click)="toMemberDetail(u)">' +
  '        <ion-avatar item-start >' +
  '          <img src="http://file03.sg560.com/upimg01/2017/01/932752/Title/0818021950826060932752.jpg">' +
  '        </ion-avatar>' +
  '        <ion-label>' +
  '          <p style="color: #000;font-size: 1.7rem">{{u.ran}}</p>' +
  '          <p></p>' +
  '        </ion-label>' +
  '      </ion-item>' +
  '      <ion-item-options side="right">' +
  '        <button ion-button color="danger" (click)="delete(u)">删除</button>' +
  '      </ion-item-options>' +
  '    </ion-item-sliding>' +
  '  </ion-list>' +
  '</ion-content>',
})
export class PdPage {

  @ViewChild(Navbar) navBar: Navbar;

  uo:UEntity;
  g:RuModel;
  us:Array<RuModel>;

  qcy:Array<RuModel>;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private relmemService: RelmemService,
              private modalCtl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PdPage');
    this.navBar.backButtonClick = this.backButtonClick;
    this.navBar.setBackButtonText("");
    this.g = this.navParams.get('g');
  }

  ionViewWillEnter(){
    this.init();
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.navCtrl.pop();
  };


  init(){
    this.queryGAll();
  }

  toMemberDetail(u){
    console.log("PdPage跳转PbPage")
    this.navCtrl.push("PbPage",{u:u});
  }

  goBack(){
    this.navCtrl.pop()
  }

  queryGAll(){
    this.relmemService.getRgus(this.g.id).then(data=>{
      if(data.code == 0){
        console.log("查询群组成员成功")
        this.us = data.us;
      }else{
        console.log("查询群组成员失败")
      }
    }).catch(reason => {
      console.log("查询群组成员失败")
    })
  }

  delete(u){
    this.relmemService.delRgu(this.g.id,u.rugId).then(data=>{
      if(data.code == 0 ){
        console.log("删除群组成员成功")
        this.queryGAll();
      }else{
        console.log("删除群组成员失败")
      }
    }).catch(reason => {
      console.log("删除群组成员失败")
    })
  }

  getData = (data) =>
  {
    // return new Promise((resolve, reject) => {
    //   console.log(data);
    //   this.qcy = data;
    //   resolve();
    // });
  };

  addQcy(){
    let modal = this.modalCtl.create(PageConfig.PG_PAGE,{callback:this.getData,sel:this.us,g:this.g});
    modal.onDidDismiss((data)=>{
      console.log(data===this.us);

      console.log(JSON.stringify(data));
      this.relmemService.addRgus(this.g.id,data).then(data=>{
        console.log("添加成功")
        this.queryGAll();

      }).catch(reason => {

      })
    });
    modal.present();
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
