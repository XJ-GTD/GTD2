import {Component, Input} from '@angular/core';
import {AiData, AiService, ScdAiData, ScdLsAiData} from "./ai.service";
import {ModalController} from "ionic-angular";
import {FsData, ScdData, ScdPageParamter} from "../../../data.mapping";
import * as moment from "moment";
import {DataConfig} from "../../../service/config/data.config";
import {AssistantService} from "../../../service/cordova/assistant.service";
import {PgBusiService} from "../../../service/pagecom/pgbusi.service";
import {FsService} from "../../../pages/fs/fs.service";

/**
 * Generated class for the HbPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'AiChildenComponent',
  template: `

    <ng-template [ngIf]="aiData.speechAi">
      <div ion-item class="self">{{aiData.speechAi.org}}</div>
      <div ion-item class="aiAn">{{aiData.speechAi.an}}</div>
    </ng-template>
    <ng-template [ngIf]="aiData.scd">
      <div class="scd">
        <ion-list no-lines>
          <ion-item><p class="ti">{{aiData.scd.ti}}</p></ion-item>
          <ion-item><p class="date">{{aiData.scd.d | formatedate:"CYYYY/MM/DD"}}</p></ion-item>
          <ion-item><p class="date">{{aiData.scd.t}}</p></ion-item>
          <ion-item>
            <div class="friend">
              <ion-chip *ngFor="let fs of aiData.scd.friends">
                <ion-avatar>
                  <img [src]="fs.a"/>
                </ion-avatar>
                <span>{{fs.n}}</span>
              </ion-chip>
            </div>
          </ion-item>
          <ion-item><p class="scdTip">语音请说确认</p>
            <button item-end (click)="go2tdc(aiData.scd)">编辑</button>
            <button item-end (click)="confirmScd(aiData.scd)">确认</button>
          </ion-item>
        </ion-list>
      </div>
    </ng-template>
    <ng-template [ngIf]="aiData.scdList">
      <ion-list no-lines class="scdList">
        <ion-item on-hold="speakScd(aiData.scdList)" class="aiAn">
          {{aiData.scdList.desc}}
          <ion-icon name="volume-up" item-end class="volume" (click)="speakScd(aiData.scdList)"></ion-icon>
        </ion-item>
        <ion-item *ngFor="let scd of aiData.scdList.datas" (click)="showScd(scd)">
          <p class="date">{{scd.d | formatedate :"CYYYY/MM/DD"}} {{scd.t}}</p>
          <p class="ti">{{scd.ti}}</p>
        </ion-item>
      </ion-list>
    </ng-template>
  `,
})
export class AiChildenComponent {


  @Input("aiData") aiData: AiData;

  constructor(public aiService: AiService) {
  }

  speakScd(scds: ScdLsAiData) {
    this.aiService.speakScd(scds);

  }

  go2tdc(scd: ScdAiData) {
    this.aiService.go2tdc(scd);
  }

  confirmScd(scd: ScdAiData) {

    this.aiService.createScd(scd);
  }

  showScd(scd: ScdAiData) {

    this.aiService.showScd(scd);
  }
}
