import { Component } from '@angular/core';
import {ActionSheetController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {BsModel} from "../../service/restful/out/bs.model";
import {TdcService} from "../tdc/tdc.service";
import {UserConfig} from "../../service/config/user.config";
import * as moment from "moment";
import {DataConfig} from "../../service/config/data.config";
import {ScdData} from "../../service/pagecom/pgbusi.service";

/**
 * Generated class for the 日程详情 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tddj',
  template:`<ion-header no-border class="header-set">
    <ion-toolbar>
      <ion-grid>
        <ion-row right>
          <div class="h-auto " >
            <ion-buttons right>
              <button [disabled]="pagestate == '0'?true:false" [hidden]="pagestate == '0'" ion-button icon-only (click)="presentActionSheet()" color="light">
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
          <ion-input type="text" [(ngModel)]="scd.sn"   placeholder="我想..."></ion-input>
        </div>
      </ion-row>
      <ion-row >
        <div >
            <button  (click)="toPlanChoose()" ion-button  round class ="btn-jh">{{scd.p.jn==""?"添加计划":scd.p.jn}}</button>
        </div>
      </ion-row>
      <ion-row >
        <div class="date-set">
          <ion-item>
          <ion-datetime  displayFormat="YYYY年M月DD日 DDDD"
                        pickerFormat = "YYYY MM DD" color="light"
                        [(ngModel)]="scd.sd" dayNames="星期日,星期一,星期二,星期三,星期四,星期五,星期六"
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
        <div class ="repttop1"><button  ion-button  round clear class ="sel-btn-set"
                     [ngClass]="rept.close == 1?'sel-btn-seled':'sel-btn-unsel'"  
                     (click)="clickrept('0')">关</button></div>
        <div class ="repttop1"><button  ion-button  round clear class ="sel-btn-set"
                     [ngClass]="rept.d == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickrept('1')">天</button></div>
        <div class ="repttop1"><button  ion-button  round  clear class ="sel-btn-set"
                     [ngClass]="rept.w == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickrept('2')">周</button></div>
        <div class ="repttop1"><button  ion-button  round clear class ="sel-btn-set"
                     [ngClass]="rept.m == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickrept('3')">月</button></div>
        <div class ="repttop1"><button  ion-button  round clear class ="sel-btn-set"
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
          <ion-input type="text" placeholder="备注" [(ngModel)]="scd.bz"></ion-input>
        </div>
      </ion-row>
      <ion-row justify-content-left>
        <div   *ngFor ="let fss of scd.fss;">
          <div >{{fss.ran}}</div>
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

        <ion-list  no-lines  radio-group [(ngModel)]="scd.p">
          <ion-item class="plan-list-item" *ngFor="let option of jhs">
            <div class="color-dot" [ngStyle]="{'background-color': option.jc }" item-start></div>
            <ion-label>{{option.jn}}</ion-label>
            <ion-radio [value]="option"  [ngStyle]="{'checked': option.ji == scd.ji , 'none': option.ji != scd.ji}"></ion-radio>
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
              private tdcServ :TdcService,private util:UtilService,
              public actionSheetCtrl: ActionSheetController,
              public modalCtrl: ModalController              ) {

  }

  //画面状态：0：新建 ，1：本人修改
  pagestate : string ="0";
  //画面数据
  scd :ScdData = new ScdData();
  b:boolean = true;

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

    this.tdcServ.getPlans().then(data=>{
      this.jhs = data;
      //console.log("111" + JSON.stringify(this.jhs));
    }).catch(res=>{
      console.log("获取计划失败" + JSON.stringify(res));
    });

    //新建的场合初始化
    if (this.navParams.get("dateStr")){
      this.scd.sd = this.navParams.get("dateStr");
      this.scd.sd = moment(this.scd.sd).format("YYYY-MM-DD");
      if (this.scd.st) {
        this.scd.st = moment(this.scd.sd + " " + this.scd.st).format("HH:mm");
      } else {
        this.scd.st = moment().format("HH:mm");
      }
      this.scd.rt = "0";
      this.scd.tx = "0";
      this.pagestate = "0";
      this.rept.close = 1;
      this.wake.close = 1;
      return ;
    }


    if (this.navParams.get("si")){
      this.tdcServ.get(this.navParams.get("si")).then(data=>{
        let bs : BsModel<ScdData> = data;
        Object.assign(this.scd,bs.data);

        //全天的场合
        if (this.scd.et == "99:99") {
          this.alld = true;
        } else {
          this.alld = false;
        }

        this.scd.sd = moment(this.scd.sd).format("YYYY-MM-DD");
        if (this.scd.st) {
          this.scd.st = moment(this.scd.sd + " " + this.scd.st).format("HH:mm");
        } else {
          this.scd.st = moment().format("HH:mm");
        }

        this.clickrept(this.scd.rt);
        this.clickwake(this.scd.tx);


        //本人修改的场合初始化
        if (bs.data.gs == "1"){
          this.pagestate = "1";
        }
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
      this.scd.et = "99:99";
    } else {
      this.scd.et = this.scd.st;
    }

    //归属 本人创建
    this.scd.gs = '1';

    this.scd.ji = this.scd.p.ji;

    //新建数据
    if (this.pagestate =="0"){
      this.tdcServ.save(this.scd).then(data=>{
        let ctbl = data.data;
        this.scd.si = ctbl.si;
        this.pagestate ="1";
        this.util.toast("保存成功",2000);
        if(typeof(eval(share))=="function")
        {
          share();
        }
        return;
      });

    }
    //本人创建
    if (this.pagestate =="1") {

      this.tdcServ.updateDetail(this.scd).then(data =>{

        this.util.toast("保存成功",2000);
        if(typeof(eval(share))=="function")
        {
          share();
        }
        return ;
      })

    }


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
      this.navCtrl.push(DataConfig.PAGE._FS_PAGE,{addType:'rc',tpara:this.scd.si});
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
              /*this.tdcServ.delete(this.scd.si,"1",d).then(data=>{
                this.cancel();
              });*/
            }
          }, {
            text: '删除所有日程',
            cssClass:'btn-delall',
            handler: () => {
              // this.tdcServ.delete(this.scd.si,"2",d).then(data=>{
              //   this.cancel();
              // });
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
      /*this.tdcServ.delete(this.scd.si,"2",d).then(data=>{
        this.cancel();
      });*/
    }


  }
  toPlanChoose(){
    if(this.jhs.length > 0){
      this.isShowPlan = true;
      this.IsShowCover = true;
    }else {
      this.util.toast("请先去计划页面创建计划",1500);
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
