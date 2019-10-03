import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, Scroll } from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {CalendarService} from "../../service/business/calendar.service";

@IonicPage()
@Component({
  selector: 'page-jh',
  template: `

    <modal-box title="日历" [buttons]="buttons" (onCancel)="close()">


      <ion-scroll scrollY="true" scrollheightAuto>
        <ion-list radio-group [(ngModel)]="selected" (ionChange)="jhChanged()">
          <ion-list-header>
            选择日历
          </ion-list-header>
          <ion-item *ngFor="let option of jhoptions">
            <ion-label><i class="color-dot" [ngStyle]="{'background-color': option.jc }"></i> {{option.jn}}</ion-label>
            <ion-radio [checked]="option.ji == selected" [value]="option.ji"></ion-radio>
          </ion-item>
        </ion-list>
      </ion-scroll>
     
    </modal-box>
  `
})
export class JhPage {
  buttons: any = {
    cancel: true
  };

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
