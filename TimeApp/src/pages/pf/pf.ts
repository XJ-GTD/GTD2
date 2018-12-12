import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { AppConfig } from "../../app/app.config";
import { HttpClient } from "@angular/common/http";
import {UEntity} from "../../entity/u.entity";
import { RelmemService} from "../../service/relmem.service";
import {RuModel} from "../../model/ru.model";

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

  errorCode: number;//

  checkMoblieNull: boolean;
  checkMoblie: boolean;

  uo:UEntity;
  sr:any = new Array(RuModel);

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private relmemService: RelmemService,
    private http:HttpClient) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PfPage');
    this.uo = this.navParams.get('uo');
  }

  goBack() {
    console.log('PfPage跳转PaPage')
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
      this.relmemService.getrus(null,null,null,this.tel,"0").then(data=>{
        if(data.us != null && data.us != undefined){
          console.log("查询用户数为::" + data.us + data.us.length);
          if(data.us.length > 0){
            //已添加
            this.sr = data.us;
            for(let i = 0;i<data.us.length;i++){
              console.log(data.us[i]);
            }
            this.isRegist = true;
            this.existCode = 1;
          }else{
            //未添加
            let tmp = new RuModel();
            tmp.rC= this.tel;
            tmp.rN= this.tel;
            let arr = [tmp];
            this.sr = arr;
            this.isRegist= false;
            this.existCode = 3;
          }
        }else{
          console.log(this.tel + "::用户查询失败")
          let tmp = new RuModel();
          tmp.rC= this.tel;
          tmp.rN= this.tel;
          let arr = [tmp];
          this.sr = arr;
          this.isRegist= false;
          this.existCode = 3;
        }

      }).catch(reason => {
        console.log(this.tel + "::用户查询失败catch")
        let tmp = new RuModel();
        tmp.rC= this.tel;
        tmp.rN= this.tel;
        let arr = [tmp];
        this.sr = arr;
        this.isRegist= false;
        this.existCode = 3;
      })
      // 查询输入手机号对应的信息
      // if(this.tel==13697975154){
      //   this.name="kang";
      //   this.isRegist= true;
      //   this.existCode = 1;
      // }else if(this.tel==13697975153){
      //   this.name="kang";
      //   this.isRegist= true;
      //   this.existCode = 2;
      // }else{
      //   this.name=this.tel;
      //   this.isRegist= false;
      //   this.existCode = 3;
      // }
      this.errorCode = 0;
    }else{
      this.name=null;
      this.isRegist=false;
      this.existCode =  0;
    }
  }

  toPersonalAddDetail(u){
    let data:Object ={
      name : this.name,
      tel: this.tel,
      code: this.existCode,
      u : u
    }
    if(this.existCode == 1){
      console.log('PfPage跳转PbPage')
      this.navCtrl.push("PbPage",data);
    }else{
      console.log('PfPage跳转PcPage')
      this.navCtrl.push("PcPage",data);
    }
  }
}
