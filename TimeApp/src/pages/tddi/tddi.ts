import { Component, ViewChild } from '@angular/core';
import {
  ActionSheetController, Events, IonicPage, ModalController, NavController, NavParams,
} from 'ionic-angular';
import {ScdData} from "../tdl/tdl.service";
import * as moment from "moment";
import {TddiService} from "./tddi.service";
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {BsModel} from "../../service/restful/out/bs.model";
import {TdcService} from "../tdc/tdc.service";

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
          <ion-input type="text" [(ngModel)]="scd.sn" [disabled]="true"  placeholder="我想..."></ion-input>
        </div>
      </ion-row>
      <ion-row >
        <div >
            <button [disabled]="true" (click)="toPlanChoose()" ion-button  round class ="btn-jh">添加计划</button>
        </div>
      </ion-row>
      <ion-row >
        <div class="date-set">
          <ion-item>
          <ion-datetime [disabled]="true" displayFormat="YYYY年MM月DD日 DDDD"
                        pickerFormat = "YYYY MM DD" color="light"
                        [(ngModel)]="scd.sd" dayNames="周日,周一,周二,周三,周四,周五,周六"
                        min="1999-01-01" max="2039-12-31"  (ionCancel)="getDtPickerSel($event)"
                        ></ion-datetime>
          </ion-item> 
        </div>
         <div class="arrow1">
           <ion-label><ion-icon name="arrow-forward" color="light"></ion-icon></ion-label>
         </div>
      </ion-row>
      <ion-row >
        <div class = "tog-set"><ion-item>
                <ion-toggle  [(ngModel)]="alld"  [class.allday]="b"></ion-toggle>
            </ion-item>
        </div>
          <div class = "tm-set" [hidden]="alld">
            <ion-item>
                <ion-datetime  displayFormat="HH:mm" [(ngModel)]="scd.st"
                              pickerFormat="HH mm" (ionCancel)="getHmPickerSel($event)"></ion-datetime>
              </ion-item>
          </div>
        <div class = "arrow2" [hidden]="alld">
          <ion-label><ion-icon name="arrow-forward" color="light"></ion-icon></ion-label>
        </div>
      </ion-row>
      <ion-row >
        <div class ="reptlbl repttop"><ion-label>重复</ion-label></div>
        <div class ="repttop1"><button [disabled]="true" ion-button  round clear class ="sel-btn-set"
                     [ngClass]="rept.close == 1?'sel-btn-seled':'sel-btn-unsel'"  
                     (click)="clickrept(0)">关</button></div>
        <div class ="repttop1"><button [disabled]="true" ion-button  round clear class ="sel-btn-set"
                     [ngClass]="rept.d == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickrept(1)">天</button></div>
        <div class ="repttop1"><button [disabled]="true" ion-button  round  clear class ="sel-btn-set"
                     [ngClass]="rept.w == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickrept(2)">周</button></div>
        <div class ="repttop1"><button [disabled]="true" ion-button  round clear class ="sel-btn-set"
                     [ngClass]="rept.m == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickrept(3)">月</button></div>
        <div class ="repttop1"><button [disabled]="true" ion-button  round clear class ="sel-btn-set"
                     [ngClass]="rept.y == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickrept(4)">年</button></div>
      </ion-row>
      <ion-row >
        <div class ="reptlbl txtop"><ion-label>提醒</ion-label></div>
        <div class ="txtop1"><button ion-button  round clear class ="sel-btn-set"
                     [ngClass]="wake.close == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickwake(0)">关</button></div>
        <div class ="txtop1"><button ion-button  round clear  class ="sel-btn-set"
                     [ngClass]="wake.tenm == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickwake(1)">10分钟</button></div>
        <div class ="txtop1"><button ion-button  round clear  class ="sel-btn-set"
                     [ngClass]="wake.thirm == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickwake(2)">30分钟</button></div>
        <div class ="txtop1"><button ion-button  round clear  class ="sel-btn-set"
                     [ngClass]="wake.oh == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickwake(3)">1小时</button></div>
        <div class ="txtop1"><button ion-button  round clear  class ="sel-btn-set"
                     [ngClass]="wake.foh == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickwake(4)">4小时</button></div>
        <div class ="txtop1"><button ion-button  round clear  class ="sel-btn-set"
                     [ngClass]="wake.od == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickwake(5)">1天</button></div>
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

        <ion-list  no-lines  radio-group [(ngModel)]="scd.ji">
          <ion-item class="plan-list-item" *ngFor="let option of jhs">
            <div class="color-dot" [ngStyle]="{'background-color': option.jc }" item-start></div>
            <ion-label>{{option.jn}}</ion-label>
            <ion-radio value="{{option.ji}}" [ngStyle]="{'checked': option.ji == scd.ji , 'none': option.ji != scd.ji}"></ion-radio>
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
              private tdcServ :TdcService,private util:UtilService,private  tddiServ : TddiService,
              public actionSheetCtrl: ActionSheetController,
              public modalCtrl: ModalController,
  ) {

  }

  //画面数据
  scd :ScdData = new ScdData();
  b:boolean = true;

  rept = {
    close:1,
    d:0,
    w:0,
    m:0,
    y:0
  };

  wake = {
    close:1,
    tenm:0,
    thirm:0,
    oh:0,
    foh:0,
    od:0
  };

  //全天
  alld:boolean = false;

  isShowPlan: boolean = false;
  IsShowCover: boolean = false;
  jhs:any;

  ionViewDidLoad() {

    console.log('ionViewDidLoad NewAgendaPage');
  }

  ionViewWillEnter() {

    this.tdcServ.getPlans().then(data=>{
      this.jhs = data;
      //console.log("111" + JSON.stringify(this.jhs));
    }).catch(res=>{
      console.log("获取计划失败" + JSON.stringify(res));
    });

    //受邀人修改的场合初始化
    this.tdcServ.get(this.navParams.get("si")).then(data=>{
      let bs : BsModel<ScdData> = data;
      Object.assign(this.scd,bs.data);


      this.scd.sd = moment(this.scd.sd).format("YYYY-MM-DD");
      this.scd.st = moment().format("HH:mm");

      this.clickrept(parseInt(this.scd.rt));

      this.clickwake(parseInt(this.scd.tx));


    })




  }

  //重复按钮显示控制
  clickrept(type){
    this.scd.rt = type;

    switch (type){
      case 0:
        this.rept.close = 1;
        this.rept.d = 0;
        this.rept.w = 0;
        this.rept.m = 0;
        this.rept.y = 0;
        break;
      case 1:
        this.rept.close = 0;
        this.rept.d = 1;
        this.rept.w = 0;
        this.rept.m = 0;
        this.rept.y = 0;
        break;
      case 2:
        this.rept.close = 0;
        this.rept.d = 0;
        this.rept.w = 1;
        this.rept.m = 0;
        this.rept.y = 0;
        break;
      case 3:
        this.rept.close = 0;
        this.rept.d = 0;
        this.rept.w = 0;
        this.rept.m = 1;
        this.rept.y = 0;
        break;
      case 4:
        this.rept.close = 0;
        this.rept.d = 0;
        this.rept.w = 0;
        this.rept.m = 0;
        this.rept.y = 1;
        break;
      default:
        this.rept.close = 1;
        this.rept.d = 0;
        this.rept.w = 0;
        this.rept.m = 0;
        this.rept.y = 0;
        this.scd.rt = "0";
    }
  }

  //提醒按钮显示控制
  clickwake(type){

    this.scd.tx = type;

    switch (type){
      case 0:
        this.wake.close = 1;
        this.wake.tenm = 0;
        this.wake.thirm = 0;
        this.wake.oh = 0;
        this.wake.foh = 0;
        this.wake.od=0;
        break;
      case 1:
        this.wake.close = 0;
        this.wake.tenm = 1;
        this.wake.thirm = 0;
        this.wake.oh = 0;
        this.wake.foh = 0;
        this.wake.od=0;
        break;
      case 2:
        this.wake.close = 0;
        this.wake.tenm = 0;
        this.wake.thirm = 1;
        this.wake.oh = 0;
        this.wake.foh = 0;
        this.wake.od=0;
        break;
      case 3:
        this.wake.close = 0;
        this.wake.tenm = 0;
        this.wake.thirm = 0;
        this.wake.oh = 1;
        this.wake.foh = 0;
        this.wake.od=0;
        break;
      case 4:
        this.wake.close = 0;
        this.wake.tenm = 0;
        this.wake.thirm = 0;
        this.wake.oh = 0;
        this.wake.foh = 1;
        this.wake.od=0;
        break;
      case 5:
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

    //他人创建

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

  getDtPickerSel(evt){

    let el = document.getElementsByClassName("picker-opt-selected")

    if (el && el.length==3){
      this.scd.sd = el[0].textContent + "-" +el[1].textContent +"-" +el[2].textContent;
    }
  }

  getHmPickerSel(evt){

    let el = document.getElementsByClassName("picker-opt-selected")

    if (el && el.length==2){
      this.scd.st = el[0].textContent + ":" +el[1].textContent;
    }
  }



}
