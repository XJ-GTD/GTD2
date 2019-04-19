import {Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import {ActionSheetController, DateTime, IonicPage, NavController} from 'ionic-angular';
import {PsService} from "./ps.service";
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {DataConfig} from "../../service/config/data.config";
import {PageUData} from "../../data.mapping";
import {Keyboard} from "@ionic-native/keyboard";

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
  template:`
  <ion-header> 
    <ion-toolbar>
      <ion-buttons left>
        <button ion-button icon-only (click)="goBack()" color="danger">
          <!--<ion-icon name="arrow-back"></ion-icon>-->
          <img class="img-header-left" src="./assets/imgs/back.png">
        </button>
      </ion-buttons>
    </ion-toolbar> 
  </ion-header> 
  <ion-content padding class="page-backgroud-color">
    <ion-grid #grid>
      <ion-item class="no-border">
        <ion-input type="text" style="font-size: 23px;" [(ngModel)]="uo.user.name" (ionBlur)="save()"></ion-input>
        <ion-avatar item-end>
          <img [src]="avatar" style="width: 60px;height: 60px">
        </ion-avatar>
      </ion-item>
    
      <ion-list>
        
        <ion-item class="bg-right-img" (click)="selectSex()">
          <ion-label>性别</ion-label>
          <ion-label  item-end text-end >{{sex}}</ion-label>
        </ion-item>
        <ion-item class="bg-right-img">
          <ion-label>生日</ion-label>
          <ion-datetime displayFormat="YYYY-MM-DD" item-end text-end [(ngModel)]="birthday"
                        min="1949-01-01" max="2039-12-31"  cancelText="取消" doneText = "确认" (ionCancel)="getDtPickerSel($event)"></ion-datetime>
        </ion-item>
        <ion-item class="bg-right-img">
          <ion-label>身份证</ion-label>
          <ion-input type="tel" item-end text-end [(ngModel)]="uo.user.No" (ionBlur)="save()"></ion-input>
        </ion-item>
        <ion-item class="bg-right-img">
          <ion-label>联系方式</ion-label>
          <ion-input type="tel" text-end [(ngModel)]="uo.user.contact" (ionBlur)="save()" (focus)="commentFocus()" (blur)="commentBlur()"></ion-input>
        </ion-item>
        
      </ion-list>
    </ion-grid>
  </ion-content>`,
})
export class PsPage {

  // 判断是否有模态框弹出 控制安卓物理返回键
  @ViewChildren(DateTime) dateTimes: QueryList<DateTime>;
  actionSheet;

  @ViewChild("grid")
  grid: ElementRef;

  today: any = new Date();
  sex:string = '';
  birthday:string = '';
  avatar:any = DataConfig.HUIBASE64;
  uo:PageUData = new PageUData();
  olduo:PageUData = new PageUData();

  constructor(public navCtrl: NavController,
              private psService:PsService,
              private actionSheetController: ActionSheetController,
              private util: UtilService,
              private keyboard: Keyboard,
              private _renderer: Renderer2,) {
  }

  commentFocus() {
    if (this.keyboard){
      this._renderer.setStyle(this.grid.nativeElement, "transform", "translateY(-80px)");
    }
  }

  commentBlur() {
    this._renderer.setStyle(this.grid.nativeElement, "transform", "translateY(0px)");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UcPage');
    Object.assign(this.uo.user,UserConfig.user);
    Object.assign(this.uo.account,UserConfig.account);

    Object.assign(this.olduo.user,UserConfig.user);
    Object.assign(this.olduo.account,UserConfig.account);

    this.avatar = UserConfig.user.avatar;

    if (UserConfig.user.sex != undefined && UserConfig.user.sex != '') {
      if( UserConfig.user.sex == "0"){
        this.sex = "未知";
      }else {
        this.sex = UserConfig.user.sex == "1" ? "男":"女";
      }
    }

    this.birthday = UserConfig.user.bothday.replace(new RegExp('/','g'),'-');
  }

  ionViewDidEnter(){
    this.getData();
  }

  getData(){
    this.psService.findPerson(UserConfig.user.id).then(data=>{
      this.uo.user = UserConfig.user;

      this.avatar = this.uo.user.avatar;
      if (this.uo.user.sex != undefined && this.uo.user.sex != '') {
        if( this.uo.user.sex == "0"){
          this.sex = "未知";
        }else {
          this.sex = this.uo.user.sex == "1" ? "男":"女";
        }
      }
      this.birthday = this.uo.user.bothday.replace(new RegExp('/','g'),'-');
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  ionViewWillLeave() {
    if (this.actionSheet !== undefined) {
      this.actionSheet.dismiss();
    }
    //console.log(this.dateTimes.toArray());
    for(let i = 0;i<this.dateTimes.toArray().length;i++){
      if(this.dateTimes.toArray()[i]._picker != undefined){
        this.dateTimes.toArray()[i]._picker.dismiss();
      }
    }
  }

  save(){
    let inData:any;
    let isUpd = false;
    if(this.olduo.user.sex != this.uo.user.sex){
      isUpd = true;
      inData = {sex:this.uo.user.sex};
    }
    if(this.olduo.user.bothday != this.uo.user.bothday){
      isUpd = true;
      inData = {birthday:this.uo.user.bothday};
    }
    if(this.olduo.user.contact != this.uo.user.contact){
      isUpd = true;
      inData = {contact:this.uo.user.contact};
    }
    if(this.olduo.user.name != this.uo.user.name){
      isUpd = true;
      inData = {nickname:this.uo.user.name};
    }
    if(this.olduo.user.No != this.uo.user.No){
      isUpd = true;
      inData = {ic:this.uo.user.No};
    }

    if(this.uo.user.name == ""){
      isUpd = false;
      this.util.popoverStart("用户名不能为空");
      this.uo.user.name = this.olduo.user.name;
    }

    if(isUpd){
      this.psService.saveUser(this.uo.user.id,inData).then(data=>{
        if(data.code ==0){
          //this.util.popoverStart('保存成功！');
          this.getData();
          Object.assign(this.olduo.user,this.uo.user);  //替换旧数据
        }else{
          this.util.popoverStart(data.message);
        }
      })
    }

  }
  getDtPickerSel(evt){

    let el = document.getElementsByClassName("picker-opt-selected")

    if (el && el.length==3){
      this.birthday = el[0].textContent + "-" +el[1].textContent +"-" +el[2].textContent;
      this.uo.user.bothday = this.birthday.replace(new RegExp('-','g'),'/');
      this.save();
    }

  }

  async selectSex() {
    this.actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: '男',
        handler: () => {
          this.uo.user.sex = '1';
          console.log("男:" + this.uo.user.sex);
          this.sex = this.uo.user.sex == "1" ? "男" : "女";
          this.save();
        }
      }, {
        text: '女',
        handler: () => {
          this.uo.user.sex = '2';
          console.log("女:" + this.uo.user.sex);
          this.sex = this.uo.user.sex == "1" ? "男" : "女";
          this.save();
        }
      }]
    });
    await this.actionSheet.present();
  }

}
