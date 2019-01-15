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
  templateUrl: 'pf.html',
  providers:[Contacts]
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private relmemService: RelmemService,
    private utilService: UtilService,
    private conTacts: Contacts,
    private actionSheetCtrl: ActionSheetController,) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PfPage');
    this.uo = DataConfig.uInfo;
  }

  goBack() {
    console.log('PfPage跳转PaPage');
    this.navCtrl.pop();

  }

  checkPhone(){
    //判断手机号是否为空
    this.checkMobileNull=false;
    this.checkMobile=false;

    let checkCode = this.utilService.checkPhone(this.tel);
    if(checkCode == 0){
      this.checkMobileNull=true;
    }

    if(checkCode == 3){
      //手机号正确
    }
    if(checkCode == 2 || checkCode == 1){
      //手机号错误
      this.checkMobile=true;
      this.errorCode = 1;
      let alert = this.alertCtrl.create({
        subTitle: "手机号错误",
      });
      setTimeout(()=>{
        alert.dismiss();
      },1000);
      alert.present();
    }

    if(this.checkMobile == false && this.checkMobileNull == false){
      this.ru = undefined;
      this.relmemService.su(this.tel).then(data=>{
        if(data.code == 0){
          this.isRegist = true;
          this.existCode = 2;
          this.ru = data;
          this.ru.rC = this.tel;
        }else{
          this.ru = new RuModel();
          this.isRegist = false;
          this.existCode = 3;
          this.ru.rN = this.tel;
          this.ru.rC = this.tel;
          this.ru.hiu = DataConfig.defaultHeadImg;
          this.ru.rI = this.tel;
        }
        this.errorCode = 0;
      })

    }else{
      this.name=null;
      this.isRegist=false;
      this.existCode =  0;
    }
  }

  toPersonalAddDetail(ru){
    let data:Object ={
      name : this.name,//名称
      // tel: this.tel,//手机号
      code: this.existCode,
      ru : ru,//手机号信息
    }
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
      let tmp = new String(this.tel);
      tmp = tmp.replace(/[a-zA-Z]/g,'');
      if(tmp.length >= 11){
        this.tel =new String(tmp.substr(0,11)) ;
        this.checkPhone();
      }else{
        this.tel = new String(tmp);
      }


      let fields = ['phoneNumbers','displayName'];

      this.conTacts.find(['phoneNumbers'],{
        // filter:this.utilService.telFormat(this.tel),
        filter:this.tel,
        multiple:true,
        desiredFields:["displayName","phoneNumbers"]
      }).then(data=>{
        console.log(JSON.stringify(data));
        this.contacts = data;
        console.log("1 :: " + JSON.stringify(this.contacts));
        if(this.tel.length > 3){
          return this.conTacts.find(['phoneNumbers'],{filter:this.utilService.telFormat(this.tel),multiple:true, desiredFields:["displayName","phoneNumbers"]});
        }
      }).then(data=>{
        console.log("2 :: " + JSON.stringify(data));
        if(data != undefined){
          this.contacts = this.contacts.concat(data);
        }
        for(let i = 0;i< this.contacts.length;i++){
          for(let j = 0;j< this.contacts[i].phoneNumbers.length;j++){
            if(this.contacts[i].phoneNumbers[j].value.length>11){
              this.contacts[i].phoneNumbers[j].value = this.contacts[i].phoneNumbers[j].value.replace(/\s/g,'');
            }
          }
        }
      });
      console.log(this.tel);
    }else{
      this.contacts = [];
    }
  }

  select(contact){
    console.log(JSON.stringify(contact));
    this.tel = contact.phoneNumbers[0].value.replace(/\s/g,'');
    this.contacts = [];
    this.checkPhone();
  }

  more(){
    let actionSheet = this.actionSheetCtrl.create({
      title:'更多',
      buttons:[
        {
          text:'本地联系人',
          handler:()=>{
            console.log("选择")
          }
        },
      ]
    });

    actionSheet.present();
  }

}
