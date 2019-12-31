import {Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import {ActionSheetController, DateTime, IonicPage, NavController} from 'ionic-angular';
import {PsService} from "./ps.service";
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {DataConfig} from "../../service/config/data.config";
import {PageUData} from "../../data.mapping";
import {Keyboard} from "@ionic-native/keyboard";
import {DatePickerComponent} from "../../components/date-picker/date-picker";
import * as moment from "moment";
import {RemindfeedbackService} from "../../service/cordova/remindfeedback.service";

/**
 * Generated class for the 个人设置 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ps',
  providers: [],
  template: `
    <page-box title="个人信息" [buttons]="buttons" (onSave)="save()" (onBack)="goBack()" nobackgroud nobottom>
      <ion-list>
        <!--<ion-item no-lines no-padding no-margin no-border>-->
          <!--<ion-label>用户名</ion-label>-->
          <!--<ion-input type="text" [(ngModel)]="uo.user.name" item-end text-end readonly="true"></ion-input>-->
        <!--</ion-item>-->
        <ion-item no-lines no-padding no-margin no-border>
          <ion-label>注册手机</ion-label>
          <ion-input type="text" [(ngModel)]="uo.user.aid" item-end text-end readonly="true"></ion-input>
        </ion-item>
        <ion-item no-lines no-padding no-margin no-border>
          <ion-label>姓名</ion-label>
          <ion-input type="text" [(ngModel)]="uo.user.nickname" item-end text-end  (ionBlur)="check()"></ion-input>
        </ion-item>
        <ion-item no-lines no-padding no-margin no-border>
          <ion-label>身份证</ion-label>
          <ion-input type="number" item-end text-end [(ngModel)]="uo.user.ic"  (ionBlur)="check()"></ion-input>
        </ion-item>
      </ion-list>
      <ion-list>
        <ion-item (click)="selectSex()" no-lines no-padding no-margin no-border>
          <ion-label>性别</ion-label>
          <ion-icon item-end text-end class="fal fa-male font-large" *ngIf="uo.user.sex == 1">男</ion-icon>
          <ion-icon item-end text-end class="fal fa-female font-large" *ngIf="uo.user.sex == 2">女</ion-icon>
        </ion-item>
        <ion-item no-lines no-padding no-margin no-border>
          <ion-label>生日</ion-label>
          <date-picker #birthdaypicker item-content displayFormat="YYYY-MM-DD" [(ngModel)]="uo.user.birthday"
                       min="1919-01-01" cancelText="取消" doneText="确认" (ionBlur)="check()"></date-picker>
        </ion-item>
        <ion-item no-lines no-padding no-margin no-border>
          <ion-label>联系方式</ion-label>
          <ion-input type="tel" text-end [(ngModel)]="uo.user.contact"  (ionBlur)="check()"></ion-input>
        </ion-item>
      </ion-list>

      <ion-list  radio-group [(ngModel)]="uo.user.useMp3" (ionChange)="preview()">
        <ion-list-header>
          提醒对方的铃声
        </ion-list-header>
        <ion-item  no-lines no-padding no-margin no-border *ngFor="let r of mp3s">
          <ion-label>
            <!--<ion-icon class="fal fa-circle font-large-x" *ngIf="r.key != uo.user.useMp3"></ion-icon>-->
            <!--<ion-icon class="fal fa-dot-circle font-large-x" *ngIf="r.key == uo.user.useMp3"></ion-icon>-->
            <ion-icon text-end class="fal fa-play" ></ion-icon>
            {{r.name}}
          </ion-label>
          <!--<ion-icon item-end text-end class="fal fa-play font-large" ></ion-icon>-->
          <ion-radio [value]="r.key" ></ion-radio>
        </ion-item>
      </ion-list>
    </page-box>
  `,
})
export class PsPage {

  buttons: any = {
    save: false,
    cancel: true
  };

  // 判断是否有模态框弹出 控制安卓物理返回键
  @ViewChildren(DateTime) dateTimes: QueryList<DateTime>;
  actionSheet;

  @ViewChild("birthdaypicker")
  birthdaypicker: DatePickerComponent;

  @ViewChild("grid")
  grid: ElementRef;

  today: any = new Date();
  // avatar: any = DataConfig.HUIBASE64;
  uo: PageUData = new PageUData();
  olduo: PageUData = new PageUData();

  mp3s:Array<any> = new Array<any>();

  constructor(public navCtrl: NavController,
              private psService: PsService,
              private actionSheetController: ActionSheetController,
              private util: UtilService,
              private keyboard: Keyboard,
              private _renderer: Renderer2,
              private remindfeedbackService: RemindfeedbackService,) {

    this.mp3s = this.remindfeedbackService.getMp3s();
  }

  // commentFocus() {
  //   if (this.keyboard) {
  //     this._renderer.setStyle(this.grid.nativeElement, "transform", "translateY(-80px)");
  //   }
  // }
  //
  // commentBlur() {
  //   this._renderer.setStyle(this.grid.nativeElement, "transform", "translateY(0px)");
  // }

  ionViewDidLoad() {
    Object.assign(this.uo.user, UserConfig.user);
    Object.assign(this.uo.account, UserConfig.account);

    Object.assign(this.uo.user, UserConfig.user);
    Object.assign(this.uo.account, UserConfig.account);

    // this.avatar = UserConfig.user.avatar;
    //
    // if (UserConfig.user.sex != undefined && UserConfig.user.sex != '') {
    //   if (UserConfig.user.sex == "0") {
    //     this.sex = "未知";
    //   } else {
    //     this.sex = UserConfig.user.sex == "1" ? "男" : "女";
    //   }
    // }
    //
    // this.uo.user.bothday  = UserConfig.user.bothday.replace(new RegExp('/', 'g'), '-');

    this.birthdaypicker.max = moment().format("YYYY-MM-DD");
  }

  ionViewDidEnter() {
    this.getData();
  }

  getData() {
    this.psService.findPerson(UserConfig.user.id).then(data => {
      this.uo.user.id = UserConfig.user.id;
      this.uo.user.aid = UserConfig.user.aid;
      this.uo.user.nickname = UserConfig.user.nickname;
      this.uo.user.birthday = UserConfig.user.birthday;
      this.uo.user.realname = UserConfig.user.realname;
      this.uo.user.useMp3 = UserConfig.user.useMp3;
      this.uo.user.ic = UserConfig.user.ic;
      this.uo.user.sex = UserConfig.user.sex;
      this.uo.user.contact = UserConfig.user.contact;
      this.uo.user.birthday = this.uo.user.birthday.replace(new RegExp('/', 'g'), '-');
      this.olduo.user.id = UserConfig.user.id;
      this.olduo.user.aid = UserConfig.user.aid;
      this.olduo.user.nickname = UserConfig.user.nickname;
      this.olduo.user.birthday = UserConfig.user.birthday;
      this.olduo.user.realname = UserConfig.user.realname;
      this.olduo.user.ic = UserConfig.user.ic;
      this.olduo.user.sex = UserConfig.user.sex;
      this.olduo.user.useMp3 = UserConfig.user.useMp3;
      this.olduo.user.contact = UserConfig.user.contact;
      this.olduo.user.birthday = this.olduo.user.birthday.replace(new RegExp('/', 'g'), '-');

      // this.avatar = this.uo.user.avatar;
      // this.uo.user.bothday = this.uo.user.bothday.replace(new RegExp('/', 'g'), '-');
    });
  }

  goBack() {
    this.remindfeedbackService.remindAudioStop();
    this.navCtrl.pop();
  }

  ionViewWillLeave() {
    if (this.actionSheet !== undefined) {
      this.actionSheet.dismiss();
    }
    //console.log(this.dateTimes.toArray());
    for (let i = 0; i < this.dateTimes.toArray().length; i++) {
      if (this.dateTimes.toArray()[i]._picker != undefined) {
        this.dateTimes.toArray()[i]._picker.dismiss();
      }
    }
  }

  check(){
    if (this.olduo.user.sex != this.uo.user.sex || this.olduo.user.birthday != this.uo.user.birthday ||
      this.olduo.user.contact != this.uo.user.contact || this.olduo.user.ic != this.uo.user.ic ||
      this.olduo.user.nickname != this.uo.user.nickname || this.olduo.user.useMp3 != this.uo.user.useMp3){
      this.buttons.save = true;
    }else{

      this.buttons.save = false;
    }
  }

  save() {
      let inData: any = {};
      inData.sex = this.uo.user.sex;
      inData.birthday = this.uo.user.birthday.replace(new RegExp('/', 'g'), '-');
      inData.contact = this.uo.user.contact;
      inData.ic = this.uo.user.ic;
      inData.realname = this.uo.user.nickname;
      inData.nickname = this.uo.user.nickname;
      inData.extends = {};
      inData.extends.useMp3 = this.uo.user.useMp3;

      this.psService.saveUser(this.uo.user.id, inData).then(data => {
        this.goBack();
      }).catch(error => {
        this.util.toastStart(error,2000);
      })
  }

  async selectSex() {
    this.actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: '男',
        handler: () => {
          this.uo.user.sex = '1';
          this.check();
        }
      }, {
        text: '女',
        handler: () => {
          this.uo.user.sex = '2';
          this.check();
        }
      }]
    });
    await this.actionSheet.present();
  }


  preview(r:any){
    this.remindfeedbackService.remindAudioStop();
    this.remindfeedbackService.remindAudio(this.uo.user.useMp3,()=>{},()=>{});
    this.check();
  }

}
