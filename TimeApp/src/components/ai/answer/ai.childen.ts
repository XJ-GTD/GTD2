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

    <ng-template [ngIf]="aiData.speechAi && aiData.speechAi.iswaitting">
      <div  class="aiAn">
        <div class="ainame">冥王星正在思考</div>
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
    <ng-template [ngIf]="aiData.speechAi && aiData.speechAi.org">
      <div  class="self">
        <div class="selfname">{{selfName}}</div>
        <div class="selfcontent">{{aiData.speechAi.org}}</div>
      </div>
    </ng-template>
    <ng-template [ngIf]="aiData.speechAi && aiData.speechAi.an">
      <div  class="aiAn">
        <div class="ainame">冥王星</div>
        <div class="aicontent aiSpeechAn">{{aiData.speechAi.an}}</div>
      </div>
    </ng-template>    
    <ng-template [ngIf]="aiData.scd">
      <div no-lines class="scd">
        <div  class="aiscdAn">
          <div class="aiSpeechAn" *ngIf="aiData.scd.an">
            {{aiData.scd.an}}
          </div>
          <div class="aiscdcontent">
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
              <div class="friend" *ngIf="aiData.scd.showfriends.length > 0">
                <span>参与人</span>
                <span>
                  <b *ngFor="let fs of aiData.scd.showfriends">
                    {{fs.n}}
                  </b>
                </span>
              </div>
              
              <div class="friend" *ngIf="aiData.scd.friends.length > 0">
                <span>通知</span>
                <span>
                  <b *ngFor="let fs of aiData.scd.friends">
                    {{fs.n}}
                  </b>
                </span>
              </div>
              <div class="help" *ngIf=" aiData.showHelp">
                  <button (click)="showScd(aiData.scd)">查看</button>
                  <button (click)="speakScd(aiData.scd)">播报</button>
              </div>
            </div>
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
            <div *ngFor="let scd of aiData.scdList.datas,let i = index" (click)="showScd(scd)" [class.memo]="scd.type == 'memo'" 
                 [class.event]="scd.type == 'event'" 
                 [class.calendar]="scd.type == 'calendar'" >
              <span class="date" *ngIf="(i == 0 || aiData.scdList.datas[i-1].d != scd.d)">{{countDay(scd.d)}}</span>
              <span class="time">
                <i class="fal fa-book-heart" *ngIf="scd.type == 'memo'"></i>
                <i class="fal fa-calendar-edit" *ngIf="scd.type == 'event'"></i>
                <i class="fal fa-calendar-star" *ngIf="scd.type == 'calendar'"></i>
                {{(scd.d + "T" + scd.t) | formatedate : "A h:mm"}}
              </span>
              <span class="ti twoline" >
                {{scd.ti}}
              </span>
            </div>
          </div>
          <div class="help" *ngIf=" aiData.showHelp">
            <span>点击列表查看</span>
            <button  (click)="speakScdList(aiData.scdList)" icon-only>    
              <ion-icon class="fal fa-microphone" (click)="speakScd(aiData.scdList)" on-hold="speakScd(aiData.scdList)"></ion-icon>
            </button>
          </div>
        </div>
      </div>
    </ng-template>
    <ng-template [ngIf]="aiData.speechAi && aiData.showTip">
      <div class="tips" >
        <ul>
          <p>tips:</p>
          <li *ngFor="let tips of aiData.speechAi.arraytips">{{tips}}</li>
        </ul>
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

  speakScdList(scds: ScdLsAiData) {
    this.aiService.speakScdList(scds);
  }

  speakScd(scd: ScdAiData) {
    this.aiService.speakScd(scd);
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
