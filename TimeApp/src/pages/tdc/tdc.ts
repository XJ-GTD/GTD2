import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Scroll } from 'ionic-angular';

/**
 * Generated class for the 新建日程 page.
 * create by wzy
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tdc',
  providers: [],
  template:`<ion-content padding>
    <ion-grid>
      <ion-row justify-content-center>
        <div class = "input-set">
          <ion-input type="text" placeholder="我想..."></ion-input>
        </div>
      </ion-row>
      <ion-row justify-content-left>
        <div >
            <button ion-button  round class ="btn-set">添加计划</button>
        </div>
      </ion-row>
      <ion-row justify-content-left>
        <div class ="date-set"><ion-label>{{'2019/03/22' | formatedate : "CYYYY/MM/DD"}}</ion-label></div>&nbsp;&nbsp;&nbsp;&nbsp;
        <div class ="date-set"><ion-label>{{'2019/03/22' | formatedate : "CWEEK" }}</ion-label></div>&nbsp;&nbsp;
        <div><ion-label><ion-icon name="arrow-forward" color="light"></ion-icon></ion-label></div>
      </ion-row>
      <ion-row justify-content-left>
        <div><ion-label>全天</ion-label></div>
        <div><ion-item ><ion-toggle checked="true" color="danger"></ion-toggle></ion-item></div>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <div><ion-label>12:00</ion-label></div>&nbsp;&nbsp;
        <div><ion-label><ion-icon name="arrow-forward" color="light"></ion-icon></ion-label></div>
      </ion-row>
      <ion-row justify-content-left>
        <div><ion-label>重复</ion-label></div>
        <div><button ion-button  round clear class ="sel-btn-set"
                     [ngClass]="wake.close == 1?'sel-btn-seled':'sel-btn-unsel'"  
                     (click)="clickwake(1)">关</button></div>
        <div><button ion-button  round clear class ="sel-btn-set"
                     [ngClass]="wake.d == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickwake(2)">天</button></div>
        <div><button ion-button  round  clear class ="sel-btn-set"
                     [ngClass]="wake.w == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickwake(3)">周</button></div>
        <div><button ion-button  round clear class ="sel-btn-set"
                     [ngClass]="wake.m == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickwake(4)">月</button></div>
        <div><button ion-button  round clear class ="sel-btn-set"
                     [ngClass]="wake.y == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickwake(5)">年</button></div>
      </ion-row>
      <ion-row justify-content-left>
        <div><ion-label>提醒</ion-label></div>
        <div><button ion-button  round class ="sel-btn-set">5分钟</button></div>
        <div><button ion-button  round class ="sel-btn-set">10分钟</button></div>
        <div><button ion-button  round class ="sel-btn-set">15分钟</button></div>
        <div><button ion-button  round class ="sel-btn-set">30分钟</button></div>
        <div><button ion-button  round class ="sel-btn-set">1小时</button></div>
        <div><button ion-button  round class ="sel-btn-set">4小时</button></div>
        <div><button ion-button  round class ="sel-btn-set">1天</button></div>
      </ion-row>
      <ion-row justify-content-left>
        <div class = "memo-set">
          <ion-input type="text" placeholder="备注"></ion-input>
        </div>
      </ion-row>
    </ion-grid>
  </ion-content>`

})
export class TdcPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  wake = {
    close:1,
    d:0,
    w:0,
    m:0,
    y:0
  };
  event = {timeStarts :"2019/03/22"};

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewAgendaPage');
  }

  //提醒按钮显示控制
  clickwake(type){
    switch (type){
      case 1:
        this.wake.close = 1;
        this.wake.d = 0;
        this.wake.w = 0;
        this.wake.m = 0;
        this.wake.y = 0;
        break;
      case 2:
        this.wake.close = 0;
        this.wake.d = 1;
        this.wake.w = 0;
        this.wake.m = 0;
        this.wake.y = 0;
        break;
      case 3:
        this.wake.close = 0;
        this.wake.d = 0;
        this.wake.w = 1;
        this.wake.m = 0;
        this.wake.y = 0;
        break;
      case 4:
        this.wake.close = 0;
        this.wake.d = 0;
        this.wake.w = 0;
        this.wake.m = 1;
        this.wake.y = 0;
        break;
      case 5:
        this.wake.close = 0;
        this.wake.d = 0;
        this.wake.w = 0;
        this.wake.m = 0;
        this.wake.y = 1;
        break;
      default:
        this.wake.close = 1;
        this.wake.d = 0;
        this.wake.w = 0;
        this.wake.m = 0;
        this.wake.y = 0;
    }
  }

}

