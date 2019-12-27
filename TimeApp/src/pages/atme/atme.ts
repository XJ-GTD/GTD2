import {Component, EventEmitter, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import {IonicPage, NavController, ModalController, NavParams} from 'ionic-angular';
import {Annotation, AnnotationService} from "../../service/business/annotation.service";
import {UserConfig} from "../../service/config/user.config";
import {ScdPageParamter} from "../../data.mapping";
import * as moment from "moment";
import {DataConfig} from "../../service/config/data.config";
import {UtilService} from "../../service/util-service/util.service";
import {ModalTranType} from "../../data.enum";

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
        <ng-template [ngIf]="annotationList.length > 0"
                     [ngIfElse]="noat">
        <ion-grid class = "list-grid-content">
          <ion-row class="item-content item-content-backgroud" leftmargin toppaddingsamll bottompaddingsamll rightmargin *ngFor="let annotation of annotationList"
                   (click)="gotoDetail(annotation)">
            <div class="line font-normal" leftmargin rightmargin>
              <div class="st font-small">  {{annotation.dt | transfromdate:'withNow'}}</div>

              <div class="person font-small">{{annotation.ui | formatuser: currentuser: friends}} @ 了你</div>
            </div>
            
            <div class="line font-normal" leftmargin rightmargin>
              <div class="sn towline">{{annotation.content}}</div>
            </div>
     
          </ion-row>
        </ion-grid>
        </ng-template>
        <ng-template #noat>
          <div class="notask">
            <ion-icon class="fal fa-grin-beam"></ion-icon>
            <span>没有人给你@哦～</span>
          </div>
        </ng-template>
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

  friends: Array<any> = UserConfig.friends;
  annotationList: Array<Annotation> =new Array<Annotation>();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private annotationService : AnnotationService,
              private util:UtilService) {

    annotationService.delAnnotation();
    annotationService.fetchAnnotations().then(data =>{
      this.annotationList = data;
    });


  }

  goBack(page: any, para: any) {
    this.navCtrl.pop();
  }

  gotoDetail(ano: any) {

      let p: ScdPageParamter = new ScdPageParamter();

      p.si = ano.obi;

      this.util.createModal(DataConfig.PAGE._AGENDA_PAGE, p,ModalTranType.scale).present();
  }
}
