import {Component} from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {PageUData, PsService} from "./ps.service";
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";

/**
 * Generated class for the 个人设置 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ps',
  providers: [],
  template:`
  <ion-header> 
    <ion-toolbar>
      <ion-buttons left>
        <button ion-button icon-only (click)="goBack()" color="danger">
          <!--<ion-icon name="arrow-back"></ion-icon>-->
          <img class="img-header-left" src="./assets/imgs/fh2.png">
        </button>
      </ion-buttons>
    </ion-toolbar> 
  </ion-header> 
  <ion-content padding class="page-backgroud-color"> 
    <ion-item class="no-border">
    <ion-input type="text" style="font-size: 23px;" [(ngModel)]="uo.user.name" (ionBlur)="save()"></ion-input>
    <ion-avatar item-end>
      <img [src]="uo.user.avatar" style="width: 60px;height: 60px">
    </ion-avatar>
  </ion-item>
    
    <ion-list>
      
      <button ion-item (click)="selectSex()">
        <ion-label>性别</ion-label>
        <ion-label  item-end text-end >{{sex}}</ion-label>
      </button>
      <button ion-item>
        <ion-label>生日</ion-label>
        <ion-datetime displayFormat="YYYY-MM-DD" item-end text-end [(ngModel)]="bothday"
                      min="1949-01-01" max="2039-12-31"  (ionCancel)="getDtPickerSel($event)"></ion-datetime>
      </button>
      <button ion-item>
        <ion-label>身份证</ion-label>
        <ion-input type="tel" item-end text-end [(ngModel)]="uo.user.No" (ionBlur)="save()"></ion-input>
      </button>
      <button ion-item>
        <ion-label>联系方式</ion-label>
        <ion-input type="tel" item-end text-end [(ngModel)]="uo.user.contact" (ionBlur)="save()"></ion-input>
      </button>
      
    </ion-list>
  </ion-content>`,
})
export class PsPage {

  sex:string='';
  bothday:string='';
  uo:PageUData = new PageUData();
  olduo:PageUData = new PageUData();

  constructor(public navCtrl: NavController,
              private psService:PsService,
              public actionSheetController: ActionSheetController,
              public navParams: NavParams,
              private util: UtilService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UcPage');

    Object.assign(this.uo.user,UserConfig.user);
    Object.assign(this.uo.account,UserConfig.account);

    Object.assign(this.olduo.user,UserConfig.user);
    Object.assign(this.olduo.account,UserConfig.account);

    if (UserConfig.user.sex != undefined && UserConfig.user.sex != null && UserConfig.user.sex != '') {
      if( UserConfig.user.sex == "0"){
        this.sex = "未知";
      }else {
        this.sex = UserConfig.user.sex == "1" ? "男":"女";
      }
    }

    this.uo.user.bothday = this.uo.user.bothday.replace(new RegExp('/','g'),'-');
  }

  goBack() {
    this.navCtrl.pop();
  }

  save(){
    let isUpd = false;
    if(this.olduo.user.sex != this.uo.user.sex){
      isUpd = true;
    }
    if(this.olduo.user.bothday != this.uo.user.bothday){
      isUpd = true;
    }
    if(this.olduo.user.contact != this.uo.user.contact){
      isUpd = true;
    }
    if(this.olduo.user.name != this.uo.user.name){
      isUpd = true;
    }
    if(this.olduo.user.No != this.uo.user.No){
      isUpd = true;
    }
    if(isUpd){
      this.psService.saveUser(this.uo).then(data=>{
        if(data.code ==0){
          this.util.toast('保存成功！',2000);
        }else{
          this.util.toast(data.message,2000);
        }
      })
    }

  }
  getDtPickerSel(evt){

    let el = document.getElementsByClassName("picker-opt-selected")

    if (el && el.length==3){
      this.bothday = el[0].textContent + "-" +el[1].textContent +"-" +el[2].textContent;
      this.uo.user.bothday = this.bothday.replace(new RegExp('-','g'),'/');
      this.save();
    }

  }
  async selectSex() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: '男',
        handler: () => {
          this.uo.user.sex = '1';
          console.log("男:" + this.uo.user.sex);
          this.sex = this.uo.user.sex == "1" ? "男" : "女";
          this.save();
        }
      }, {
        text: '女',
        handler: () => {
          this.uo.user.sex = '2';
          console.log("女:" + this.uo.user.sex);
          this.sex = this.uo.user.sex == "1" ? "男" : "女";
          this.save();
        }
      }]
    });
    await actionSheet.present();
  }

}
