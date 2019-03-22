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
        <div><button ion-button  round class ="sel-btn-set" 
                     [ngStyle]="{'background-color':wake.close.bkcolor,'color':wake.close.color}"
                     (click)="clickwake(1)">关</button></div>
        <div><button ion-button  round class ="sel-btn-set"
                     [ngStyle]="{'background-color':wake.d.bkcolor,'color':wake.d.color}"
                     (click)="clickwake(2)">天</button></div>
        <div><button ion-button  round class ="sel-btn-set"
                     [ngStyle]="{'background-color':wake.w.bkcolor,'color':wake.w.color}"
                     (click)="clickwake(3)">周</button></div>
        <div><button ion-button  round class ="sel-btn-set" 
                     [ngStyle]="{'background-color':wake.m.bkcolor,'color':wake.m.color}"
                     (click)="clickwake(4)">月</button></div>
        <div><button ion-button  round class ="sel-btn-set" 
                     [ngStyle]="{'background-color':wake.y.bkcolor,'color':wake.y.color}"
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


  selbkcolor :string ="#932C16";
  selcolor:string ="#FFFFFF";
  calcolor:string ="#666666";
  calbkcolor:string ="";
  wake = {
    close:{value:1,bkcolor:this.selbkcolor,color:this.selcolor},
    d:{value:0,bkcolor:this.calbkcolor,color:this.calcolor},
    w:{value:0,bkcolor:this.calbkcolor,color:this.calcolor},
    m:{value:0,bkcolor:this.calbkcolor,color:this.calcolor},
    y:{value:0,bkcolor:this.calbkcolor,color:this.calcolor}
  };
  event = {timeStarts :"2019/03/22"};

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewAgendaPage');
  }

  //提醒按钮显示控制
  clickwake(type){
    switch (type){
      case 1:
        if (this.wake.close.value == 0){
          this.wake.close.value = 1;
          this.wake.close.bkcolor = this.selbkcolor;
          this.wake.close.color = this.selcolor;
        }else{
          this.wake.close.value = 0;
          this.wake.close.bkcolor = this.calbkcolor;
          this.wake.close.color = this.calcolor;
        }

      case 2:
        if (this.wake.d.value == 0){
          this.wake.d.value = 1;
          this.wake.d.bkcolor = this.selbkcolor;
          this.wake.d.color = this.selcolor;
        }else{
          this.wake.d.value = 0;
          this.wake.d.bkcolor = this.calbkcolor;
          this.wake.d.color = this.calcolor;
        }
      case 3:
        if (this.wake.w.value == 0){
          this.wake.w.value = 1;
          this.wake.w.bkcolor = this.selbkcolor;
          this.wake.w.color = this.selcolor;
        }else{
          this.wake.w.value = 0;
          this.wake.w.bkcolor = this.calbkcolor;
          this.wake.w.color = this.calcolor;
        }
      case 4:
        if (this.wake.m.value == 0){
          this.wake.m.value = 1;
          this.wake.m.bkcolor = this.selbkcolor;
          this.wake.m.color = this.selcolor;
        }else{
          this.wake.m.value = 0;
          this.wake.m.bkcolor = this.calbkcolor;
          this.wake.m.color = this.calcolor;
        }
      case 5:
        if (this.wake.y.value == 0){
          this.wake.y.value = 1;
          this.wake.y.bkcolor = this.selbkcolor;
          this.wake.y.color = this.selcolor;
        }else{
          this.wake.y.value = 0;
          this.wake.y.bkcolor = this.calbkcolor;
          this.wake.y.color = this.calcolor;
        }
      default:
        if (this.wake.close.value == 0){
          this.wake.close.value = 1;
          this.wake.close.bkcolor = this.selbkcolor;
          this.wake.close.color = this.selcolor;
        }else{
          this.wake.close.value = 0;
          this.wake.close.bkcolor = this.calbkcolor;
          this.wake.close.color = this.calcolor;
        }
    }
  }

}

