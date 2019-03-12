import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {RData, RService} from "./r.service";
import {DataConfig} from "../../service/config/data.config";
import {AgdRestful, AgdPro, ContactPerPro, SharePro} from "../../service/restful/agdsev";
import {AibutlerRestful, AudioPro, TextPro} from "../../service/restful/aibutlersev";


/**
 * Generated class for the 注册 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-r',
  template: '<ion-header>' +
    '  <div class="register_header">' +
    '    <ion-navbar>' +
    '      <div class="header_header">账号注册</div>' +
    '    </ion-navbar>' +
    '  </div>' +
    '</ion-header>' +
    '<ion-content padding>' +
    '  <div class="register_body">' +
    '    <div class="custom_form">' +
    '      <div class="custom_group">' +
    '        <div class="group_input">' +
    '          <div class="input_icon">' +
    '              <span>' +
    '                 <ion-icon name="ios-person-outline"></ion-icon>' +
    '              </span>' +
    '          </div>' +
    '          <div class="input_text">' +
    '            <ion-item>' +
    '              <ion-input type="tel" [(ngModel)]="rdata.mobile" (input)="format()"  (ionBlur)="checkPhone()"  clearInput=true placeholder="输入您的手机号">' +
    '              </ion-input>' +
    '            </ion-item>' +
    '          </div>' +
    '        </div>' +
    '        <div *ngIf="this.errorCode != undefinde">' +
    '          <div>' +
    '            <!--*ngIf="true" -->' +
    '            <div class="error_info">' +
    '              <span *ngIf="this.errorCode == 0">手机号不能为空</span>' +
    '              <span *ngIf="this.errorCode == 1 || this.errorCode == 2">请输入正确11位手机号</span>' +
    '            </div>' +
    '          </div>' +
    '        </div>' +
    '      </div>' +
    '      <div class="custom_group verification">' +
    '        <div class="group_input ">' +
    '          <div class="verification_icon">' +
    '            <span class="img_span">' +
    '              <img src="./assets/imgs/verification.png"/>' +
    '            </span>' +
    '          </div>' +
    '          <div class="input_text_verification">' +
    '            <div class="verification_item">' +
    '              <ion-item>' +
    '                <ion-input type="text" [(ngModel)]="rdata.authCode" placeholder="验证码" clearInput></ion-input>' +
    '              </ion-item>' +
    '            </div>' +
    '            <div class="button_verification">' +
    '              <button ion-button (click)="sendMsg()">{{timeOut}}</button>' +
    '            </div>' +
    '          </div>' +
    '        </div>' +
    '      </div>' +
    '      <div class="custom_group">' +
    '        <div class="group_input">' +
    '          <div class="input_icon">' +
    '            <span>' +
    '              <ion-icon name="ios-lock-outline"></ion-icon>' +
    '            </span>' +
    '          </div>' +
    '          <div class="input_text">' +
    '            <ion-item>' +
    '              <ion-input type="password" [(ngModel)]="rdata.password" (ionBlur)="checkPwd()" placeholder="密码" clearInput></ion-input>' +
    '            </ion-item>' +
    '          </div>' +
    '          <div >' +
    '            <div >' +
    '              <!--*ngIf="true" -->' +
    '              <div class="error_info">' +
    '                <span *ngIf="this.checkBoxClickFlag">不同意协议不能注册</span>' +
    '                <span *ngIf="this.checkPassword">请输入密码</span>' +
    '              </div>' +
    '            </div>' +
    '          </div>' +
    '        </div>' +
    '      </div>' +
    '      <div class="custom_group padding_0">' +
    '        <button ion-button block color="danger" (click)="register()" class="region_button" [disabled]="disable">' +
    '          注册' +
    '        </button>' +
    '        <div class="copywriting" margin-top>' +
    '          <span class="checkbox_span">' +
    '            <!--<ion-item>-->' +
    '            <!--<ion-label >已阅读《用户协议》</ion-label>-->' +
    '              <ion-checkbox [(ngModel)]="checkBoxClick"></ion-checkbox>' +
    '            <!--</ion-item>-->' +
    '          <span class="userAgreement_span">我已阅读并同意<span class="userAgreement_span_1"' +
    '                                                        (click)="userAgreegment()">《用户协议》</span></span>' +
    '          </span>' +
    '        </div>' +
    '      </div>' +
    '    </div>' +
    '  </div>' +
    '</ion-content>',
})
export class RPage {

  rdata: RData = new RData();

  data: any;
  accountName: any;
  accountPassword: any;
  accountMobile: any;
  userName: any;
  deviceId: any;
  checkMobile: any;
  checkMobileNull: any;
  checkPassword: any;
  checkBoxClick: any;
  checkBoxClickFlag: any;
  authCode: any;
  errorCode: any;
  timeOut: any = "发送验证码";
  timer: any;


  rePage: string;
  disable: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private alertCtrl: AlertController,
              private utilService: UtilService,
              private rService: RService,
              private testful : AibutlerRestful
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RPage');
    this.rePage = this.navParams.get("RPage");
    /*let testp = new AgdPro();
    testp.rai="a";
    testp.fc="b";
    testp.ai="c";
    testp.at="d";
    testp.adt="e";
    testp.ap="f";
    testp.ar="g";
    testp.aa="h";
    testp.am="i";
    testp.ac = new Array<ContactPerPro>();
    /!*this.testful.save(testp).then(data =>
    {
      console.log("testful agd:"+ JSON.stringify(data));
    })*!/
    let testp1 = new SharePro();
    testp1.oai = "a13661617252";
    testp1.ompn="13661617252";
    testp1.d.a.rai="a";
    testp1.d.a.fc="b";
    testp1.d.a.ai="c";
    testp1.d.a.at="d";
    testp1.d.a.adt="2019/03/11 09:33";
    testp1.d.a.ap="f";
    testp1.d.a.ar="g";
    testp1.d.a.aa="h";
    testp1.d.a.am="i";
    let cp = new ContactPerPro();
    cp.ai ="a15737921611"
    cp.bd="1990/07/01"
    cp.mpn="15737921611"
    cp.n="ding"
    cp.s="f"
    testp1.d.a.ac.push(cp) ;
        this.testful.share(testp1).then(data=>{
      console.log("testful share agd:"+ JSON.stringify(data));
    })*/

    /*let testp = new AudioPro();
    testp.d.vb64="sdfasfdasfsafdfafa";
    this.testful.postaudio(testp).then(data=>{
      console.log("testful audio ai:"+ JSON.stringify(data));
    })*/
    let testp:TextPro = new TextPro();
    testp.d.text="你好";
    this.testful.posttext(testp).then(data=>{
      console.log("testful text ai:"+ JSON.stringify(data));
    })
  }

  register() {

    if(this.errorCode == undefined)   //判断手机号是否为空
      this.errorCode = 0;
    else if (this.rdata.password == null || this.rdata.password == "" || this.rdata.password == undefined)     //判断密码是否为空
      this.checkPassword = true;
    else if (this.checkBoxClick != true)  //判断用户协议是否选择
      this.checkBoxClickFlag=true;
    else
    {
      this.checkBoxClickFlag=false;

      console.log("signup::111111111" + this.rdata)
      //注册成功
      this.rService.signup(this.rdata).then(data => {
        console.debug("注册返回信息::" + JSON.stringify(data));
        let alert = this.alertCtrl.create({
          title: '提示信息',
          subTitle: "注册成功",
          buttons: [{
            text: '确定', role: 'cancel', handler: () => {
              if (this.rePage != undefined) {
                this.navCtrl.getViews().forEach(page => {
                  if (page.name == this.rePage) {
                    this.navCtrl.popTo(page);
                  }
                })
              } else {
                this.navCtrl.setRoot(DataConfig.PAGE._M_PAGE);
              }
            }
          }]
        });
        alert.present();
        this.disable = false;

      }).catch(err=>{
        //注册异常
      });
    }
  }

  userAgreegment() {
    this.navCtrl.push('PPage');
  }

  sendMsg() {
    if(this.errorCode == 3){
      this.rService.sc(this.rdata).then(data => {
        console.log("sc::" + data)
        console.log("sc:: verifykey :" + data.repData.data.verifykey)
        this.rdata.verifykey = data.repData.data.verifykey;
        /*let alert = this.alertCtrl.create({
          title:'提示信息',
          subTitle: data.repData.message,
          buttons:['确定']
        });
        alert.present();*/
      }).catch(ref =>{
        /*console.log("ref::" + ref);
        let alert = this.alertCtrl.create({
          title:'提示信息',
          subTitle: ref.message,
          buttons:['确定']
        });
        alert.present();*/
      })

      this.timeOut = 10;
      this.timer = setInterval(()=>{
        this.timeOut --;
        if(this.timeOut <= 0){
          clearTimeout(this.timer)
          console.log("清除定时器")
          this.timeOut="发送验证码"
        }
        console.log(this.timeOut)
      },1000)

    }else{
      let alert = this.alertCtrl.create({
        title:'提示信息',
        subTitle: '请填写正确的手机号',
        buttons:['确定']
      });
      alert.present();
    }
  }

  checkPhone() {
    this.errorCode = this.utilService.checkPhone(this.rdata.mobile);
    if (this.errorCode == 0) {
      this.checkMobileNull = true;
    }
    if (this.errorCode == 1 || this.errorCode == 2) {
      this.checkMobileNull = false;
      this.checkMobile = true;
    }
    if (this.errorCode == 3) {
      this.checkMobile = false;
      this.checkMobileNull = false;
    }
  }

  checkPwd() {
    if (this.rdata.password == null || this.rdata.password == "" || this.rdata.password == undefined) {      //判断字符是否为空
      this.checkPassword = true;
    } else {
      this.checkPassword = false;
    }
  }

  format() {
    this.rdata.mobile = this.utilService.remo(this.rdata.mobile).toString();
  }
}
