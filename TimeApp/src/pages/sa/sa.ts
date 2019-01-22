import { Component, ViewChild } from '@angular/core';
import {
  AlertController, Events, IonicPage, ModalController, Nav, Navbar, NavController,
  NavParams
} from 'ionic-angular';
import { ParamsService } from "../../service/util-service/params.service";
import { ScheduleModel } from "../../model/schedule.model";
import { XiaojiAlarmclockService } from "../../service/util-service/xiaoji-alarmclock.service";
import {ScheduleOutModel} from "../../model/out/schedule.out.model";
import {WorkService} from "../../service/work.service";
import {RcModel} from "../../model/rc.model";
import {UtilService} from "../../service/util-service/util.service";
import {RelmemService} from "../../service/relmem.service";
import {RuModel} from "../../model/ru.model";
import * as moment from "moment";
import {PageConfig} from "../../app/page.config";

/**
 * Generated class for the SaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sa',
  template:'' +
  '<ion-header>' +
  '  <ion-navbar>' +
  '    <ion-title>日程详情</ion-title>' +
  '    <ion-buttons right>' +
  '      <button  ion-button [hidden]="isEdit" (click)="edit()">编辑</button>' +
  '      <button  ion-button [hidden]="!isEdit" (click)="save()">保存</button>' +
  '    </ion-buttons>' +
  '  </ion-navbar>' +
  '</ion-header>' +
  '<ion-content padding>' +
  '<div *ngIf="!isEdit">' +
  '  <ion-item>' +
  '    <img src="./assets/imgs/h.png" style="width: 20px" item-start>' +
  '    <ion-label col-3>任务</ion-label>' +
  '    <ion-label >{{rc.sN}}</ion-label>' +
  '  </ion-item>' +
  '  <div padding-left style=" border-bottom: 0.55px solid #e5e5e5;display: flex;" margin-top>' +
  '    <div>' +
  '      <img src="./assets/imgs/g.png" style="width: 20px;margin:8px 16px 8px 0; ">' +
  '    </div>' +
  '    <div col-3>' +
  '      <span class="spanCss">参与人</span>' +
  '    </div>' +
  '    <div col-7 class="divCss">' +
  '      <div item-left *ngFor="let ru of rc.rus" class="ruCss">' +
  '        <div title="{{ru.ran}}">' +
  '          <ion-thumbnail style="min-width: 40px !important;min-height: 40px !important;">' +
  '            <img [src]="ru.hiu" style="border-radius: 50%;width: 40px;height: 40px">' +
  '          </ion-thumbnail>' +
  '          <div style="clear: both; font-size:10px;width:40px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" text-center >{{ru.ran}}</div>' +
  '        </div>' +
  '      </div>' +
  '      <div item-left [hidden]="!isEdit">' +
  '        <div (click)="showCheckbox()">' +
  '          <ion-thumbnail ion-button  color="light"  style="min-width: 40px !important;min-height: 40px !important;" class="div-add-border button-border" no-margin>' +
  '            <ion-icon name="add"></ion-icon>' +
  '          </ion-thumbnail>' +
  '          <div style="clear: both; font-size:10px;width:40px;overflow: hidden;text-overflow: ellipsis;" text-center >&nbsp;</div>' +
  '        </div>' +
  '      </div>' +
  '    </div>' +
  '  </div>' +
  '  <ion-item>' +
  '    <img src="./assets/imgs/f.png" style="width: 20px" item-start>' +
  '    <ion-label col-3>计划</ion-label>' +
  '    <ion-label >{{rc.jn}}</ion-label>' +
  '  </ion-item>' +
  '  <ion-item>' +
  '    <img src="./assets/imgs/e.png" style="width: 20px" item-start>' +
  '    <ion-label col-3 item-left>标签</ion-label>' +
  '    <div item-left class="lbCss"  *ngIf="rc.lan">' +
  '      <div float-left>{{rc.lan}}</div>' +
  '    </div>' +
  '  </ion-item>' +
  '  <ion-item>' +
  '    <img src="./assets/imgs/d.png" style="width: 20px" item-start>' +
  '    <ion-label col-3>时间</ion-label>' +
  '    <ion-label >{{rc.sd}}</ion-label>' +
  '  </ion-item>' +
  '  <button ion-item>' +
  '    <img src="./assets/imgs/c.png" style="width: 20px" item-start>' +
  '    <ion-label col-3>提醒</ion-label>' +
  '    <ion-label color="primary">提前十分钟</ion-label>' +
  '  </button>' +
  '  <ion-item>' +
  '    <img src="./assets/imgs/b.png" style="width: 20px" item-start>' +
  '    <ion-label col-3>备注</ion-label>' +
  '    <ion-label>哈哈哈</ion-label>' +
  '  </ion-item>' +
  '</div>' +
  '' +
  '<div *ngIf="isEdit">' +
  '  <ion-item>' +
  '    <img src="./assets/imgs/h.png" style="width: 20px" item-start>' +
  '    <ion-label col-3>任务</ion-label>' +
  '    <ion-input [(ngModel)]="rc.sN" placeholder="{{rc.sN}}"></ion-input>' +
  '  </ion-item>' +
  '  <div padding-left style=" border-bottom: 0.55px solid #e5e5e5;display: flex;" margin-top>' +
  '    <div>' +
  '      <img src="./assets/imgs/g.png" style="width: 20px;margin:8px 16px 8px 0; ">' +
  '    </div>' +
  '    <div col-3>' +
  '      <span class="spanCss">参与人</span>' +
  '    </div>' +
  '    <div col-7 class="divCss">' +
  '      <div item-left *ngFor="let ru of rc.rus" class="ruCss">' +
  '        <div title="{{ru.ran}}">' +
  '          <ion-thumbnail style="min-width: 40px !important;min-height: 40px !important;">' +
  '            <img [src]="ru.hiu" style="border-radius: 50%;width: 40px;height: 40px">' +
  '          </ion-thumbnail>' +
  '          <div style="clear: both; font-size:10px;width:40px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" text-center >{{ru.ran}}</div>' +
  '        </div>' +
  '      </div>' +
  '      <div item-left>' +
  '        <div (click)="showCheckbox()">' +
  '          <ion-thumbnail ion-button  color="light"  style="min-width: 40px !important;min-height: 40px !important;" class="div-add-border button-border" no-margin>' +
  '            <ion-icon name="add"></ion-icon>' +
  '          </ion-thumbnail>' +
  '          <div style="clear: both; font-size:10px;width:40px;overflow: hidden;text-overflow: ellipsis;" text-center >&nbsp;</div>' +
  '        </div>' +
  '      </div>' +
  '    </div>' +
  '  </div>' +
  '  <ion-item>' +
  '    <img src="./assets/imgs/f.png" style="width: 20px" item-start>' +
  '    <ion-label col-3>计划</ion-label>' +
  '    <ion-input [(ngModel)]="rc.jn"  placeholder="{{rc.jn}}"></ion-input>' +
  '  </ion-item>' +
  '  <ion-item>' +
  '    <img src="./assets/imgs/e.png" style="width: 20px" item-start>' +
  '    <ion-label col-3 item-left>标签</ion-label>' +
  '    <div item-left>' +
  '      <div float-left>{{rc.lan}}</div>' +
  '    </div>' +
  '  </ion-item>' +
  '  <ion-item>' +
  '    <img src="./assets/imgs/d.png" style="width: 20px" item-start>' +
  '    <ion-label col-3>时间</ion-label>' +
  '    <ion-datetime displayFormat="YYYY年MM月DD日 HH:mm" [(ngModel)]="starttmp"></ion-datetime>' +
  '  </ion-item>' +
  '  <button ion-item>' +
  '    <img src="./assets/imgs/c.png" style="width: 20px" item-start>' +
  '    <ion-label col-3>提醒</ion-label>' +
  '    <ion-label color="primary">提前十分钟</ion-label>' +
  '  </button>' +
  '  <ion-item>' +
  '    <img src="./assets/imgs/b.png" style="width: 20px" item-start>' +
  '    <ion-label col-3>备注</ion-label>' +
  '    <ion-input ></ion-input>' +
  '  </ion-item>' +
  '</div>' +
  '  <button ion-button (click)="del()" style="margin: 0 auto;">删除</button>' +
  '  <button ion-button (click)="setAlarm()">设置提醒闹钟</button>' +
  '</ion-content>',
})
export class SaPage {
  @ViewChild(Navbar) navBar: Navbar;

  data: any;
  schedule: ScheduleModel;
  rc:RcModel;
  // lbs:Array<LbModel>;

  starttmp:string;//开始时间
  endtmp:string;//结束时间
  rus:Array<RuModel>;//所有联系人

  isEdit:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private paramsService: ParamsService,
              public modalCtrl: ModalController,
              private work:WorkService,
              private alarmClock: XiaojiAlarmclockService,
              private util: UtilService,
              private alertCtrl: AlertController,
              private relmemService: RelmemService,
              private event: Events) {
    this.rc = new RcModel();
  }

  //设置闹钟
  setAlarm() {
    let myModal = this.modalCtrl.create('SdPage');
    myModal.onDidDismiss(data => {
      console.log("remindTime" + data);
      this.alarmClock.setAlarmClock(data, this.rc.sN);
    });
    myModal.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SaPage');
    this.navBar.backButtonClick = this.backButtonClick;
    this.navBar.setBackButtonText("");
    // this.init();
    // this.getAllRel();
  }

  ionViewWillEnter(){
    this.schedule = this.navParams.data
    console.log("传入日程数据 ::" + JSON.stringify(this.schedule));
    this.rc = new RcModel();
    //查询日程详情
    this.work.getds(this.schedule.scheduleId).then(data=>{
      this.rc = data;
      console.log("日程 :: " + JSON.stringify(this.rc));
      this.edit();
    }).catch(e=>{
      alert(e.message)
      this.navCtrl.setRoot(PageConfig.HZ_PAGE);
    });
    this.getAllRel();
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.paramsService.schedule=null;
    this.event.publish('noshow');
    this.navCtrl.pop();
  };

  edit(){
    // this.starttmp = this.util.strToDtime(this.rc.sd);
    // this.endtmp = this.util.strToDtime(this.rc.ed);
    this.starttmp = new Date(new Date(this.rc.sd).getTime()+8*60*60*1000).toISOString();
    this.endtmp = new Date(this.rc.ed).toISOString();
    this.isEdit = true;
    console.log(this.starttmp)

  }

  save(){
    this.starttmp = moment(new Date(this.starttmp).getTime()-8*60*60*1000).format("YYYY-MM-DD HH:mm");
    // this.endtmp = this.endtmp
    console.log(this.starttmp);
    this.rc.sd = this.starttmp;
    // this.rc.ed = this.endtmp;
    console.log("修改日程传入参数 :: " + JSON.stringify(this.rc));
    this.work.urc(this.rc.sI,this.rc.sN,this.rc.sd,'',this.rc.lI,this.rc.ji,this.rc.subId,'','','',this.rc.rus).then(data=>{
      console.log(JSON.stringify(data));
    }).catch(reason => {
      console.log(JSON.stringify(reason));
    });
    this.isEdit = false;
  }


  //所有联系
  getAllRel(){
    this.relmemService.rcGetRus().then(data=>{
      console.log(data);
      if(data.code == 0){
        this.rus = data.us;
      }else{
        console.log("查询失败");
      }

    }).catch(reason => {
      console.log("查询失败");
    })
  }

  showCheckbox(){
    //已选择参与人
    let rus = this.rc.rus;
    //所有可选择参与人
    let alert = this.alertCtrl.create();
    alert.setTitle('选择参与人');
    //设置可选项
    for(let i = 0;i<this.rus.length;i++){
      let selected = false;
      for(let j = 0;rus &&　j<rus.length;j++){
        if(this.rus[i].id == rus[j].id){
          selected = true;
          break;
        }
      }
      alert.addInput({
        type: 'checkbox',
        label: this.rus[i].ran,
        value: i.toString(),
        checked: selected
      });
    }
    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        console.log('Checkbox data:', data);
        rus = new Array<RuModel>();
        for(let i = 0;i<data.length;i++){
          rus.push(this.rus[data[i]]);
        }
        this.rc.rus = rus;
        console.log("选择的参与人 :: " + JSON.stringify(this.rc.rus));
      }
    });
    alert.present();
  }


  del(){
    console.log(" :: click delete");
    console.log(JSON.stringify(this.rc))
    this.work.drc(this.rc.sI,this.rc.sa).then(data=>{
      console.log("删除成功 :: " );
      this.event.publish("reloadHa01");
      this.event.publish('noshow');
      this.navCtrl.pop();
    }).catch(reason=>{
      console.log("删除失败 :: " );
    })
  }
  // ionViewDidLoad(){
  //   console.log("1.0 ionViewDidLoad 当页面加载的时候触发，仅在页面创建的时候触发一次，如果被缓存了，那么下次再打开这个页面则不会触发");
  // }
  // ionViewWillEnter(){
  //   console.log("2.0 ionViewWillEnter 顾名思义，当将要进入页面时触发");
  // }
  // ionViewDidEnter(){
  //   console.log("3.0 ionViewDidEnter 当进入页面时触发");
  // }
  // ionViewWillLeave(){
  //   console.log("4.0 ionViewWillLeave 当将要从页面离开时触发");
  // }
  // ionViewDidLeave(){
  //   console.log("5.0 ionViewDidLeave 离开页面时触发");
  // }
  // ionViewWillUnload(){
  //   console.log("6.0 ionViewWillUnload 当页面将要销毁同时页面上元素移除时触发");
  // }
  //
  // ionViewCanEnter(){
  //   console.log("ionViewCanEnter");
  // }
  //
  // ionViewCanLeave(){
  //   console.log("ionViewCanLeave");
  // }


}
