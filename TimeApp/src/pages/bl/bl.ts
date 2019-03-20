import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {BlService, PageBlData} from "./bl.service";
import {FdService} from "../fd/fd.service";

/**
 * Generated class for the 黑名单列表 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bl',
  template: `
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons left>
          <button ion-button icon-only (click)="goBack()" color="danger">
            <ion-icon name="arrow-back"></ion-icon>
          </button>
        </ion-buttons>
        <ion-title>黑名单</ion-title>
<!--        <ion-buttons right>
          <button ion-button (click)="toAddGroupMember()" color="danger">
            &lt;!&ndash;<ion-icon name="add"></ion-icon>&ndash;&gt; 添加
          </button>
        </ion-buttons>-->
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <ion-grid>
        <ion-row>
          <ion-list no-lines>
            <ion-item class="plan-list-item"  *ngFor="let g of bls">
              <ion-avatar item-start >
                <img src="http://file03.sg560.com/upimg01/2017/01/932752/Title/0818021950826060932752.jpg">
              </ion-avatar>
              <ion-label>
                {{g.n}}
                <span style="font-size:14px;color:rgb(102,102,102);">
                   {{g.mpn}}
                 </span>
              </ion-label>
              <button ion-button color="danger" (click)="delete(g)" clear item-end>
                <img src="./assets/imgs/del_member.png">
              </button>
            </ion-item>
          </ion-list>
        </ion-row>
      </ion-grid>
    </ion-content>
  `
})
export class BlPage {
  bls:Array<PageBlData>;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public blService : BlService,public fdService : FdService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BlPage');
    this.getBl();
  }

  getBl(){
    this.blService.get().then(data=>{
      if(data != null){
        this.bls = data;
      }
    })
  }

  delete(g:PageBlData){
    this.fdService.removeBlack(g.mpn).then(data=>{
      if(data.code == 0){
        this.getBl();
        alert("删除成功")
      }
    })
  }
}
