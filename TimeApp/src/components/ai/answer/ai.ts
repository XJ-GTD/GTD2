import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {Icon, IonicPage} from 'ionic-angular';
import {AiService} from "./ai.service";
import {UtilService} from "../../../service/util-service/util.service";
import {
  EmitService,
  FriendEmData,
  ScdEmData,
  ScdLsEmData,
  SpeechEmData
} from "../../../service/util-service/emit.service";

/**
 * Generated class for the HbPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'AiComponent',
  template: `
    <ion-content>
      <div class="aiWarp" #aiWarp>
        <ion-card class="card" #card3 *ngIf="aiData3">
          <div ion-item *ngIf="aiData3.speechAi" class="self">{{aiData3.speechAi.org}}</div>
          <div ion-item *ngIf="aiData3.speechAi" class="aiAn">{{aiData3.speechAi.an}}</div>
          <div *ngIf="aiData3.scd" class="scd">
            <ion-list no-line>
              <ion-item><p class="scdTip">新建日程信息</p>
                <button item-end on-hold="showScd(aiData3.scd)">编辑</button>
                <button item-end on-hold="confirmScd(aiData3.scd)">确认</button>
              </ion-item>
              <ion-item><p class="ti">{{aiData3.scd.ti}}</p></ion-item>
              <ion-item><p class="date">{{aiData3.scd.d}}</p></ion-item>
              <ion-item><p class="date">{{aiData3.scd.t}}</p></ion-item>
              <ion-item class="friend">
                  <span *ngFor="let pl of aiData3.scd.friends">
                    <img class="avatar" src="{{pl.a}}">
                    <p class="fn">{{pl.n}}</p>
                  </span>
              </ion-item>
            </ion-list>
          </div>
          <ion-list no-line *ngIf="aiData3.scdList" class="scdList">
            <ion-item on-hold="speakScd(aiData3.scdList)" class="aiAn">
              {{aiData3.scdList.desc}}
              <ion-icon name="volume-up" item-end class="volume" on-hold="speakScd(aiData3.scdList)"></ion-icon>
            </ion-item>
            <ion-item *ngFor="let scd of aiData3.scdList.datas" on-hold="showScd(scd)">
              <p class="date">{{scd.d}} {{scd.t}}</p>
              <p class="ti">{{scd.ti}}</p>
            </ion-item>
          </ion-list>
        </ion-card>
        <ion-card class="card" #card2 *ngIf="aiData2">
          <div ion-item *ngIf="aiData2.speechAi" class="self">{{aiData2.speechAi.org}}</div>
          <div ion-item *ngIf="aiData2.speechAi" class="aiAn">{{aiData2.speechAi.an}}</div>
          <div *ngIf="aiData2.scd" class="scd">
            <ion-list no-line>
              <ion-item><p class="scdTip">新建日程信息</p>
                <button item-end on-hold="showScd(aiData2.scd)">编辑</button>
                <button item-end on-hold="confirmScd(aiData2.scd)">确认</button>
              </ion-item>
              <ion-item><p class="ti">{{aiData2.scd.ti}}</p></ion-item>
              <ion-item><p class="date">{{aiData2.scd.d}}</p></ion-item>
              <ion-item><p class="date">{{aiData2.scd.t}}</p></ion-item>
              <ion-item class="friend">
                  <span *ngFor="let pl of aiData2.scd.friends">
                    <img class="avatar" src="{{pl.a}}">
                    <p class="fn">{{pl.n}}</p>
                  </span>
              </ion-item>
            </ion-list>
          </div>
          <ion-list no-line *ngIf="aiData2.scdList" class="scdList">
            <ion-item on-hold="speakScd(aiData2.scdList)" class="aiAn">
              {{aiData2.scdList.desc}}
              <ion-icon name="volume-up" item-end class="volume" on-hold="speakScd(aiData2.scdList)"></ion-icon>
            </ion-item>
            <ion-item *ngFor="let scd of aiData2.scdList.datas" on-hold="showScd(scd)">
              <p class="date">{{scd.d}} {{scd.t}}</p>
              <p class="ti">{{scd.ti}}</p>
            </ion-item>
          </ion-list>
        </ion-card>
        <ion-card class="card" #card1 *ngIf="aiData1">
          <div ion-item *ngIf="aiData1.speechAi" class="self">{{aiData1.speechAi.org}}</div>
          <div ion-item *ngIf="aiData1.speechAi" class="aiAn">{{aiData1.speechAi.an}}</div>
          <div *ngIf="aiData1.scd" class="scd">
            <ion-list no-line>
              <ion-item><p class="scdTip">新建日程信息</p>
                <button item-end on-hold="showScd(aiData1.scd)">编辑</button>
                <button item-end on-hold="confirmScd(aiData1.scd)">确认</button>
              </ion-item>
              <ion-item><p class="ti">{{aiData1.scd.ti}}</p></ion-item>
              <ion-item><p class="date">{{aiData1.scd.d}}</p></ion-item>
              <ion-item><p class="date">{{aiData1.scd.t}}</p></ion-item>
              <ion-item class="friend">
                  <span *ngFor="let pl of aiData1.scd.friends">
                    <img class="avatar" src="{{pl.a}}">
                    <p class="fn">{{pl.n}}</p>
                  </span>
              </ion-item>
            </ion-list>
          </div>
          <ion-list no-line *ngIf="aiData1.scdList" class="scdList">
            <ion-item on-hold="speakScd(aiData1.scdList)" class="aiAn">
              {{aiData1.scdList.desc}}
              <ion-icon name="volume-up" item-end class="volume" on-hold="speakScd(aiData1.scdList)"></ion-icon>
            </ion-item>
            <ion-item *ngFor="let scd of aiData1.scdList.datas" on-hold="showScd(scd)">
              <p class="date">{{scd.d}} {{scd.t}}</p>
              <p class="ti">{{scd.ti}}</p>
            </ion-item>
          </ion-list>
        </ion-card>
      </div>
      <!--<ion-icon name="backspace" (click)="rad()" class="backspace"></ion-icon>-->
      <ion-icon name="close" (click)="closePage()" class="close" #close></ion-icon>
    </ion-content>
    <PointComponent></PointComponent>
  `,
})
export class AiComponent {
  @ViewChild("aiWarp") aiWarp: ElementRef;

  @ViewChild("card1") card1: ElementRef;

  @ViewChild("card2") card2: ElementRef;

  @ViewChild("card3") card3: ElementRef;

  @ViewChild("close") close: ElementRef;

  base64: string = "data:image/png;base64,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"


  aiData1: AiData = new AiData();
  aiData2: AiData = new AiData();
  aiData3: AiData = new AiData();
  //语音界面数据传递
  b: boolean;

  constructor(public aiService: AiService,
              private _renderer: Renderer2,
              private util: UtilService,
              private emitService: EmitService,
              public elementRef: ElementRef) {

  }


  ngAfterViewInit() {

    this.emitService.registerScdLs(data => {
      this.callbackScdLs(data);
    });
    this.emitService.registerSpeech(data => {
      this.callbackSpeech(data);
    });
    this.emitService.registerScd(data => {
      this.callbackScd(data);
    });
  }

  callbackScdLs(datas: ScdLsEmData) {


    this.aiData3 = this.aiData2;
    this.aiData2 = this.aiData1;
    this.aiData1 = new AiData();
    this.aiData1.speechAi = new SpeechAiData();


    this.aiData1.scdList = new ScdLsAiData();
    this.aiData1.scdList.desc = datas.desc;

    for (let scdEmData of datas.datas) {
      let aiData: ScdAiData = new ScdAiData();
      aiData.ti = scdEmData.ti;
      aiData.d = scdEmData.d;
      aiData.t = scdEmData.t
      aiData.id = scdEmData.id;
      this.aiData1.scdList.datas.push(aiData);

    }


    setTimeout(() => {
      this.calcheight();

    }, 200);
  }

  callbackSpeech(datas: SpeechEmData) {
    this.aiData3 = this.aiData2;
    this.aiData2 = this.aiData1;
    this.aiData1 = new AiData();
    this.aiData1.speechAi = new SpeechAiData();
    this.aiData1.speechAi.org = datas.org;
    this.aiData1.speechAi.an = datas.an;

    setTimeout(() => {
      this.calcheight();

    }, 200);
  }

  callbackScd(data: ScdEmData) {

    this.aiData3 = this.aiData2;
    this.aiData2 = this.aiData1;
    this.aiData1 = new AiData();
    this.aiData1.speechAi = new SpeechAiData();

    let scd1: ScdAiData = new ScdAiData();
    scd1.d = data.d;
    scd1.t = data.t;
    scd1.ti = data.ti;

    for (let femd of  data.datas)
      scd1.friends.push(femd);

    this.aiData1.scd = scd1;

    setTimeout(() => {
      this.calcheight();

    }, 200);
  }

  closePage() {
    this._renderer.setStyle(this.aiWarp.nativeElement, "transform", "translateY(-9999px)");

    this.aiData1 = new AiData();
    this.aiData2 = new AiData();
    this.aiData3 = new AiData();
    this._renderer.setStyle(this.close.nativeElement, "transform", "translateY(-9999px)");


  }

  speakScd(scds: ScdLsAiData) {

  }

  showScd(Scd: ScdAiData) {

  }

  confirmScd(Scd: ScdAiData) {

  }

  private calcheight() {

    this._renderer.setStyle(this.aiWarp.nativeElement, "transform", "translateY(0px)");
    this._renderer.setStyle(this.close.nativeElement, "transform", "translateY(-0px)");
    let winhi = window.innerHeight;
    let aiWarpHi = winhi * 0.80;
    let top = -150 - aiWarpHi;
    this._renderer.setStyle(this.aiWarp.nativeElement, "top", top + "px");
    this._renderer.setStyle(this.aiWarp.nativeElement, "height", aiWarpHi + "px");
    //this._renderer.
    // console.log("card1" + this.card1.nativeElement.clientHeight)
    // console.log("card2" +this.card2.nativeElement.clientHeight)
    // console.log("card3" +this.card3.nativeElement.clientHeight)
    let card1h = this.card1 ? this.card1.nativeElement.clientHeight : 0;
    let card2h = this.card2 ? this.card2.nativeElement.clientHeight : 0;
    let card3h = this.card3 ? this.card3.nativeElement.clientHeight : 0;
    let cardTop: number = card1h + card2h + card3h;
    top = aiWarpHi - cardTop - 45;
    if (card1h > aiWarpHi || card2h > aiWarpHi || card3h > aiWarpHi) {
      top = 0;
    }

    //
    if (this.card1)
      this._renderer.setStyle(this.card1.nativeElement, "top", top + "px");
    if (this.card2)
      this._renderer.setStyle(this.card2.nativeElement, "top", top + "px");
    if (this.card3)
      this._renderer.setStyle(this.card3.nativeElement, "top", top + "px");
  }
}

class AiData {
  speechAi: SpeechAiData;
  scdList: ScdLsAiData;
  scd: ScdAiData;
}

export class ScdLsAiData {
  desc: string = "";
  datas: Array<ScdAiData> = new Array<ScdAiData>();
}

export class ScdAiData {
  id: string = "";
  d: string = "";
  t: string = "";
  ti: string = "";
  friends: Array<FriendAiData> = new Array<FriendAiData>();
}

export class FriendAiData {
  id: string = "";
  n: string = "";
  m: string = "";
  p: string = "";
  a: string = "";
}

export class SpeechAiData {
  an: string = "";
  org: string = "";
}

