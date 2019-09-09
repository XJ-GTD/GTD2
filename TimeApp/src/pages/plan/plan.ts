import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, Scroll } from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {CalendarService} from "../../service/business/calendar.service";

@IonicPage()
@Component({
  selector: 'page-plan',
  template: `
  <ion-header no-border>
    <ion-toolbar>
      <ion-title>日历</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-list radio-group [(ngModel)]="selected" (ionChange)="jhChanged()">
      <ion-item *ngFor="let option of jhoptions">
        <ion-label><i class="color-dot" [ngStyle]="{'background-color': option.jc }"></i> {{option.jn}}</ion-label>
        <ion-radio [checked]="option.ji == selected" [value]="option.ji"></ion-radio>
      </ion-item>
    </ion-list>
  </ion-content>

  <ion-footer class="foot-set">
    <ion-toolbar>
    <button ion-button full (click)="close()">
      关闭
    </button>
    </ion-toolbar>
  </ion-footer>
  `
})
export class PlanPage {
  statusBarColor: string = "#3c4d55";

  jhoptions: Array<any> = new Array<any>();
  selected: string = "";
  selectedJh: any = "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private calendarService: CalendarService,
              private util: UtilService) {
    if (this.navParams && this.navParams.data) {
      this.selectedJh = this.navParams.data;
      this.selected = this.navParams.data.ji;
    }
  }

  ionViewDidEnter(){
    this.getAllJh();
  }

  getAllJh(){
    this.util.loadingStart();
    this.calendarService.fetchPrivatePlans().then(data=>{
      this.jhoptions = data;

      this.util.loadingEnd();
    }).catch(error=>{
      this.util.toastStart('获取计划失败',1500);
      this.util.loadingEnd();
    });
  }

  jhChanged() {
    for (let option of this.jhoptions) {
      if (option.ji == this.selected) {
        this.selectedJh = option;
        break;
      }
    }
  }

  close() {
    let data: Object = {jh: this.selectedJh};
    this.viewCtrl.dismiss(data);
  }

}
