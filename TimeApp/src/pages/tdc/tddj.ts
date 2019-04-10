import { Component } from '@angular/core';
import {ActionSheetController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {BsModel} from "../../service/restful/out/bs.model";
import {UserConfig} from "../../service/config/user.config";
import * as moment from "moment";
import {DataConfig} from "../../service/config/data.config";
import {PgBusiService, ScdData} from "../../service/pagecom/pgbusi.service";
import {TdcService} from "./tdc.service";

/**
 * Generated class for the 日程详情 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tddj',
  template:`<ion-header no-border class="header-set">
    <ion-toolbar>
      <ion-grid>
        <ion-row right>
          <div class="h-auto " >
            <ion-buttons right>
              <button ion-button icon-only (click)="presentActionSheet()" color="light">
                <img  class="imgdel-set" src="../../assets/imgs/del.png">
              </button>
            </ion-buttons>
          </div>
        </ion-row>
      </ion-grid>
    </ion-toolbar>
  </ion-header>
  <ion-content class ="content-set">
    <ion-grid>
      <ion-row >
        <div class = "input-set">
          <ion-input type="text" [(ngModel)]="scd.sn"  ></ion-input>
        </div>
      </ion-row>
      <ion-row >
        <div (click)="toPlanChoose()" class ="lbl-jh">
          <ion-label  >{{scd.p.jn=="" || scd.p.jn==null?"添加计划":scd.p.jn}}</ion-label>
        </div>
      </ion-row>
      <ion-row >
        <div class="date-set" >
          <ion-item>
          <ion-datetime [disabled]="rept_flg?true:false"  displayFormat="YYYY年M月DD日 DDDD"
                        pickerFormat = "YYYY MM DD" color="light"
                        [(ngModel)]="scd.sd" dayNames="星期日,星期一,星期二,星期三,星期四,星期五,星期六"
                        min="1999-01-01" max="2039-12-31"  (ionCancel)="getDtPickerSel($event)"
                        ></ion-datetime>
          </ion-item> 
        </div>
      </ion-row>
      <ion-row >
        <div class = "tog-set">
          <ion-item>
                <ion-toggle [disabled]="rept_flg?true:false"  [(ngModel)]="alld"  [class.allday]="b"></ion-toggle>
            </ion-item>
        </div>
          <div class = "tm-set" [hidden]="alld">
            <ion-item>
                <ion-datetime [disabled]="rept_flg?true:false"  displayFormat="HH:mm" [(ngModel)]="scd.st"
                              pickerFormat="HH mm" (ionCancel)="getHmPickerSel($event)"></ion-datetime>
              </ion-item>
          </div>
      </ion-row>
      <ion-row >
        <div class ="reptlbl repttop"><ion-label>重复</ion-label></div>
        <div class ="repttop1"><button [disabled]="rept_flg?true:false"  ion-button  round clear class ="sel-btn-set"
                     [ngClass]="rept.close == 1?'sel-btn-seled':'sel-btn-unsel'"  
                     (click)="clickrept('0')">关</button></div>
        <div class ="repttop1"><button [disabled]="rept_flg?true:false"  ion-button  round clear class ="sel-btn-set"
                     [ngClass]="rept.d == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickrept('1')">天</button></div>
        <div class ="repttop1"><button [disabled]="rept_flg?true:false"  ion-button  round  clear class ="sel-btn-set"
                     [ngClass]="rept.w == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickrept('2')">周</button></div>
        <div class ="repttop1"><button [disabled]="rept_flg?true:false"  ion-button  round clear class ="sel-btn-set"
                     [ngClass]="rept.m == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickrept('3')">月</button></div>
        <div class ="repttop1"><button [disabled]="rept_flg?true:false"  ion-button  round clear class ="sel-btn-set"
                     [ngClass]="rept.y == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickrept('4')">年</button></div>
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
          <ion-textarea type="text" placeholder="备注" [(ngModel)]="scd.bz"></ion-textarea>
        </div>
      </ion-row>
      <ion-row class="img-row">
        <div class ="img-div"   *ngFor ="let fss of scd.fss;">
          <div><img class ="img-set" [src]="fss.bhiu"></div>
          <div class ="img-rn">{{fss.rn}}</div>
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
                <ion-buttons>
                  <button  ion-button icon-only (click)="goShare()" color="light">发送
                    
                  </button>
                </ion-buttons>
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

        <ion-list  no-lines  radio-group [(ngModel)]="scd.p" >
          <ion-item class="plan-list-item" *ngFor="let option of jhs">
            <div class="color-dot" [ngStyle]="{'background-color': option.jc }" item-start></div>
            <ion-label>{{option.jn}}</ion-label>
            <ion-radio  [value]="option" ></ion-radio>
          </ion-item>
        </ion-list>

      </ion-row>
    </ion-grid>
  </ion-content>

  <!--遮罩层-->
  <div class="shade" *ngIf="IsShowCover" (click)="closeDialog()"></div>`
})
export class TddjPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private tddjServ :TdcService,private util:UtilService,
              public actionSheetCtrl: ActionSheetController,
              public modalCtrl: ModalController   , private  busiServ : PgBusiService           ) {

  }


  //画面数据
  scd :ScdData = new ScdData();
  b:boolean = true;

  //重复日程不可以修改日期
  rept_flg :boolean = false;

  rept = {
    close:0,
    d:0,
    w:0,
    m:0,
    y:0
  };

  wake = {
    close:0,
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


    if (this.navParams.get("si")){
      this.tddjServ.get(this.navParams.get("si")).then(data=>{
        let bs : BsModel<ScdData> = data;
        Object.assign(this.scd,bs.data);

        this.busiServ.getPlans().then(data=>{
          this.jhs = data;
          for (let i=0;i<this.jhs.length;i++){
            if (this.jhs[i].ji == this.scd.ji){
              this.scd.p = this.jhs[i];
              console.log("计划********" + this.jhs[i].ji);
            }
          }
        }).catch(res=>{
          console.log("获取计划失败" + JSON.stringify(res));
        });

        //重复日程不可以修改日期
        if (this.scd.rt != "0"){
          this.rept_flg = true;
        }

        this.scd.sd = moment(this.scd.sd).format("YYYY-MM-DD");
        if (this.scd.st) {
          this.scd.st = this.scd.st
        } else {
          this.scd.st = moment().format("HH:mm");
        }

        //全天的场合
        if (this.scd.st == "99:99") {
          this.alld = true;
        } else {
          this.alld = false;
        }

        this.clickrept(this.scd.rt+'');
        this.clickwake(this.scd.tx + '');

      })
      return;
    }

  }

  //重复按钮显示控制
  clickrept(type:string){
    this.scd.rt = type;

    switch (type){
      case "0":
        this.rept.close = 1;
        this.rept.d = 0;
        this.rept.w = 0;
        this.rept.m = 0;
        this.rept.y = 0;
        break;
      case "1":
        this.rept.close = 0;
        this.rept.d = 1;
        this.rept.w = 0;
        this.rept.m = 0;
        this.rept.y = 0;
        break;
      case "2":
        this.rept.close = 0;
        this.rept.d = 0;
        this.rept.w = 1;
        this.rept.m = 0;
        this.rept.y = 0;
        break;
      case "3":
        this.rept.close = 0;
        this.rept.d = 0;
        this.rept.w = 0;
        this.rept.m = 1;
        this.rept.y = 0;
        break;
      case "4":
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
  clickwake(type:string){

    this.scd.tx = type;

    switch (type){
      case "0":
        this.wake.close = 1;
        this.wake.tenm = 0;
        this.wake.thirm = 0;
        this.wake.oh = 0;
        this.wake.foh = 0;
        this.wake.od=0;
        break;
      case "1":
        this.wake.close = 0;
        this.wake.tenm = 1;
        this.wake.thirm = 0;
        this.wake.oh = 0;
        this.wake.foh = 0;
        this.wake.od=0;
        break;
      case "2":
        this.wake.close = 0;
        this.wake.tenm = 0;
        this.wake.thirm = 1;
        this.wake.oh = 0;
        this.wake.foh = 0;
        this.wake.od=0;
        break;
      case "3":
        this.wake.close = 0;
        this.wake.tenm = 0;
        this.wake.thirm = 0;
        this.wake.oh = 1;
        this.wake.foh = 0;
        this.wake.od=0;
        break;
      case "4":
        this.wake.close = 0;
        this.wake.tenm = 0;
        this.wake.thirm = 0;
        this.wake.oh = 0;
        this.wake.foh = 1;
        this.wake.od=0;
        break;
      case "5":
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

    if (!this.chkinput()){
      return
    }
    //提醒内容设置
    this.scd.ui = UserConfig.account.id;

    //消息设为已读
    this.scd.du = "1";

    //本人新建或修改时，下记画面项目可以修改
    //开始时间格式转换
    this.scd.sd = moment(this.scd.sd).format("YYYY/MM/DD");


    //结束日期设置
    //重复场合
    if (this.scd.rt != "0") {
      this.scd.ed = "9999/12/31";
    } else {
      this.scd.ed = this.scd.sd;
    }

    //结束时间设置
    //全天的场合
    if (this.alld) {
      this.scd.st = "99:99";
      this.scd.et = "99:99";
    } else {
      this.scd.et = this.scd.st;
    }


    this.scd.ji = this.scd.p.ji;


    this.tddjServ.updateDetail(this.scd).then(data =>{

      this.util.toast("保存成功",2000);
      if(typeof(eval(share))=="function")
      {
        share();
      }
      return ;
    })




  }

  chkinput():boolean{
    if (this.scd.sn == ""){
      this.util.toast("请输入主题",2000);
      return false;
    }
    return true;
  }

  goShare(){
    //日程分享打开参与人选择rc日程类型
    this.save(()=>{
      this.navCtrl.push(DataConfig.PAGE._FS4C_PAGE,{addType:'rc',tpara:this.scd.si});
    })

  }

  presentActionSheet() {
    let d = this.navParams.get("d");
    if (this.scd.rt != "0" && this.scd.sd != d) {
      //重复日程删除
      const actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: '删除今后所有日程',
            role: 'destructive',
            cssClass:'btn-del',
            handler: () => {
              if (moment(d).isSame(this.scd.sd)){
                //如果开始日与选择的当前日一样，就是删除所有
                this.tddjServ.delete(this.scd.si,"2",d).then(data=>{
                  this.cancel();
                });
              }else{
                this.tddjServ.delete(this.scd.si,"1",d).then(data=>{
                  this.cancel();
                });
              }

            }
          }, {
            text: '删除所有日程',
            cssClass:'btn-delall',
            handler: () => {
               this.tddjServ.delete(this.scd.si,"2",d).then(data=>{
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
      this.tddjServ.delete(this.scd.si,"2",d).then(data=>{
        this.cancel();
      });
    }


  }
  toPlanChoose(){
    if(this.jhs.length > 0){
      this.isShowPlan = true;
      this.IsShowCover = true;
    }else {
      this.util.toast("未创建计划",1500);
    }
  }

  closeDialog() {
    if (this.isShowPlan) {
      this.isShowPlan = false;
      this.IsShowCover = false;

      console.log("check:"+this.scd.ji);
      console.log("check1:"+this.scd.p.ji);
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
