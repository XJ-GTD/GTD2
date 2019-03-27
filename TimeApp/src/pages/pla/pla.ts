import { Component } from '@angular/core';
import {Events, IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {PlService} from "../pl/pl.service";
import {PagePDPro} from "../pd/pd.service";

/**
 * Generated class for the PlaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pla',
  template:
  `
  <ion-content class="nobackground" padding >
        <ion-grid (click)="close()">
      </ion-grid>
  </ion-content>
    <ion-content class="coverage" padding>
      <ion-grid>
        <ion-row>
          <ion-list  no-lines  radio-group [(ngModel)]="jhData.ji">
            <div *ngFor="let jh of jhs">
              <ion-item class="plan-list-item" *ngIf="jh.jt=='2'" >
                <div class="color-dot" [ngStyle]="{'background-color': jh.jc }" item-start></div>
                <ion-label>{{jh.jn}}</ion-label>
                <ion-radio value="{{jh.ji}}" [ngStyle]="{'checked': jh.ji == jhData.ji , 'none': jh.ji != jhData.ji}"></ion-radio>
              </ion-item>
            </div>
          </ion-list>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
})
export class PlaPage {

  jhs:any;
  jhData:PagePDPro = new PagePDPro;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private plService:PlService,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlaPage');
  }

  ionViewWillEnter(){
    this.getAllJh();
  }

  getAllJh(){
    this.plService.getPlan().then(data=>{
      this.jhs = data.pl;
    }).catch(res=>{
      console.log("获取计划失败" + JSON.stringify(res));
    });
  }

  close(){
    this.viewCtrl.dismiss({
      ji: this.jhData.ji
    })
  }
}
