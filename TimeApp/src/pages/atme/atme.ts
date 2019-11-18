import {Component, EventEmitter, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import {IonicPage, NavController, ModalController, NavParams} from 'ionic-angular';
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
