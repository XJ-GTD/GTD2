import {Component,  OnInit} from '@angular/core';
import {IonicPage, PopoverController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the BackComponent page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'ConfirmboxComponent',
  template: `<ion-list >
    <ion-list-header>提示</ion-list-header>
    <ion-item >
      <ion-label>{{msg}}</ion-label>
    </ion-item>
    <ion-row>
      <ion-col class="col-al">
        <button ion-button (click)="close()" >取消</button>
      </ion-col>
      <ion-col class="col-al">
        <button ion-button (click)="ok()">确定</button>
      </ion-col>
    </ion-row>
    </ion-list >`,
})
export class ConfirmboxComponent{

  constructor(private navParams: NavParams,public viewCtrl: ViewController) {

  }

  msg:string ="";

  ngOnInit() {
    if (this.navParams.data) {
      //this.msg = this.navParams.data.msg;
      let m = this.navParams.data.msg;
      switch (m){
        case "1":
          this.msg ="是否保存？";
          break;
        case "2":
          this.msg ="是否删除？";
          break;
        case "3":
          this.msg ="是否分享？";
          break;
        default :
          this.msg = m;
      }
    }
  }
  ok() {
    this.viewCtrl.dismiss({ret:"0"});
  }
  close() {
    this.viewCtrl.dismiss({ret:"1"});
  }

}
