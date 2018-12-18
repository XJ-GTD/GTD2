import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from "@angular/common/http";
import {UEntity} from "../../entity/u.entity";
import { RelmemService} from "../../service/relmem.service";
import {RuModel} from "../../model/ru.model";
import {DataConfig} from "../../app/data.config";
import {UtilService} from "../../service/util-service/util.service";

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
})
export class PfPage {

  name: any;
  isRegist: boolean ;
  existCode: any;//1 存在 2 已注册未添加 3 未注册
  tel:any;

  errorCode: number;//

  checkMoblieNull: boolean;
  checkMoblie: boolean;

  uo:UEntity;
  sr:any = new Array(RuModel);
  ru:RuModel;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private relmemService: RelmemService,
    private utilService: UtilService) {

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
    var  re = /^1\d{10}$/;   //正则表达式
    var  ren=re.test(this.tel);
    //判断手机号是否为空
    this.checkMoblieNull=false;
    this.checkMoblie=false;
    if(this.tel==null || this.tel==""){
      this.checkMoblieNull=true;
    }else {
      //判断手机号是否为11
      if (!re.test(this.tel)) {      //判断字符是否是11位数字
        this.checkMoblie=true;
        this.errorCode = 1;
        let alert = this.alertCtrl.create({
          subTitle: "手机号错误",
        });
        alert.present();
      }
    }
    if(this.checkMoblie == false && this.checkMoblieNull == false){
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
          this.ru.hiu = DataConfig.defultHeadImg;
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
}
