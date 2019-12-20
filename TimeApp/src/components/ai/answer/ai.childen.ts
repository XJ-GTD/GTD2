import {Component, Input} from '@angular/core';
import {AiData, AiService, ScdAiData, ScdLsAiData} from "./ai.service";
import {ModalController} from "ionic-angular";
import {FsData, ScdData, ScdPageParamter} from "../../../data.mapping";
import * as moment from "moment";
import {DataConfig} from "../../../service/config/data.config";
import {AssistantService} from "../../../service/cordova/assistant.service";
import {PgBusiService} from "../../../service/pagecom/pgbusi.service";
import {FsService} from "../../../pages/fs/fs.service";
import {UserConfig} from "../../../service/config/user.config";

/**
 * Generated class for the HbPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'AiChildenComponent',
  template: `

    <ng-template [ngIf]="aiData.speechAi && aiData.speechAi.org">
      <div  class="self">{{selfName}} : {{aiData.speechAi.org}}</div>
    </ng-template>
    <ng-template [ngIf]="aiData.speechAi && aiData.speechAi.an">
      <div  class="aiAn">小冥 : {{aiData.speechAi.an}}</div>
    </ng-template>
    <ng-template [ngIf]="aiData.scd">
      <div class="scd">
        <div no-lines>
          <div><p class="ti">{{aiData.scd.ti}}</p></div>
          <div><span class="date">{{aiData.scd.d | formatedate:"CYYYY/MM/DD W"}}</span> <span class="date">{{aiData.scd.t=='99:99'?'全天':aiData.scd.t}}</span></div>
          <div>
            <div class="friend">
              <ion-chip *ngFor="let fs of aiData.scd.friends">
                <span>{{fs.n}}</span>
              </ion-chip>
            </div>
          </div>
          <div>
            <p class="scdTip">{{aiData.scd.scdTip}}</p>
          </div>
        </div>
      </div>
    </ng-template>
    <ng-template [ngIf]="aiData.scdList">
      <div no-lines class="scdList">
        <div on-hold="speakScd(aiData.scdList)" class="aiAn">
          {{aiData.scdList.desc}}
          <ion-icon name="volume-up" item-end class="volume" (click)="speakScd(aiData.scdList)"></ion-icon>
        </div>
        <div *ngFor="let scd of aiData.scdList.datas" (click)="showScdInList(scd)">
          <p class="date">{{countDay(scd.d) | formatedate :"CYYYY/MM/DD W"}} {{scd.t=='99:99'?'全天':scd.t}}</p>
          <p class="ti">{{scd.ti}}</p>
        </div>
        <div>
          <p class="scdTip">{{aiData.scdList.scdTip}}</p>
        </div>
      </div>
    </ng-template>
  `,
})
export class AiChildenComponent {


  @Input("aiData") aiData: AiData;

  selfName:string="";


  constructor(public aiService: AiService,private userConfig :UserConfig) {

    this.selfName = UserConfig.user.realname;
  }

  speakScd(scds: ScdLsAiData) {
    this.aiService.speakScd(scds);

  }

  confirmScd(scd: ScdAiData) {
    this.aiData.scd.saved = true;
    this.aiService.createScd(scd);
  }

  showScd(scd: ScdAiData) {
    this.aiData.scd.saved = true;
    this.aiService.showScd(scd);
  }

  countDay(d :string){
    return this.aiService.countDay(d);
  }

  GetOneBhiu(id){
      return this.userConfig.GetOneBhiu(id);
  }

  showScdInList(scd: ScdAiData) {
    this.aiService.showScd(scd);
  }
}
