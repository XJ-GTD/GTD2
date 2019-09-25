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
      <ion-toolbar>
        <ion-title [ngStyle]="{'background': selected | formatplan: 'color' : privateplans }">
          {{selected | formatplan: 'name' :'选择日历': privateplans}}
        </ion-title>
      </ion-toolbar>
      <ng-template [ngIf]="privateplans.length > 0" [ngIfElse]="addplan">
        <ion-list radio-group [(ngModel)]="selected" (ionChange)="jhChanged($event)">
          <ion-item *ngFor="let option of privateplans">
            <ion-label>{{option.jn}}</ion-label>
            <ion-icon class="fal fa-circle" [ngStyle]="{'color': option.jc}" item-start></ion-icon>
            <ion-radio [checked]="option.ji == selected" [value]="option.ji" [color]="option.jc"></ion-radio>
          </ion-item>
        </ion-list>
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
