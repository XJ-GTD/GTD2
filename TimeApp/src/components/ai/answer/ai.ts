import {Component, ElementRef, Output, Renderer2, ViewChild} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {AiData, AiService, FriendAiData, ScdAiData, ScdLsAiData, SpeechAiData} from "./ai.service";
import {UtilService} from "../../../service/util-service/util.service";
import {
  EmitService,
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
          <AiChildenComponent [aiData] = "aiData3"></AiChildenComponent>
        </ion-card>
        <ion-card class="card" #card2 *ngIf="aiData2">
          <AiChildenComponent [aiData] = "aiData2"></AiChildenComponent>
        </ion-card>
        <ion-card class="card" #card1 *ngIf="aiData1">
          <AiChildenComponent [aiData] = "aiData1"></AiChildenComponent>
        </ion-card>
      </div>
      <div class="aiWarpBack" #aiWarpback>
      </div>
      <!--<ion-icon name="backspace" (click)="rad()" class="backspace"></ion-icon>-->
      <ion-icon name="close" (click)="closePage()" class="close" #close></ion-icon>
    </ion-content>
    <PointComponent></PointComponent>
  `,
})
export class AiComponent {
  @ViewChild("aiWarp") aiWarp: ElementRef;
  @ViewChild("aiWarpback") aiWarpback: ElementRef;

  @ViewChild("card1") card1: ElementRef;

  @ViewChild("card2") card2: ElementRef;

  @ViewChild("card3") card3: ElementRef;

  @ViewChild("close") close: ElementRef;

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

    this.aiData2.copyto( this.aiData3);
    this.aiData1.copyto(this.aiData2);
    this.aiData1.clear();
    this.aiData1.speechAi = new SpeechAiData();


    this.aiData1.scdList = new ScdLsAiData();
    this.aiData1.scdList.desc = datas.desc;

    for (let scdEmData of datas.datas) {
      let aiData: ScdAiData = new ScdAiData();
      aiData.ti = scdEmData.ti;
      aiData.d = scdEmData.d;
      aiData.t = scdEmData.t
      aiData.id = scdEmData.id;
      aiData.gs = scdEmData.gs;
      this.aiData1.scdList.datas.push(aiData);

    }


    setTimeout(() => {
      this.calcheight();

    }, 200);
  }

  callbackSpeech(datas: SpeechEmData) {
    this.aiData2.copyto( this.aiData3);
    this.aiData1.copyto(this.aiData2);
    this.aiData1.clear();
    this.aiData1.speechAi = new SpeechAiData();
    this.aiData1.speechAi.org = datas.org;
    this.aiData1.speechAi.an = datas.an;

    setTimeout(() => {
      this.calcheight();

    }, 200);
  }

  callbackScd(data: ScdEmData) {
    this.aiData2.copyto( this.aiData3);
    this.aiData1.copyto(this.aiData2);
    this.aiData1.clear();
    this.aiData1.speechAi = new SpeechAiData();

    let scd1: ScdAiData = new ScdAiData();
    scd1.d = data.d;
    scd1.t = data.t;
    scd1.ti = data.ti;
    scd1.scdTip = data.scdTip;

    for (let femd of  data.datas){
      let ff:FriendAiData = new FriendAiData();
      ff.m = femd.m;
      ff.id = femd.id;
      ff.a = femd.a;
      ff.n = femd.n;
      ff.p = femd.p;
      ff.uid = femd.uid;
      scd1.friends.push(femd);

    }

    this.aiData1.scd = scd1;

    setTimeout(() => {
      this.calcheight();

    }, 200);
  }

  closePage() {
    this._renderer.setStyle(this.aiWarp.nativeElement, "transform", "translateY(-9999px)");
    this._renderer.setStyle(this.aiWarpback.nativeElement, "transform", "translateY(-9999px)");

    this.aiData1 = new AiData();
    this.aiData2 = new AiData();
    this.aiData3 = new AiData();
    this._renderer.setStyle(this.close.nativeElement, "transform", "translateY(-9999px)");


  }

  private calcheight() {

    this._renderer.setStyle(this.aiWarp.nativeElement, "transform", "translateY(0px)");
    this._renderer.setStyle(this.aiWarpback.nativeElement, "transform", "translateY(0px)");
    this._renderer.setStyle(this.close.nativeElement, "transform", "translateY(-0px)");
    let winhi = window.innerHeight;
    let aiWarpHi = winhi - 125;
    let top = -125 - aiWarpHi;
    this._renderer.setStyle(this.aiWarp.nativeElement, "top", top + "px");
    this._renderer.setStyle(this.aiWarpback.nativeElement, "top", top + "px");
    this._renderer.setStyle(this.aiWarp.nativeElement, "height", aiWarpHi + "px");
    this._renderer.setStyle(this.aiWarpback.nativeElement, "height", aiWarpHi + "px");
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

