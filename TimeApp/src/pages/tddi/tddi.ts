import { Component } from '@angular/core';
import {
  ActionSheetController,  IonicPage, ModalController, NavController, NavParams,
} from 'ionic-angular';
import * as moment from "moment";
import {TddiService} from "./tddi.service";
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {BsModel} from "../../service/restful/out/bs.model";
import {TdcService} from "../tdc/tdc.service";
import {PgBusiService, ScdData} from "../../service/pagecom/pgbusi.service";

/**
 * Generated class for the 日程详情（受邀） page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tddi',
  providers: [],
  template:`<ion-header no-border class="header-set">
    <ion-toolbar>
      <ion-grid>
        <ion-row right>
          <div class="h-auto " >
            
          </div>
        </ion-row>
      </ion-grid>
    </ion-toolbar>
  </ion-header>
  <ion-content class ="content-set">
    <ion-grid>
      <ion-row >
        <div class = "input-set">
          <ion-label >{{scd.sn}}</ion-label>
        </div>
      </ion-row>
      <ion-row >
        <div >
            <button  (click)="toPlanChoose()" ion-button  round class ="btn-jh">{{scd.p.jn==""?"添加计划":scd.p.jn}}</button>
        </div>
      </ion-row>
      <ion-row >
          <div class="dt-set">
            <ion-item>
                <ion-label >{{scd.sd | formatedate : "CYYYY/M/DD"}}</ion-label>
            </ion-item>
          </div>
          <div class="week-set">
            <ion-label >{{scd.sd | formatedate : "CWEEK" }}</ion-label>
          </div>
          <div class="tm-set">
            <ion-label >{{alldshow}}</ion-label>
          </div>
      </ion-row>
      <ion-row >
        <div class ="reptlbl repttop"><ion-label>重复</ion-label></div>
        <div class ="repttop1"><ion-label>{{reptshow}}</ion-label></div>
      </ion-row>
      <ion-row >
        <div class ="reptlbl txtop"><ion-label>提醒</ion-label></div>
        <div class ="txtop1"><button ion-button  round clear class ="sel-btn-set"
                     [ngClass]="wake.close == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickwake('0')">关</button></div>
        <div class ="txtop1"><button ion-button  round clear  class ="sel-btn-set"
                     [ngClass]="wake.tenm == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickwake('1')">10分钟</button></div>
        <div class ="txtop1"><button ion-button  round clear  class ="sel-btn-set"
                     [ngClass]="wake.thirm == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickwake('2')">30分钟</button></div>
        <div class ="txtop1"><button ion-button  round clear  class ="sel-btn-set"
                     [ngClass]="wake.oh == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickwake('3')">1小时</button></div>
        <div class ="txtop1"><button ion-button  round clear  class ="sel-btn-set"
                     [ngClass]="wake.foh == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickwake('4')">4小时</button></div>
        <div class ="txtop1"><button ion-button  round clear  class ="sel-btn-set"
                     [ngClass]="wake.od == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickwake('5')">1天</button></div>
      </ion-row>
      <ion-row >
        <div class = "memo-set">
          <ion-input type="text" placeholder="备注" [(ngModel)]="scd.bz"></ion-input>
        </div>
      </ion-row>
    </ion-grid>
    <ion-footer class ="foot-set">
      <ion-toolbar>
        <ion-grid>
          <ion-row >
            <div class="dobtn-set">
              <div class ="cancelbtn-set">
                <ion-buttons  >
                  <button  ion-button icon-only (click)="cancel()" color="light">
                    <ion-icon name="close"></ion-icon>
                  </button>
                </ion-buttons>
              </div>
              <div >
                <ion-buttons class ="okbtn-set" >
                  <button  ion-button icon-only (click)="save()" color="light">
                    <ion-icon name="checkmark"></ion-icon>
                  </button>
                </ion-buttons>
              </div>
              <div>
              </div>
            </div> 
          </ion-row>
        </ion-grid>
      </ion-toolbar>
    </ion-footer>
  </ion-content>

  <ion-content padding class="select-plan" *ngIf="isShowPlan">
    <ion-grid>
      <ion-row>

        <ion-list  no-lines  radio-group [(ngModel)]="scd.p">
          <ion-item class="plan-list-item" *ngFor="let option of jhs">
            <div class="color-dot" [ngStyle]="{'background-color': option.jc }" item-start></div>
            <ion-label>{{option.jn}}</ion-label>
            <ion-radio [value]="option" [ngStyle]="{'checked': option.ji == scd.ji , 'none': option.ji != scd.ji}"></ion-radio>
          </ion-item>
        </ion-list>

      </ion-row>
    </ion-grid>
  </ion-content>

  <!--遮罩层-->
  <div class="shade" *ngIf="IsShowCover" (click)="closeDialog()"></div>
  
  
  `

})
export class TddiPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private util:UtilService,private  tddiServ : TddiService,
              public actionSheetCtrl: ActionSheetController,
              public modalCtrl: ModalController,private  busiServ : PgBusiService
  ) {

  }

  //画面数据
  scd :ScdData = new ScdData();
  b:boolean = true;

  reptshow:string ="";

  wake = {
    close:1,
    tenm:0,
    thirm:0,
    oh:0,
    foh:0,
    od:0
  };

  //全天
  alldshow:string = "";

  isShowPlan: boolean = false;
  IsShowCover: boolean = false;
  jhs:any;

  ionViewDidLoad() {

    console.log('ionViewDidLoad NewAgendaPage');
  }

  ionViewWillEnter() {

    this.busiServ.getPlans().then(data=>{
      this.jhs = data;
      //console.log("111" + JSON.stringify(this.jhs));
    }).catch(res=>{
      console.log("获取计划失败" + JSON.stringify(res));
    });

    //受邀人修改的场合初始化
    this.tddiServ.get(this.navParams.get("si")).then(data=>{
      let bs : BsModel<ScdData> = data;
      Object.assign(this.scd,bs.data);

      //全天的场合
      if (this.scd.et == "99:99") {
        this.alldshow = "全天";
      } else {
        this.alldshow = this.scd.et;
      }

      switch (this.scd.rt){
        case "0":
          this.reptshow="关";
          break;
        case "1":
          this.reptshow="每日";
          break;
        case "2":
          this.reptshow="每周";
          break;
        case "3":
          this.reptshow="每月";
          break;
        case "4":
          this.reptshow="每年";
          break;
        default:
          this.reptshow="关";
      }

      this.scd.sd = moment(this.scd.sd).format("YYYY-MM-DD");
      this.scd.st = moment().format("HH:mm");


      this.clickwake(this.scd.tx+'');


    })
  }

  //提醒按钮显示控制
  clickwake(type:string){

    this.scd.tx = type;

    switch (type){
      case '0':
        this.wake.close = 1;
        this.wake.tenm = 0;
        this.wake.thirm = 0;
        this.wake.oh = 0;
        this.wake.foh = 0;
        this.wake.od=0;
        break;
      case '1':
        this.wake.close = 0;
        this.wake.tenm = 1;
        this.wake.thirm = 0;
        this.wake.oh = 0;
        this.wake.foh = 0;
        this.wake.od=0;
        break;
      case '2':
        this.wake.close = 0;
        this.wake.tenm = 0;
        this.wake.thirm = 1;
        this.wake.oh = 0;
        this.wake.foh = 0;
        this.wake.od=0;
        break;
      case '3':
        this.wake.close = 0;
        this.wake.tenm = 0;
        this.wake.thirm = 0;
        this.wake.oh = 1;
        this.wake.foh = 0;
        this.wake.od=0;
        break;
      case '4':
        this.wake.close = 0;
        this.wake.tenm = 0;
        this.wake.thirm = 0;
        this.wake.oh = 0;
        this.wake.foh = 1;
        this.wake.od=0;
        break;
      case '5':
        this.wake.close = 0;
        this.wake.tenm = 0;
        this.wake.thirm = 0;
        this.wake.oh = 0;
        this.wake.foh = 0;
        this.wake.od=1;
        break;
      default:
        this.wake.close = 1;
        this.wake.tenm = 0;
        this.wake.thirm = 0;
        this.wake.oh = 0;
        this.wake.foh = 0;
        this.wake.od=0;
        this.scd.tx = "0";
    }
  }

  cancel(){
    this.navCtrl.pop();

  }

  save(share){

    //提醒内容设置
    this.scd.ui = UserConfig.account.id;

    //消息设为已读
    this.scd.du = "1";

    //开始时间格式转换
    this.scd.sd = moment(this.scd.sd).format("YYYY/MM/DD");

    this.scd.ji = this.scd.p.ji;

    //归属 他人创建
    this.scd.gs = '0';
    this.tddiServ.updateDetail(this.scd).then(data=>{
      this.util.toast("保存成功",2000);

    })



  }

  presentActionSheet() {
    let d = this.navParams.get("d");
    if (this.scd.rt != "0" && this.scd.sd != d) {
      //重复日程删除
      const actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: '删除当前日期开始所有日程',
            role: 'destructive',
            cssClass:'btn-del',
            handler: () => {
              this.tddiServ.delete(this.scd.si,"1",d).then(data=>{
                this.cancel();
              });
            }
          }, {
            text: '删除所有日程',
            cssClass:'btn-delall',
            handler: () => {
              this.tddiServ.delete(this.scd.si,"2",d).then(data=>{
                this.cancel();
              });
            }
          }, {
            text: '取消',
            role: 'cancel',
            cssClass:'btn-cancel',
            handler: () => {

            }
          }
        ]
      });
      actionSheet.present();
    }else{
      //非重复日程删除
      this.tddiServ.delete(this.scd.si,"2",d).then(data=>{
        this.cancel();
      });
    }


  }
  toPlanChoose(){
    this.isShowPlan = true;
    this.IsShowCover = true;
  }

  closeDialog() {
    if (this.isShowPlan) {
      this.isShowPlan = false;
      this.IsShowCover = false;

      console.log("check:"+this.scd.ji);
    }
  }

}
