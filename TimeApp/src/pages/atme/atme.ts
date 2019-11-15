import {Component, EventEmitter, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import {IonicPage, NavController, ModalController, NavParams} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import * as async from "async/dist/async.js"
import * as moment from "moment";
import { ScdPageParamter } from "../../data.mapping";
import {EmitService} from "../../service/util-service/emit.service";
import {DataConfig} from "../../service/config/data.config";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {TaskListComponent} from "../../components/task-list/task-list";
import {CalendarService} from "../../service/business/calendar.service";
import {EventService, AgendaData} from "../../service/business/event.service";
import { PageDirection, OperateType, EventFinishStatus } from "../../data.enum";
import {AtmeService} from "./atme.service";
import {Annotation, AnnotationService} from "../../service/business/annotation.service";

/**
 * Generated class for the 待处理/已处理任务一览 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-atme',
  template:
    `
      <page-box title="@我的" [buttons]="buttons" (onBack)="goBack()">
        <ion-list >
          <ion-list-header>
          </ion-list-header>
          <ion-item *ngFor="let annotation of annotationList" >

            <ion-label>
              发起人：{{annotation.ran}}
            </ion-label>
            <ion-label>
              @时间：{{annotation.dt}}
            </ion-label>
            <ion-label>
              内容：{{annotation.content}}
            </ion-label>
          </ion-item>
        </ion-list>
      </page-box>
    `
})
export class AtmePage {

  buttons: any = {
    remove: false,
    share: false,
    save: false,
    create: false,
    cancel: true
  };

  annotationList: Array<Annotation> ;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private annotationService : AnnotationService) {

    annotationService.delAnnotation();
    annotationService.getAnnotation().then(data =>{
      this.annotationList = data;
    });


  }

  goBack(page: any, para: any) {
    this.navCtrl.pop();
  }
}
