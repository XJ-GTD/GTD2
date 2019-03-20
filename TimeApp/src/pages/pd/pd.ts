import {Component, ViewChild} from '@angular/core';
import {IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import {PagePDPro, PdService} from "./pd.service";
import {AgdPro} from "../../service/restful/agdsev";

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
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons left>
          <button ion-button icon-only (click)="goBack()" color="danger">
            <ion-icon name="arrow-back"></ion-icon>
          </button>
        </ion-buttons>

        <ion-buttons right>
          <button ion-button color="danger">
            <ion-icon name="remove-circle-outline"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <ion-grid>
        <ion-row>
          <ion-card color="danger" [ngStyle]="{'background-color': plan.pn.jc }">
            <ion-card-content text-center>
              <div>{{plan.pn.jn}}</div>
            </ion-card-content>
          </ion-card>
          <div padding></div>
        </ion-row>
        <ion-row *ngFor="let agenda of plan.pa; let i = index" [ngClass]="{'agenda-card-past': today > agenda.adt, 'agenda-card': today <= agenda.adt}" justify-content-center>
          <ion-grid>
            <ion-row *ngIf="(i === 0) || (agenda.adt.slice(0,4) !== plan.pa[i - 1]['adt'].slice(0,4))" justify-content-start>
              <h3 class="plan-year">{{agenda.adt.slice(0,4)}}</h3>
            </ion-row>
            <ion-row justify-content-center align-items-start>
              <div *ngIf="(i === 0) || (agenda.adt.slice(0,10) !== plan.pa[i - 1]['adt'].slice(0,10))" class="agenda-col-date left-off right-off" justify-content-start>
                <p class="app-agenda-day">{{agenda.adt.slice(5,10)}}</p>
              </div>
              <div *ngIf="(i !== 0) && (agenda.adt.slice(0,10) === plan.pa[i - 1]['adt'].slice(0,10))" class="agenda-col-date left-off right-off" justify-content-start>
              </div>
              <div class="agenda-col-time right-off left-off" justify-content-between>
                <div class="time-slot">
                  <p class="app-agenda-time">{{(agenda.st != null && agenda.st.length === 0)? '全天' : agenda.st.slice(0, 5)}}</p>
                </div>
                <div class="pointer-slot"><span class="plan-color-pointer"><div class="color-dot color-blue" [ngStyle]="{'background-color': plan.pn.jc }"></div></span></div>
              </div>
              <div class="agenda-col-content right-off left-off" [ngClass]="{'agenda-content': ((i + 1) === plan.pa.length)? false : (agenda.adt.slice(0, 10) === plan.pa[i + 1]['adt'].slice(0, 10))}" justify-content-start>
                <p class="text-left app-agenda-title">{{agenda.at}}</p>
                <p class="app-user-text text-left">{{agenda.am}}</p>
              </div>
            </ion-row>
          </ion-grid>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
})
export class PdPage {

  @ViewChild(Navbar) navBar: Navbar;

  jh:PagePDPro;
  today: string = new Date(new Date()).toISOString();
  plan:any ={
    "pn": {},
    "pa":new Array<AgdPro>(),
  };

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private pdService:PdService) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PdPage');

    this.jh = this.navParams.get("jh");
    this.pdService.getPlan(this.jh.ji).then(data=>{
      this.plan.pn = this.jh;
      this.plan.pa = data.data;
    })
  }

  goBack() {
    this.navCtrl.pop();
  }
}
