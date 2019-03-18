import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {GlService} from "./gl.service";
import {GcService, PageDcData} from "../gc/gc.service";

/**
 * Generated class for the 群组列表 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gl',
  template:`
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons left>
          <button ion-button icon-only (click)="goBack()" color="danger">
            <ion-icon name="arrow-back"></ion-icon>
          </button>
        </ion-buttons>
        <ion-title>群组</ion-title>
        <ion-buttons right>
          <button ion-button (click)="toGroupCreate()" color="danger">
            <ion-icon name="add"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <ion-grid>
        <ion-row>
          <ion-list no-lines>
            <ion-item class="plan-list-item" *ngFor="let g of gl">
              {{g.gn}}
              <button ion-button color="danger" (click)="delGroup(g)" clear item-end>删除</button>
            </ion-item>
          </ion-list>
        </ion-row>
      </ion-grid>
    </ion-content>
`,
})
export class GlPage {
  gl:Array<PageDcData> = new Array<PageDcData>()

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public view: ViewController,
              private gcService:GcService,
              private glService:GlService,
              public modalCtrl: ModalController) {

  }

  ionViewDidLoad() {
    this.getGroups()
    console.log('ionViewDidLoad PaPage');
  }


  toGroupMember(g){
    // console.log('PaPage跳转PdPage');
    // this.navCtrl.push('PdPage',{g:g});
  }

  toGroupCreate(){
    this.modalCtrl.create(ModalContentPage,2);
   // alert("123");
    // if(this.uo.uty == '0'){
    //   this.navCtrl.push(PageConfig._LP_PAGE,{"rePage":PageConfig._GL_PAGE})
    //   return;
    // }
    // console.log('PaPage跳转PePage');
    // this.navCtrl.push("PePage");
  }

  getGroups(){
    this.glService.getGroups().then(data=>{
      this.gl = data.gl;
    }).catch(e=>{
      alert(e.message);
    })
  }

  goBack() {
    this.navCtrl.pop();
  }

  queryPerson(){
    // this.relmemService.getrus("","","","","0").then(data=>{
    //   console.log(data);
    //   if(data.us != null && data.us.length > 0){
    //     console.log(data.us.length + "联系人不为空::" + data.us);
    //     this.us = data.us;
    //   }else{
    //     console.log("个人查询为空");
    //     this.us = undefined;
    //   }
    // }).catch( reason => {
    //   console.log("个人查询错误::" + reason.message);
    //   this.us = undefined;
    // });
  }

  delPerson(u){
    // this.relmemService.delRu(u.id).then(data=>{
    //   if(data.code == 0){
    //     console.log("个人删除成功");
    //     this.queryPerson()
    //   }else{
    //     console.log("个人删除失败");
    //   }
    // }).catch(reason => {
    //   console.log("个人删除异常::" + reason.message);
    // })
  }

  delGroup(g:PageDcData){
    this.gcService.delete(g.gi).then(data=>{
      if(data.code==0){
        this.getGroups();
        console.log('delGroup ============== 删除成功')
      }

    })
    // this.relmemService.delRu(g.id).then(data=>{
    //   if(data.code == 0){
    //     console.log("群组删除成功");
    //     this.queryGroup()
    //   }else{
    //     console.log("群组删除失败");
    //   }
    // }).catch(reason => {
    //   console.log("群组删除异常::" + reason.message);
    // })
  }

  queryGroup(){
    // this.relmemService.getrus(null,null,null,null,'1').then(data=>{
    //   if(data.code == 0 && data.us != null && data.us.length > 0 ){
    //     console.log("查询群组成功");
    //     this.gs = data.us;
    //   }else{
    //     console.log("查询群组为空");
    //     this.gs = undefined;
    //   }
    // }).catch(reason => {
    //   console.log("查询群组失败");
    //   this.gs = undefined;
    //
    // });
  }

  ionViewWillEnter(){
    // console.log("查询登陆用户");
    // this.uo = DataConfig.uInfo;
    // console.log("查询个人");
    // this.queryPerson();
    // console.log("查询群组");
    // this.queryGroup();
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


@Component({
  template: `
<ion-header>
  <ion-toolbar>
    <ion-title>
      Description
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <span ion-text color="primary" showWhen="ios">Cancel</span>
        <ion-icon name="md-close" showWhen="android, windows"></ion-icon>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-list>
      <ion-item>
        <ion-avatar item-start>
          <img src="{{character.image}}">
        </ion-avatar>
        <h2>{{character.name}}</h2>
        <p>{{character.quote}}</p>
      </ion-item>

      <ion-item *ngFor="let item of character['items']">
        {{item.title}}
        <ion-note item-end>
          {{item.note}}
        </ion-note>
      </ion-item>
  </ion-list>
</ion-content>
`
})
export class ModalContentPage {
  character;

  constructor(
    // public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    var characters = [
      {
        name: 'Gollum',
        quote: 'Sneaky little hobbitses!',
        image: 'assets/img/avatar-gollum.jpg',
        items: [
          { title: 'Race', note: 'Hobbit' },
          { title: 'Culture', note: 'River Folk' },
          { title: 'Alter Ego', note: 'Smeagol' }
        ]
      },
      {
        name: 'Frodo',
        quote: 'Go back, Sam! I\'m going to Mordor alone!',
        image: 'assets/img/avatar-frodo.jpg',
        items: [
          { title: 'Race', note: 'Hobbit' },
          { title: 'Culture', note: 'Shire Folk' },
          { title: 'Weapon', note: 'Sting' }
        ]
      },
      {
        name: 'Samwise Gamgee',
        quote: 'What we need is a few good taters.',
        image: 'assets/img/avatar-samwise.jpg',
        items: [
          { title: 'Race', note: 'Hobbit' },
          { title: 'Culture', note: 'Shire Folk' },
          { title: 'Nickname', note: 'Sam' }
        ]
      }
    ];
    this.character = characters[this.params.get('charNum')];
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
