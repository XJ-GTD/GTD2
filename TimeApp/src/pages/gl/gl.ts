import {Component} from '@angular/core';
import {
  AlertController, IonicPage, ModalController, NavController, NavParams, Platform,
  ViewController
} from 'ionic-angular';
import {GlService} from "./gl.service";
import {GcService, PageDcData} from "../gc/gc.service";
import {GcPage} from "../gc/gc";
import {DomSanitizer} from "@angular/platform-browser";
import {DataConfig} from "../../service/config/data.config";

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
            <!--<img class="img-header-left" src="../../assets/imgs/fh2.png">-->
          </button>
        </ion-buttons>
        <ion-title>群组</ion-title>
        <ion-buttons right>
          <button ion-button (click)="toGroupCreate()" color="danger">
            <ion-icon name="add"></ion-icon>
            <!--<img class="img-header-left" src="../../assets/imgs/tj.png">-->
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <ion-grid>
        <ion-row>
          <ion-list no-lines>
            <ion-item class="plan-list-item"  *ngFor="let g of gl">
              <ion-label (click)="toGroupMember(g)" style="background-color: black;color:#ffffff">
                {{g.gn}}({{g.gc}})
              </ion-label>
              <button ion-button color="danger" (click)="delGroup(g)" clear item-end>
                <img class="content-gc" src="./assets/imgs/del_group.png">
              </button>
            </ion-item>
          </ion-list>
        </ion-row>
      </ion-grid>
    </ion-content>
`,
})
export class GlPage {
  gl:Array<PageDcData> = new Array<PageDcData>();
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public view: ViewController,
              private gcService:GcService,
              private glService:GlService,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaPage');
  }
  ionViewDidEnter(){
    console.log("3.0 ionViewDidEnter 当进入页面时触发");
    this.getGroups();
  }

  toGroupMember(g){
    console.log('=======跳转:' + DataConfig.PAGE._GC_PAGE);
    this.navCtrl.push(DataConfig.PAGE._GC_PAGE,{g:g});
  }

  toGroupCreate(){
    let profileModal = this.modalCtrl.create(DataConfig.PAGE._GA_PAGE);
    profileModal.present();
  }

  getGroups(){
    this.glService.getGroups().then(data=>{
      this.gl = data.gl;
    }).catch(e=>{
      alert(e.message);
    })
  }

  goBack() {
    console.log('=======跳转:' + DataConfig.PAGE._M_PAGE);
    this.navCtrl.push(DataConfig.PAGE._M_PAGE);
  }

  queryPerson(){

  }

  delPerson(u){

  }

  delGroup(g:PageDcData){
    this.gcService.delete(g.gi).then(data=>{
      if(data.code==0){
        this.getGroups();
        console.log('delGroup ============== 删除成功')
      }

    })
  }

  queryGroup(){

  }

  ionViewWillEnter(){
    // console.log("查询登陆用户");
    // this.uo = DataConfig.uInfo;
    // console.log("查询个人");
    // this.queryPerson();
    // console.log("查询群组");
    // this.queryGroup();
  }


  // toGroupCreate(){
  //   let alert = this.alertCtrl.create({
  //     title: '新建群组',
  //     cssClass:'gl-alert-top',
  //     inputs: [
  //       {
  //         name: 'title',
  //         placeholder: '群组名称'
  //       },
  //     ],
  //     buttons: [
  //       {
  //         text: "√",
  //         cssClass:'gl-alert-button',
  //         handler: data => {
  //           let tt = data.title;
  //           // console.log('title:' + tt);
  //           if(tt == null || tt ==""){
  //             return false;
  //             //this.toGroupCreate()
  //           }else{
  //             let dc:PageDcData = new PageDcData();
  //             dc.gn = tt;
  //             this.gcService.save(dc).then(data=>{
  //               if(data.code == 0){
  //                 this.getGroups();
  //               }
  //             })
  //           }
  //
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

}

