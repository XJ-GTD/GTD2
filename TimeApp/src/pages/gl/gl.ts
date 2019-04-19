import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {GcService} from "../gc/gc.service";
import {DataConfig} from "../../service/config/data.config";
import {UserConfig} from "../../service/config/user.config";
import {UtilService} from "../../service/util-service/util.service";
import {PageDcData} from "../../data.mapping";

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
            <img class="img-header-left" src="./assets/imgs/back.png">
          </button>
        </ion-buttons>
        <ion-title>群组</ion-title>
        <ion-buttons right>
          <button ion-button (click)="toGroupCreate()" color="danger">
            <img class="img-header-right" src="./assets/imgs/qtj.png">
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <ion-grid>
        <ion-row>
          <ion-list no-lines>
            <ion-item class="plan-list-item"  *ngFor="let g of gl">
            <ion-avatar item-start>
              <img [src]="g.gm">
              <!--<ion-icon name="contact"  style="font-size: 3.0em;color: red;"></ion-icon>-->
            </ion-avatar>
              <ion-label (click)="toGroupMember(g)" style="background-color: black;color:#ffffff">
                {{g.gn}}({{g.gc}})
              </ion-label>
              <button ion-button color="danger" (click)="delGroup(g)" clear item-end>
                <img class="content-gc" src="./assets/imgs/sc.png">
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
              public modalCtrl: ModalController,
              public util: UtilService) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaPage');
  }
  ionViewDidEnter(){
    console.log("3.0 ionViewDidEnter 当进入页面时触发");
    this.gl = UserConfig.groups;
  }

  toGroupMember(g){
    console.log('GlPage =======跳转: GcPage');
    this.navCtrl.push(DataConfig.PAGE._GC_PAGE,{g:g});
  }

  toGroupCreate(){
    let profileModal = this.modalCtrl.create(DataConfig.PAGE._GA_PAGE);
    profileModal.onDidDismiss((data)=>{
      this.getGroups();
    });
    profileModal.present();
  }

  getGroups(){
    this.gl = UserConfig.groups;
  }

  goBack() {
    this.navCtrl.pop();
  }

  delGroup(g:PageDcData){
    //删除群
    this.util.alterStart("2",()=>{
      this.gcService.delete(g.gi).then( data=>{
        this.getGroups();
      }).catch(error=>{
      })
    });

  }
}

