import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {CalendarService} from "../../service/business/calendar.service";
import {UserConfig} from "../../service/config/user.config";

@IonicPage()
@Component({
  selector: 'page-plan',
  template: `
    <modal-box title="计划" [buttons]="buttons" (onSave)="save()" (onCancel)="cancel()">
      <div [ngStyle]="{'background': selected | formatplan: 'color' : privateplans }" class="plantitle font-large">
        {{selected | formatplan: 'name' :'选择日历': privateplans}}
      </div>
      <ng-template [ngIf]="privateplans.length > 0" [ngIfElse]="addplan">
        <ion-scroll scrollY="true" scrollheightAuto>
          <ion-list radio-group [(ngModel)]="selected" (ionChange)="jhChanged($event)" class="onlyone">
            <ion-item *ngFor="let option of privateplans">
              <ion-label>
                <ion-icon class="fal fa-circle font-large-x" *ngIf="option.ji != selected"
                          [ngStyle]="{'color': option.jc}" ></ion-icon>
                <ion-icon class="fal fa-dot-circle font-large-x" *ngIf="option.ji == selected"
                          [ngStyle]="{'color': option.jc}" ></ion-icon>
                {{option.jn}}</ion-label>
              <ion-radio [value]="option.ji" class="noshow"></ion-radio>
            </ion-item>
          </ion-list>
        </ion-scroll>
      </ng-template>
      <ng-template #addplan>
        <div class="addplan">
          <ion-icon class="fal fa-grin-beam"></ion-icon>
          <span>没有你定义的日历哟～</span>
          <button (click)="create()">
            创建日历
          </button>
        </div>
      </ng-template>
    </modal-box>
  `
})
export class PlanPage {

  buttons: any = {
    remove: false,
    share: false,
    save: true,
    cancel: true
  };
  selected: string = "";
  privateplans: Array<any> = UserConfig.privateplans;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController) {
    if (this.navParams && this.navParams.data) {
      this.selected = this.navParams.data.ji;
    }
  }

  jhChanged(option) {
    console.log(option);
  }

  save() {
    let data: string = this.selected;
    this.viewCtrl.dismiss(data);
  }

  cancel() {
    this.navCtrl.pop();
  }

  create() {

  }
}
