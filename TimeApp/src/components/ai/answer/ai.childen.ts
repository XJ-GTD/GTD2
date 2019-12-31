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
      <div  class="self">
        <div class="selfname">{{selfName}}</div>
        <div class="selfcontent">{{aiData.speechAi.org}}</div>
      </div>
    </ng-template>
    <ng-template [ngIf]="aiData.speechAi && aiData.speechAi.an">
      <div  class="aiAn">
        <div class="ainame">小冥</div>
        <div class="aicontent aiSpeechAn">{{aiData.speechAi.an}}</div>
      </div>
    </ng-template>
    <ng-template [ngIf]="aiData.scd">
      <div no-lines class="scd">
        <div  class="aiscdAn">
          <div class="aiSpeechAn">
            {{aiData.scd.an}}
          </div>
          <div class="aiscdcontent">
            <div class="scdWarp">
              <div class="title">日程</div>
              <div><span class="ti">{{aiData.scd.ti}}</span></div>
              <div><span class="date">{{aiData.scd.d | formatedate:"CYYYY/MM/DD W"}}</span> <span class="date">{{aiData.scd.t=='99:99'?'全天':aiData.scd.t}}</span></div>
              <div><span class="add">上海</span></div>
              <div>
                <div class="friend">
                  <span *ngFor="let fs of aiData.scd.friends">
                    {{fs.n}}</span>
                </div>
              </div>
              <div class="footer">
                <button (click)="go2tdc(aiData.scd)">编辑</button>
                <button (click)="confirmScd(aiData.scd)">确认</button>
              </div>
            </div>
            
          </div>
          <div class="scdTip">
            <span >{{aiData.scd.scdTip}}</span>
          </div>
        </div>
      </div>
    </ng-template>
    <ng-template [ngIf]="aiData.scdList">
      <div no-lines class="scdList">
        <div  class="ailistAn">
          <div class="aiSpeechAn" *ngIf="aiData.scdList.desc">
            {{aiData.scdList.desc}}
          </div>
          <div class="ailistcontent">
            <div *ngFor="let scd of aiData.scdList.datas,let i = index" (click)="showScdInList(scd)">
              <span class="date" *ngIf="(i == 0 || aiData.scdList.datas[i-1].d != scd.d)">{{countDay(scd.d)}}</span>
              <span class="ti">{{(scd.d + "T" + scd.t) | formatedate : "A h:mm"}} {{scd.ti}}</span>
            </div>
          </div>
          <div class="scdTip">
            <span >{{aiData.scdList.scdTip}}</span>
            <ion-icon class="fal fa-microphone" (click)="speakScd(aiData.scdList)" on-hold="speakScd(aiData.scdList)"></ion-icon>
          </div>
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
