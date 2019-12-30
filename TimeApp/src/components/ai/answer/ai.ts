import {ChangeDetectorRef, Component, ElementRef, Input, Output, Renderer2, ViewChild} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {AiData, AiService, FriendAiData, ScdAiData, ScdLsAiData, SpeechAiData} from "./ai.service";
import {UtilService} from "../../../service/util-service/util.service";
import {
  EmitService,
  ScdEmData,
  ScdLsEmData,
  SpeechEmData
} from "../../../service/util-service/emit.service";
import {Subscriber} from "rxjs";

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
      <!--<div class="aiWarpBack" #aiWarpback>-->
      <!--</div>-->
      <!--<ion-icon name="backspace" (click)="rad()" class="backspace"></ion-icon>-->
      <!--<ion-icon name="close" (click)="closePage()" class="close" #close></ion-icon>-->
  `,
})
export class AiComponent {
  @ViewChild("aiWarp") aiWarp: ElementRef;
  @ViewChild("aiWarpback") aiWarpback: ElementRef;


  aiData1: AiData = new AiData();
  aiData2: AiData = new AiData();
  aiData3: AiData = new AiData();

  scdLsemit:Subscriber<any>;
  speechemit:Subscriber<any>;
  scdemit:Subscriber<any>;
  //语音界面数据传递
  b: boolean;

  constructor(private aiService: AiService,
              private _renderer: Renderer2,
              private util: UtilService,
              private emitService: EmitService,
              private changeDetectorRef:ChangeDetectorRef) {

  }


  ngAfterViewInit() {
    this.scdLsemit = this.emitService.registerScdLs(data => {
      this.callbackScdLs(data);
      this.changeDetectorRef.detectChanges();
    });
    this.speechemit = this.emitService.registerSpeech(data => {
      this.callbackSpeech(data);
      this.changeDetectorRef.detectChanges();
    });
    this.scdemit =   this.emitService.registerScd(data => {
      this.callbackScd(data);
      this.changeDetectorRef.detectChanges();
    });
  }


  ngOnDestroy(){
    this.scdLsemit.unsubscribe();
    this.speechemit.unsubscribe();
    this.scdemit.unsubscribe();
  }


  callbackScdLs(datas: ScdLsEmData) {

    this.aiData2.copyto( this.aiData3);
    this.aiData1.copyto(this.aiData2);
    this.aiData1.clear();
    this.aiData1.speechAi = new SpeechAiData();


    this.aiData1.scdList = new ScdLsAiData();
    this.aiData1.scdList.desc = datas.desc;
    this.aiData1.scdList.scdTip = datas.scdTip;

    for (let scdEmData of datas.datas) {
      let aiData: ScdAiData = new ScdAiData();
      aiData.ti = scdEmData.ti;
      aiData.d = scdEmData.d;
      aiData.t = scdEmData.t
      aiData.id = scdEmData.id;
      aiData.gs = scdEmData.gs;
      this.aiData1.scdList.datas.push(aiData);
    }

  }

  callbackSpeech(datas: SpeechEmData) {
    this.aiData2.copyto( this.aiData3);
    this.aiData1.copyto(this.aiData2);
    this.aiData1.clear();
    this.aiData1.speechAi = new SpeechAiData();
    this.aiData1.speechAi.org = datas.org;
    this.aiData1.speechAi.an = datas.an;

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
  }

  closePage() {
    this.aiData1 = new AiData();
    this.aiData2 = new AiData();
    this.aiData3 = new AiData();
    this.changeDetectorRef.detectChanges();
  }
}
