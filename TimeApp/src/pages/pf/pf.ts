import { Component } from '@angular/core';
import {
  ActionSheetController, AlertController, IonicPage, LoadingController, NavController,
  NavParams
} from 'ionic-angular';
import { UEntity } from "../../entity/u.entity";
import { RelmemService} from "../../service/relmem.service";
import {RuModel} from "../../model/ru.model";
import {DataConfig} from "../../app/data.config";
import {UtilService} from "../../service/util-service/util.service";
import {ContactsService} from "../../service/util-service/contacts.service";
import {ReturnConfig} from "../../app/return.config";
import {Contacts} from "@ionic-native/contacts";

/**
 * Generated class for the PfPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pf',
  providers:[Contacts],
  template:'<ion-header>' +
  '  <ion-toolbar>' +
  '    <ion-buttons left>' +
  '      <button ion-button icon-only (click)="goBack()">' +
  '        <ion-icon name="arrow-back"></ion-icon>' +
  '      </button>' +
  '    </ion-buttons>' +
  '    <ion-title>新建 </ion-title>' +
  '    <ion-buttons right>' +
  '      <button ion-button icon-only (click)="more()">' +
  '        更多' +
  '      </button>' +
  '    </ion-buttons>' +
  '  </ion-toolbar>' +
  '</ion-header>' +
  '<!--个人添加新建搜索 -->' +
  '<ion-content padding class="page-backgroud-color">' +
  '  <div >' +
  '    <div style="margin: 20px 0px;">' +
  '      <ion-item style="height: 50px">' +
  '        <ion-input type="tel" [(ngModel)]="tel" (ionBlur)="getContacts()" placeholder="请输入手机号" clearInput></ion-input>' +
  '      </ion-item>' +
  '    </div>' +
  '    <ion-label *ngIf="contacts.length > 0">本地联系人</ion-label>' +
  '    <div *ngFor="let contact of contacts">' +
  '      <ion-item (click)="select(contact)">' +
  '        <ion-avatar item-start>' +
  '          <img src="./assets/imgs/headImg.jpg">' +
  '        </ion-avatar>' +
  '          <h2>{{contact.phoneNumbers[0].value}}</h2>' +
  '          <p style="">{{contact.displayName}}</p>' +
  '        <div item-end>' +
  '          <!--<span *ngIf="existCode == 1" style="color: red">已添加</span>-->' +
  '          <!--<span *ngIf="existCode == 2" style="color: #488aff">添加</span>-->' +
  '          <!--<span *ngIf="existCode == 3">未注册</span>-->' +
  '        </div>' +
  '      </ion-item>' +
  '    </div>' +
  '    <div margin-top>' +
  '      <span style="width: 100%; text-align: center;display: block;padding-bottom: 20px; color: rgb(153,153,153);" *ngIf="checkMobile == false && checkMobileNull == false && isRegist == false">' +
  '        该用户未注册' +
  '      </span>' +
  '      <span style="width: 100%; text-align: center;display: block;padding-bottom: 20px; color: rgb(153,153,153);" *ngIf="errorCode ==1">' +
  '          手机号错误' +
  '      </span>' +
  '    </div>' +
  '' +
  '    <div *ngIf="checkMobile == false && checkMobileNull == false ">' +
  '        <ion-item *ngIf="ru" (click)="toPersonalAddDetail(ru)">' +
  '          <ion-avatar item-start>' +
  '            <img [src]="ru.hiu">' +
  '          </ion-avatar>' +
  '          <ion-label>' +
  '            <span style="font-family: PingFang-SC-Bold">{{ru.rN}}</span>' +
  '          </ion-label>' +
  '          <div item-end>' +
  '            <span *ngIf="existCode == 1" style="color: red">已添加</span>' +
  '            <span *ngIf="existCode == 2" style="color: #488aff">添加</span>' +
  '            <span *ngIf="existCode == 3">未注册</span>' +
  '          </div>' +
  '        </ion-item>' +
  '    </div>' +
  '  </div>' +
  '</ion-content>',
})
export class PfPage {

  name: any;
  isRegist: boolean ;
  existCode: any;//1 存在 2 已注册未添加 3 未注册
  tel:any;

  errorCode: number;//

  checkMobileNull: boolean;
  checkMobile: boolean;

  uo:UEntity;
  sr:any = new Array(RuModel);
  ru:RuModel;

  contacts:any = [];
  contactsTmp:any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private relmemService: RelmemService,
    private utilService: UtilService,
    private actionSheetCtrl: ActionSheetController,
    private contactsService: ContactsService,
    private conTacts: Contacts,) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PfPage');
    this.uo = DataConfig.uInfo;
  }

  goBack() {
    console.log('PfPage跳转PaPage');
    this.navCtrl.pop();

  }

  //输入手机号 失去焦点 去除非数字 去除空格 查询

  checkPhone(contact){
    //判断手机号是否为空
    this.checkMobileNull=false;
    this.checkMobile=false;

    let checkCode = this.utilService.checkPhone(this.tel);
    if(checkCode == 0){
      this.checkMobileNull=true;
    }

    if(checkCode == 3){
      //手机号正确
      this.contacts = [];
    }
    if(checkCode == 2 || checkCode == 1){
      //手机号错误

      this.checkMobile=true;
      this.errorCode = 1;
      if(this.tel.length == 11){
        let alert = this.alertCtrl.create({
          subTitle: "手机号错误",
        });
        setTimeout(()=>{
          alert.dismiss();
        },1000);
        alert.present();
      }

    }
    console.log(this.checkMobile +　" + "　+ this.checkMobileNull);
    if(this.checkMobile == false && this.checkMobileNull == false){
      this.ru = undefined;
      console.log("开始查询::" + this.tel);
      this.relmemService.su(this.tel).then(data=>{
        console.log("         " + JSON.stringify(data));
        if(data.code == undefined){
          this.isRegist = true;
          this.existCode = 1;
          this.ru = data;
        }else{
          if(data.code == 0){
            this.isRegist = true;
            this.existCode = 2;
            this.ru = data;
            this.ru.rC = this.tel;
          }else {
            console.log(ReturnConfig.RETURN_MSG.get(data.code.toString()));
            // let alert = this.alertCtrl.create({
            //   subTitle: ReturnConfig.RETURN_MSG.get(data.code.toString()),
            // });
            // setTimeout(() => {
            //   alert.dismiss();
            // }, 1000);
            // alert.present();
            if (data.code == 11500) {
              this.ru = new RuModel();
              this.isRegist = false;
              this.existCode = 3;
              if (contact != null) {
                this.ru.ran = contact.displayName;
              }
              this.ru.rN = this.tel;
              this.ru.rC = this.tel;
              this.ru.hiu = DataConfig.defaultHeadImg;
              this.ru.rI = this.tel;
            }
          }
        }
        this.contactsTmp = [];
        this.errorCode = 0;
      }).catch(reason => {

      })

    }else{
      this.name=null;
      this.isRegist=false;
      this.existCode =  0;
      this.contactsTmp = this.contacts;
    }
  }

  toPersonalAddDetail(ru){
    let data:Object ={
      name : this.name,//名称
      // tel: this.tel,//手机号
      code: this.existCode,
      u : ru,//手机号信息
    };
    if(this.existCode == 1){
      console.log('PfPage跳转P,bPage')
      this.navCtrl.push("PbPage",data);
    }else{
      console.log('PfPage跳转PcPage')
      this.navCtrl.push("PcPage",data);
    }
  }

  getContacts(){
    if(this.tel != null && this.tel != ''){
      let tmp = this.tel;
      tmp = tmp.replace(/[a-zA-Z]/g,'');
      tmp = tmp.replace(/\s/g,'');

      if(tmp.length >= 11){
        this.tel =tmp.substr(0,11) ;

      }else{
        this.tel = tmp;
      }
      let fields = ['phoneNumbers','displayName'];

      if(this.utilService.isMobile()) {


        this.conTacts.find(['phoneNumbers'], {
          filter: this.tel,
          multiple: true,
          desiredFields: ["displayName", "phoneNumbers"]
        }).then(data => {
          console.log(JSON.stringify(data));
          this.contacts = data;
          console.log("1 :: " + JSON.stringify(this.contacts));
          if (this.tel.length > 3) {
            return this.conTacts.find(['phoneNumbers'], {
              filter: this.utilService.telFormat(this.tel),
              multiple: true,
              desiredFields: ["displayName", "phoneNumbers"]
            });
          }
        }).then(data => {
          console.log("2 :: " + JSON.stringify(data));
          let dataTmp = this.contacts;
          if (data != undefined) {
            dataTmp = this.contacts.concat(data);
          }
          this.contacts = [];
          for (let i = 0; i < dataTmp.length; i++) {
            for (let j = 0; j < dataTmp[i].phoneNumbers.length; j++) {
              if (dataTmp[i].phoneNumbers[j].value.length > 11) {
                dataTmp[i].phoneNumbers[j].value = dataTmp[i].phoneNumbers[j].value.replace(/\s/g, '');
              }
              if (this.utilService.checkPhone(dataTmp[i].phoneNumbers[j].value) == 3) {
                this.contacts.push(dataTmp[i]);
              }
            }
          }

          this.checkPhone(null);

        });
      }else{
        this.checkPhone(null);
      }


      console.log(this.tel);

    }else{
      this.contacts = [];
    }
  }

  select(contact){
    console.log(JSON.stringify(contact));
    this.tel = contact.phoneNumbers[0].value.replace(/\s/g,'');
    this.contacts = [];
    this.checkPhone(contact);
  }

  more(){
    let actionSheet = this.actionSheetCtrl.create({
      title:'更多',
      buttons:[
        {
          text:'本地联系人',
          handler:()=>{
            console.log("选择");
            this.navCtrl.push('PhPage');
          }
        },
      ]
    });
    actionSheet.present();

    let map = new Map<string, string>();
  }


}
