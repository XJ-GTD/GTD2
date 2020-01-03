import {Component} from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Clipboard} from '@ionic-native/clipboard';
import {PdService} from "./pd.service";
import {UtilService} from "../../service/util-service/util.service";
import {PagePDPro} from "../../data.mapping";
import {PlanPa} from "../../service/restful/shaesev";
import * as moment from "moment";
import {UserConfig} from "../../service/config/user.config";
import {PlanData, PlanItemData, CalendarService} from "../../service/business/calendar.service";
import {AgendaData, MiniTaskData, TaskData} from "../../service/business/event.service";
import {MemoData} from "../../service/business/memo.service";
import {forEach} from "@angular/router/src/utils/collection";
import {EventFinishStatus, SyncType} from "../../data.enum";
declare var Wechat;

/**
 * Generated class for the 计划展示 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pd',
  template:
  `
    <modal-box title="{{planName}}" [buttons]="buttons" (onCancel)="goBack()" (onShare)="share()">
      <ion-scroll scrollY="true" scrollheightAuto>
        <ul class="timeline" >
          <ng-template ngFor let-item [ngForOf]="plans">
            <ng-template [ngIf]="item.type == 'AgendaData'">
              <!--<li [ngClass]="{'agenda-card-past': today > item.agendaData.evd, 'agenda-card': today <= item.agendaData.evd}">-->
              <li>
                <div class="timeline-badge" *ngIf="item.agendaData.evd  != ''">{{item.agendaData.evd | formatedate: "MM-DD"}}</div>
                <div class="timeline-panel">
                  <div class="timeline-heading">
                    <span class="timeline-title">{{item.agendaData.evt}}</span>
                    <!--<span class="timeline-person" *ngIf="currentuser != item.agendaData.ui && item.agendaData.ui != ''">-{{item.agendaData.ui | formatuser: currentuser: friends}}</span>-->
                  </div>
                  <div class="timeline-body">
                    <p>{{item.agendaData.evn}}</p>
                    <p>{{item.agendaData.bz}}</p>
                  </div>
                  <div class="timeline-foot">
                    <span class="icon font-small">
                      <ion-icon class="fad fa-lock"  *ngIf="item.agendaData.todolist == '0'"></ion-icon>
                      <ion-icon class="fad fa-user-tag"  *ngIf="currentuser != item.agendaData.ui && item.agendaData.ui != ''"></ion-icon>
                      <ion-icon class="fad fa-check-double" *ngIf="item.agendaData.wc == finished"></ion-icon>
                      <ion-icon class="fad fa-sync" *ngIf="item.agendaData.tb == synch"></ion-icon>
                    </span>
                  </div>
                </div>
              </li>
            </ng-template>
            <ng-template [ngIf]="item.type == 'PlanItemData'">
              <!--<li [ngClass]="{'agenda-card-past': today > item.planItemData.sd, 'agenda-card': today <= item.planItemData.sd}">-->

              <li>
                <div class="timeline-badge" *ngIf="item.planItemData.sd  != ''">{{item.planItemData.sd | formatedate: "MM-DD"}}</div>
                <div class="timeline-panel">
                  <div class="timeline-heading">
                    <span class="timeline-title">{{item.planItemData.jtn}}</span>
                    <!--<span class="timeline-person" *ngIf="currentuser != item.planItemData.ui && item.planItemData.ui != ''">-{{item.planItemData.ui | formatuser: currentuser: friends}}</span>-->

                  </div>
                  <div class="timeline-body">
                    <p>{{item.planItemData.bz}}</p>
                  </div>
                </div>
              </li>
            </ng-template>
            <ng-template [ngIf]="item.type == 'MemoData'">
            </ng-template>
            <ng-template [ngIf]="item.type == 'YearData'">
              <li yearitem>
                <div class="timeline-badge">{{item.yearitem}}</div>
              </li>
            </ng-template>
            <!--<ng-template [ngIf]="item.type == 'TaskData'">-->
            <!--<li [ngClass]="{'agenda-card-past': today > item.taskData.evd, 'agenda-card': today <= item.taskData.evd}">-->
            <!--<div class="timeline-badge">{{item.taskData.evd | formatedate: "CMM/DD"}}</div>-->
            <!--<div class="timeline-panel">-->
            <!--<div class="timeline-heading">-->
            <!--<h4 class="timeline-title">{{item.taskData.evn}}</h4>-->
            <!--<p><small class="text-muted"><i class="glyphicon glyphicon-time"></i>{{item.taskData.evt}}</small></p>-->
            <!--</div>-->
            <!--<div class="timeline-body">-->
            <!--<p>{{item.taskData.bz}}</p>-->
            <!--</div>-->
            <!--</div>-->
            <!--</li>-->
            <!--</ng-template>-->
            <!--<ng-template [ngIf]="item.type == 'MiniTaskData'">-->
            <!--<li [ngClass]="{'agenda-card-past': today > item.miniTaskData.evd, 'agenda-card': today <= item.miniTaskData.evd}">-->
            <!--<div class="timeline-badge">{{item.miniTaskData.evd | formatedate: "CMM/DD"}}</div>-->
            <!--<div class="timeline-panel">-->
            <!--<div class="timeline-heading">-->
            <!--<h4 class="timeline-title">{{item.miniTaskData.evn}}</h4>-->
            <!--<p><small class="text-muted"><i class="glyphicon glyphicon-time"></i>{{item.miniTaskData.evt}}</small></p>-->
            <!--</div>-->
            <!--<div class="timeline-body">-->
            <!--<p>{{item.miniTaskData.bz}}</p>-->
            <!--</div>-->
            <!--</div>-->
            <!--</li>-->
            <!--</ng-template>-->
          </ng-template>

        </ul>
      </ion-scroll>
    </modal-box>

        <!---->
        <!--<ion-row  justify-content-center>-->
          <!--<ion-grid>-->
            <!--<ion-row *ngIf="(i === 0) || (item.evd.slice(0,4) !== plan.pa[i - 1]['evd'].slice(0,4))" justify-content-start>-->
              <!--<h3 class="plan-year">{{item.evd.slice(0,4)}}</h3>-->
            <!--</ion-row>-->
            <!--<ion-row justify-content-center align-items-start>-->
              <!--<div *ngIf="(i === 0) || (item.evd.slice(0,10) !== plan.pa[i - 1]['evd'].slice(0,10))" class="agenda-col-date left-off right-off" justify-content-start>-->
                <!--<p class="app-agenda-day">{{item.evd.slice(5,10)}}</p>-->
              <!--</div>-->
              <!--<div *ngIf="(i !== 0) && (item.evd.slice(0,10) === plan.pa[i - 1]['evd'].slice(0,10))" class="agenda-col-date left-off right-off" justify-content-start>-->
              <!--</div>-->
              <!--<div class="agenda-col-time right-off left-off" justify-content-between>-->
                <!--<div class="time-slot">-->
                  <!--<p class="app-agenda-time">{{item.evt}}</p>-->
                <!--</div>-->
                <!--<div class="pointer-slot"><span class="plan-color-pointer"><div class="color-dot"></div></span></div>-->
              <!--</div>-->
              <!--<div class="agenda-col-content right-off left-off" [ngClass]="{'agenda-content': ((i + 1) === plan.pa.length)? false : (item.evd.slice(0, 10) === plan.pa[i + 1]['evd'].slice(0, 10))}" justify-content-start>-->
                <!--<p class="text-left app-agenda-title">{{item.evn}}</p>-->
                <!--<p class="app-user-text text-left">{{item.bz}}</p>-->
              <!--</div>-->
            <!--</ion-row>-->
    <!--</ion-content>-->
  `,
})
export class PdPage {

  buttons: any = {
    remove: false,
    share: true,
    save: false,
    cancel: true
  };
  // 判断是否有模态框弹出 控制安卓物理返回键
  actionSheet;

  currentuser: string = UserConfig.account.id;
  friends: Array<any> = UserConfig.friends;
  currentusername: string = UserConfig.user.nickname;
  synch: SyncType = SyncType.synch;
  unsynch: SyncType = SyncType.unsynch;

  finished: EventFinishStatus = EventFinishStatus.Finished;

  jh:PagePDPro;
  today:any = moment().format("YYYY/MM/DD HH:mm");

  plans:Array<PdItem> = new Array<PdItem>();

  planName:string;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private actionSheetCtrl: ActionSheetController,
              private util: UtilService,
              private calendarService: CalendarService,
              private pdService:PdService,
              private clipboard: Clipboard,) {
    this.jh = this.navParams.get('jh');
    this.planName = this.jh.jn;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PdPage');
  }

  ionViewDidEnter(){
    this.pdService.getPlan(this.jh.ji,this.jh.jt).then(data=>{
      this.plans = data;
      let cur ="";
      for (let plan of this.plans){
        if (plan.type =="AgendaData"){
          if (plan.agendaData.evd != cur){
            cur = plan.agendaData.evd;
          }else{
            plan.agendaData.evd = "";
          }
        }else if (plan.type =="PlanItemData"){
          if (plan.planItemData.sd != cur){
            cur = plan.planItemData.sd;
          }else{
            plan.planItemData.sd = "";
          }
        }
      }

    }).catch(res=>{
      console.log("获取计划列表失败" + JSON.stringify(res));
    });
  }

  ionViewWillLeave() {
    if (this.actionSheet !== undefined) {
      this.actionSheet.dismiss();
    }
  }

  goBack() {
    this.navCtrl.pop();
  }


  more(jh:PagePDPro){
    this.actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: '分享',
          role: 'share',
          handler: () => {
            let plan: PlanData = {} as PlanData;
            plan.ji = this.jh.ji;

            this.calendarService.sharePlan(plan, true).then(url => {
              console.log("分享地址是："+JSON.stringify(url));
              let sharecontent: string = `${this.currentusername} 分享了 一个日历`;

              //验证是否按照微信组件
              Wechat.isInstalled(installed => {
                if (installed) {
                  Wechat.share({
                    message:{
                        title: sharecontent,
                        description: this.planName,
                        thumb: "https://pluto.guobaa.com/cal/sharesite/icon/jh.png",
                        media: {
                          type: Wechat.Type.WEBPAGE,
                          webpageUrl: url || "https://fir.im/d2z3"
                        }
                    },
                    scene:0  // 分享目标 0:分享到对话，1:分享到朋友圈，2:收藏
                  }, () => {
                      console.log('分享成功');
                  }, reason => {
                      console.log('分享失败' + reason);
                  });
                } else {
                    alert('请安装微信');
                }
              });
            }).catch(res=>{
              this.util.popoverStart('分享失败');
            });
          }
        },
        {
          text: '删除',
          handler: () => {
            if(jh.jt == "1"){
              this.util.popoverStart('系统计划请在日历一栏页面长按删除');
            } else if (jh.ji == "personalcalendar" || jh.ji == "workcalendar") {
              this.util.popoverStart('默认日历不能删除');
            }else{
              this.util.alterStart("2",()=>{this.delete(jh)});
            }
          }
        },
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    this.actionSheet.present();
  }

  delete(jh:PagePDPro){
    this.pdService.delete(jh).then(data=>{
      this.navCtrl.pop();
    }).catch(res=>{
      this.util.popoverStart('删除日历失败');
    })
  }
  share(){

    let plan: PlanData = {} as PlanData;
    plan.ji = this.jh.ji;

    this.calendarService.sharePlan(plan, true).then(url => {
      console.log("分享地址是："+JSON.stringify(url));
      let sharecontent: string = `${this.currentusername} 分享了 一个日历`;

      //验证是否按照微信组件
      Wechat.isInstalled(installed => {
        if (installed) {
          Wechat.share({
            message:{
              title: sharecontent,
              description: this.planName,
              thumb: "https://pluto.guobaa.com/cal/sharesite/icon/jh.png",
              media: {
                type: Wechat.Type.WEBPAGE,
                webpageUrl: url || "https://fir.im/d2z3"
              }
            },
            scene:0  // 分享目标 0:分享到对话，1:分享到朋友圈，2:收藏
          }, () => {
            console.log('分享成功');
          }, reason => {
            console.log('分享失败' + reason);
          });
        } else {
          alert('请安装微信');
        }
      });
    }).catch(res=>{
      this.util.popoverStart('分享失败');
    });

  }
}

export class PdItem{
  agendaData:  AgendaData | any;
  planItemData:  PlanItemData | any;
  taskData:  TaskData | any;
  miniTaskData:  MiniTaskData | any;
  memoData:  MemoData | any;
  yearitem:number;
  type:string;
  date:string;
  time:string;
}
