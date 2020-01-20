import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {AiData, AiService, ScdAiData, ScdLsAiData} from "./ai.service";
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
        <div class="scdTip" *ngIf="aiData.speechAi.tips">
            <ul>
              <li *ngFor="let tips of aiData.speechAi.arraytips">{{tips}}</li>
            </ul>
        </div>
      </div>
    </ng-template>
    <ng-template [ngIf]="aiData.speechAi && aiData.speechAi.iswaitting">
      <div  class="aiAn">
        <div class="ainame">小冥</div>
        <div class="aicontent aiSpeechAn">
        <div class="box">
          <div class="box1">
          </div>
          <div class="box2">
          </div>
          <div class="box3">
          </div>
          <div class="box4">
          </div>
          <div class="box5">
          </div>
        </div>
        </div>
      </div>
    </ng-template>
    <ng-template [ngIf]="aiData.scd">
      <div no-lines class="scd">
        <div  class="aiscdAn">
          <div class="aiSpeechAn" *ngIf="aiData.scd.an">
            {{aiData.scd.an}}
          </div>
          <div class="aiscdcontent"  (click)="showScd(aiData.scd)">
            <div class="scdWarp">
              <div class="title">
                <span *ngIf="!aiData.scd.type || aiData.scd.type == 'event'">活动</span>
                <span *ngIf="!aiData.scd.type || aiData.scd.type == 'calendar'">日历项</span>
                <span *ngIf="!aiData.scd.type || aiData.scd.type == 'memo'">备忘</span>
              </div>
              <div class="ti"><span>主题</span><span>{{aiData.scd.ti}}</span></div>
              <div class="date">
                <span>日期</span>
                <span>{{aiData.scd.d | formatedate:"CYYYY/MM/DD W"}} {{(aiData.scd.d + "T" + aiData.scd.t) | formatedate : "A h:mm"}}</span>
              </div>
              <div class="add"  *ngIf="aiData.scd.adr && aiData.scd.adr != ''"><span >地址</span><span>{{aiData.scd.adr}}</span></div>
              <div class="friend" *ngIf="aiData.scd.friends.length > 0">
                <span>参与人</span>
                <span>
                  <b *ngFor="let fs of aiData.scd.friends">
                    {{fs.n}}
                  </b>
                </span>
              </div>
            </div>
          </div>
          <div class="scdTip">
            <span >点击或说"进入编辑"</span>
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
            <div *ngFor="let scd of aiData.scdList.datas,let i = index" (click)="showScd(scd)">
              <span class="date" *ngIf="(i == 0 || aiData.scdList.datas[i-1].d != scd.d)">{{countDay(scd.d)}}</span>
              <span class="ti">{{(scd.d + "T" + scd.t) | formatedate : "A h:mm"}} {{scd.ti}}</span>
            </div>
          </div>
          <div class="scdTip">
            <span >{{aiData.scdList.scdTip}}</span>
            <ion-icon class="fal fa-microphone" (click)="speakScd(aiData.scdList)"></ion-icon>
          </div>
        </div>

      </div>
    </ng-template>
  `,
})
export class AiChildenComponent {


  @Input("aiData") aiData: AiData;

  selfName:string="";

  @ViewChild("waitting")
  waitting: ElementRef;


  constructor(public aiService: AiService,private userConfig :UserConfig) {
    this.selfName = UserConfig.user.realname;
  }

  speakScd(scds: ScdLsAiData) {
    this.aiService.speakScd(scds);
  }

  showScd(scd: ScdAiData) {
    this.aiService.showScd(scd);
  }

  countDay(d :string){
    return this.aiService.countDay(d);
  }

  GetOneBhiu(id){
      return this.userConfig.GetOneBhiu(id);
  }
}
