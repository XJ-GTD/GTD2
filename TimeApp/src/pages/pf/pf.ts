import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { AppConfig } from "../../app/app.config";
import { HttpClient } from "@angular/common/http";
import {BaseSqliteService} from "../../service/sqlite-service/base-sqlite.service";
import {UEntity} from "../../entity/u.entity";

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
  i: number = 1;

  errorCode: number;

  checkMoblieNull: boolean;
  checkMoblie: boolean;

  uo:UEntity;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private http: HttpClient,
    private sqliteService: BaseSqliteService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PfPage');
  }

  goBack() {
    this.navCtrl.setRoot('PaPage');
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
      this.errorCode = 0;
      if(this.tel==13697975154){
        this.name="kang";
        this.isRegist= true;
        this.existCode = 1;
      }else if(this.tel==13697975153){
        this.name="kang";
        this.isRegist= true;
        this.existCode = 2;
      }else{
        this.name=this.tel;
        this.isRegist= false;
        this.existCode = 3;
      }
    }else{
      this.name=null;
      this.isRegist=false;
      this.existCode =  0;
    }
  }

  toPersonalAddDetail(){
    let data:Object ={
      name : this.name,
      tel: this.tel,
      code: this.existCode,
      uo : this.uo
    }
    if(this.existCode == 1){
      this.navCtrl.push("PbPage",{uo:this.uo});
    }else{
      this.navCtrl.push("PcPage",data);
    }
  }
}
