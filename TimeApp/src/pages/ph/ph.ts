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
  // templateUrl: 'ph.html',
  template:'<ion-header>\n' +
  '\n' +
  '  <ion-navbar>\n' +
  '    <ion-title>手机通讯录联系人</ion-title>\n' +
  '  </ion-navbar>\n' +
  '\n' +
  '</ion-header>\n' +
  '\n' +
  '\n' +
  '<ion-content padding>\n' +
  '\n' +
  '  <div *ngFor="let ru of rus">\n' +
  '    <ion-item (click)="toPage(ru)">\n' +
  '      <ion-avatar item-start >\n' +
  '        <img src="http://file03.sg560.com/upimg01/2017/01/932752/Title/0818021950826060932752.jpg">\n' +
  '      </ion-avatar>\n' +
  '      <ion-label *ngIf="ru.sdt ==0">\n' +
  '        <p style="color: #000; line-height: 17px;font-size: 1.7rem">{{ru.rN}}</p>\n' +
  '        <p >{{ru.rC}}({{ru.ran}})</p>\n' +
  '      </ion-label>\n' +
  '      <ion-label *ngIf="ru.sdt ==3">\n' +
  '        <p style="color: #000; line-height: 17px;font-size: 1.7rem">{{ru.ran}}</p>\n' +
  '        <p >{{ru.rC}}</p>\n' +
  '      </ion-label>\n' +
  '\n' +
  '      <!--<ion-checkbox item-end ></ion-checkbox>-->\n' +
  '      <ion-buttons *ngIf="ru.sdt ==0" item-end>\n' +
  '        <button ion-button ion-only >添加</button>\n' +
  '      </ion-buttons>\n' +
  '      <div *ngIf="ru.sdt ==3" item-end>\n' +
  '        <span>未注册</span>\n' +
  '      </div>\n' +
  '    </ion-item>\n' +
  '  </div>\n' +
  '\n' +
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
