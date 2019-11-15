import {Component} from '@angular/core';
import {
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';
import {CalendarDay} from "../../components/ion2-calendar";
import * as moment from "moment";
import {ScdPageParamter} from "../../data.mapping";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {DataConfig} from "../../service/config/data.config";
import {UtilService} from "../../service/util-service/util.service";
import {ModalTranType} from "../../data.enum";

/**
 * Generated class for the 首页 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-plusModal',
  template: `
    <ion-content>
      <div class="choosebackdrop" (click)="close()"></div>
      <div class="chooseWarp">
        <ion-grid>

          <ion-row class="chooseDay">
            <div col-12>
              <p>所选日期 <b>{{chooseDay}}</b></p>
            </div>
          </ion-row>

          <ion-row>
            <div col-1></div>
            <div col-3>
              <button ion-button clear (click)="newMome()">
                <ion-icon class="fad fa-book-heart"></ion-icon>
              </button>
              <p>备忘</p>
            </div>
            <div col-4>
              <button ion-button clear (click)="newAgenda()">
                <ion-icon class="fad fa-calendar-edit"></ion-icon>
              </button>
              <p>活动</p>
            </div>
            <div col-3>
              <button ion-button clear (click)="newDay()">
                <ion-icon class="fad fa-calendar-star"></ion-icon>
              </button>
              <p>日历项</p>
            </div>

            <div col-1></div>
          </ion-row>
          <ion-row>
            <div col-12>
              <button ion-button clear (click)="close()">
                <ion-icon class="fal fa-times-circle"></ion-icon>
              </button>
            </div>
          </ion-row>
        </ion-grid>

      </div>

    </ion-content>
  `,
})
export class PlusModal {
  paramter: CalendarDay;
  chooseDay: string;

  constructor(private navController: NavController,
              private feedback: FeedbackService,
              private util: UtilService,
              public navParams: NavParams,
              public viewCtrl: ViewController,) {
    if (this.navParams) {
      this.paramter = this.navParams.data;
      this.chooseDay = moment(this.paramter.time).format("YYYY年MM月DD日");
    }
  }


  ionViewDidLoad() {

  }


  newAgenda() {
    let p: ScdPageParamter = new ScdPageParamter();

    if (this.paramter) {
      p.d = moment(this.paramter.time);
    } else {
      p.d = moment();
    }

    this.feedback.audioPress();
    this.close();
    this.util.createModal(DataConfig.PAGE._AGENDA_PAGE, p, ModalTranType.scale).present().then(() => {
    });
  }


  newDay() {
    let p: ScdPageParamter = new ScdPageParamter();

    if (this.paramter) {
      p.d = moment(this.paramter.time);
    } else {
      p.d = moment();
    }

    this.feedback.audioPress();
    this.close();
    this.util.createModal(DataConfig.PAGE._COMMEMORATIONDAY_PAGE, p, ModalTranType.scale).present().then(() => {
    });
  }

  newMome() {

    let todayday: string = moment().format("YYYY/MM/DD");
    if (this.paramter) {
      todayday = moment(this.paramter.time).format("YYYY/MM/DD");
    }
    this.feedback.audioPress();
    this.close();
    let modal = this.util.createModal(DataConfig.PAGE._MEMO_PAGE, {day: todayday}, ModalTranType.scale).present().then(() => {
    })


  }

  close() {
    this.navController.pop();
  }
}
