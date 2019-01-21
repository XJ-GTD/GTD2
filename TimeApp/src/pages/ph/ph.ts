import {Component, ViewChild} from '@angular/core';
import {IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import {Contacts,Contact} from "@ionic-native/contacts";
import {HttpInterceptor} from "@angular/common/http";
import {ContactsService} from "../../service/util-service/contacts.service";
import {RuModel} from "../../model/ru.model";

/**
 * Generated class for the PhPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ph',
  template:'<ion-header>' +
  '  <ion-navbar>' +
  '    <ion-title>手机通讯录联系人</ion-title>' +
  '  </ion-navbar>' +
  '</ion-header>' +
  '<ion-content padding>' +
  '  <div *ngFor="let ru of rus">' +
  '    <ion-item (click)="toPage(ru)">' +
  '      <ion-avatar item-start >' +
  '        <img src="http://file03.sg560.com/upimg01/2017/01/932752/Title/0818021950826060932752.jpg">' +
  '      </ion-avatar>' +
  '      <ion-label *ngIf="ru.sdt ==0">' +
  '        <p style="color: #000; line-height: 17px;font-size: 1.7rem">{{ru.rN}}</p>' +
  '        <p >{{ru.rC}}({{ru.ran}})</p>' +
  '      </ion-label>' +
  '      <ion-label *ngIf="ru.sdt ==3">' +
  '        <p style="color: #000; line-height: 17px;font-size: 1.7rem">{{ru.ran}}</p>' +
  '        <p >{{ru.rC}}</p>' +
  '      </ion-label>' +
  '      <!--<ion-checkbox item-end ></ion-checkbox>-->' +
  '      <ion-buttons *ngIf="ru.sdt ==0" item-end>' +
  '        <button ion-button ion-only >添加</button>' +
  '      </ion-buttons>' +
  '      <div *ngIf="ru.sdt ==3" item-end>' +
  '        <span>未注册</span>' +
  '      </div>' +
  '    </ion-item>' +
  '  </div>' +
  '</ion-content>',
})
export class PhPage {

  @ViewChild(Navbar) navBar: Navbar;

  rus:Array<RuModel>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhPage');
    this.navBar.backButtonClick = this.backButtonClick;
    this.navBar.setBackButtonText("");
    this.rus= ContactsService.contactList;
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.navCtrl.pop();
  };

  toPc(ru){
    console.log("PhPage to PcPage");
    this.navCtrl.push("PcPage",{"u":ru,"code":"2"});
  }

  toPage(ru:RuModel){
    if(ru.sdt == 3){
      this.toPc(ru);
    }else if(ru.sdt == 0){
      this.toPc(ru);
    }
  }



}
