import {Component, ElementRef, Renderer2, ViewChild, ViewChildren, QueryList } from '@angular/core';
import {IonicPage, NavController, ModalController, NavParams, Slides} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {RestFulHeader, RestFulConfig} from "../../service/config/restful.config";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import * as moment from "moment";
import { CalendarDay } from "../../components/ion2-calendar";
import { AgendaService } from "./agenda.service";
import { ScdData, ScdPageParamter } from "../../data.mapping";
import {EmitService} from "../../service/util-service/emit.service";
import {DataConfig} from "../../service/config/data.config";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {PageBoxComponent} from "../../components/page-box/page-box";
import {CalendarService} from "../../service/business/calendar.service";
import {EventService, TaskData} from "../../service/business/event.service";
import { PageDirection, IsSuccess } from "../../data.enum";

/**
 * Generated class for the 日程创建/修改 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-agenda',
  template: `<page-box title="活动" (onBack)="goBack()">
        <ion-card>
          <!--主题-->
          <ion-textarea></ion-textarea>

          <ion-card-content>
            <div class="card-subtitle">
              <button ion-button icon-end clear small>
                <div>附件: 点此查看附件</div>
                <ion-icon ios="md-attach" md="md-attach"></ion-icon>
              </button>
            </div>
            <div class="card-subtitle">
              <button ion-button icon-end clear small>
                <ion-icon ios="ios-pin" md="ios-pin"></ion-icon>
                <div>地址</div>
              </button>
            </div>
            <div class="card-subtitle">
              <button ion-button icon-end clear small>
                <ion-icon ios="ios-create" md="ios-create"></ion-icon>
                <div>备注</div>
              </button>
            </div>
          </ion-card-content>

          <!--附加属性操作-->
          <ion-row>
            <ion-col>
              <button ion-button icon-start clear small>
                <ion-icon ios="md-attach" md="md-attach"></ion-icon>
                <div>附件</div>
              </button>
            </ion-col>
            <ion-col>
              <button ion-button icon-start clear small>
                <ion-icon ios="ios-pin" md="ios-pin"></ion-icon>
                <div>地址</div>
              </button>
            </ion-col>
            <ion-col>
              <button ion-button icon-start clear small>
                <ion-icon ios="ios-create" md="ios-create"></ion-icon>
                <div>备注</div>
              </button>
            </ion-col>
            <ion-col>
              <button ion-button icon-only clear small>
                <ion-icon ios="md-star-outline" md="md-star-outline"></ion-icon>
              </button>
            </ion-col>
          </ion-row>

          <!--控制操作-->
          <ion-row>
            <ion-col>
              <button ion-button icon-start clear small>
                <ion-icon ios="ios-add" md="ios-add"></ion-icon>
                <div>计划</div>
              </button>
            </ion-col>
            <ion-col>
              <button ion-button icon-start clear small>
                <ion-icon ios="md-notifications" md="md-notifications"></ion-icon>
                <div>提醒</div>
              </button>
            </ion-col>
            <ion-col>
              <button ion-button icon-start clear small>
                <ion-icon ios="ios-repeat" md="ios-repeat"></ion-icon>
                <div>重复</div>
              </button>
            </ion-col>
            <ion-col>
              <button ion-button icon-start clear small>
                <ion-icon ios="ios-person-add" md="ios-person-add"></ion-icon>
                <div>邀请</div>
              </button>
            </ion-col>
          </ion-row>
        </ion-card>
      </page-box>`
})
export class AgendaPage {
  statusBarColor: string = "#3c4d55";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtr: ModalController,
              private emitService: EmitService,
              private agendaService: AgendaService,
              private util: UtilService,
              private feedback: FeedbackService,
              private calendarService: CalendarService,
              private eventService: EventService,
              private sqlite:SqliteExec) {
    moment.locale('zh-cn');
  }

  ionViewDidLoad() {
  }

  goBack() {
    this.navCtrl.pop();
  }
}
