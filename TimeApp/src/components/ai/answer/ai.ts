import {ChangeDetectorRef, Component, ElementRef, Input, Output, Renderer2, ViewChild} from '@angular/core';
import {Card, IonicPage} from 'ionic-angular';
import {AiData, AiService, FriendAiData, ScdAiData, ScdLsAiData, SpeechAiData} from "./ai.service";
import {UtilService} from "../../../service/util-service/util.service";
import {
  EmitService,
  ScdEmData,
  ScdLsEmData,
  SpeechEmData
} from "../../../service/util-service/emit.service";
import {Subscriber} from "rxjs";
import BScroll from "better-scroll";

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
    <div class="aiscroll">
      <div class="aiWarp">
        <ion-card class="card" #card5 *ngIf="aiData5">
          <AiChildenComponent [aiData]="aiData5"></AiChildenComponent>
        </ion-card>
        <ion-card class="card" #card4 *ngIf="aiData4">
          <AiChildenComponent [aiData]="aiData4"></AiChildenComponent>
        </ion-card>
        <ion-card class="card" #card3 *ngIf="aiData3">
          <AiChildenComponent [aiData]="aiData3"></AiChildenComponent>
        </ion-card>
        <ion-card class="card" #card2 *ngIf="aiData2">
          <AiChildenComponent [aiData]="aiData2"></AiChildenComponent>
        </ion-card>
        <ion-card class="card" #card1 *ngIf="aiData1" id="card1">
          <AiChildenComponent [aiData]="aiData1"></AiChildenComponent>
        </ion-card>
      </div>
    </div>
  `,
})
export class AiComponent {

  @ViewChild("card1") card1: ElementRef;
  aiData1: AiData = new AiData();
  aiData2: AiData = new AiData();
  aiData3: AiData = new AiData();
  aiData4: AiData = new AiData();
  aiData5: AiData = new AiData();

  scdLsemit: Subscriber<any>;
  speechemit: Subscriber<any>;
  scdemit: Subscriber<any>;
  waitemit: Subscriber<any>;

  bScroll: BScroll | any;

  constructor(private aiService: AiService,
              private _renderer: Renderer2,
              private util: UtilService,
              private emitService: EmitService,
              private el: ElementRef,
              private changeDetectorRef: ChangeDetectorRef) {

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
    this.scdemit = this.emitService.registerScd(data => {
      this.callbackScd(data);
      this.changeDetectorRef.detectChanges();
    });
    this.waitemit = this.emitService.registerSpeechWaiting(data => {
      this.callbackWaiting(data);
      this.changeDetectorRef.detectChanges();
    });

    this.bScroll = new BScroll('.aiscroll', {
      click: true,
      scrollY: true

    });
    this._renderer.setStyle(this.card1.nativeElement, "min-height", (this.bScroll.wrapperHeight - 40) + "px");

  }


  ngOnDestroy() {
    this.scdLsemit.unsubscribe();
    this.speechemit.unsubscribe();
    this.scdemit.unsubscribe();
    this.waitemit.unsubscribe();
  }


  callbackScdLs(datas: ScdLsEmData) {
    this.copy(false);
    // this.copy(false);
    // this.aiData1.speechAi = new SpeechAiData();


    this.aiData1.scdList = new ScdLsAiData();
    this.aiData1.scdList.desc = datas.desc;

    for (let scdEmData of datas.datas) {
      let aiData: ScdAiData = new ScdAiData();
      aiData.ti = scdEmData.ti;
      aiData.d = scdEmData.d;
      aiData.t = scdEmData.t;
      aiData.type = scdEmData.type;
      aiData.id = scdEmData.id;
      aiData.gs = scdEmData.gs;
      aiData.adr = scdEmData.adr;
      this.aiData1.scdList.datas.push(aiData);
    }
    this.changeDetectorRef.detectChanges();
    this.gotonew();

  }

  callbackSpeech(datas: SpeechEmData) {
    this.copy(false);
    // this.copy(datas.iswaitting?true:false);
    this.aiData1.speechAi.org = datas.org;
    this.aiData1.speechAi.an = datas.an;
    if (datas.tips) {
      this.aiData1.speechAi.arraytips = datas.tips.split("|");
    }
    this.gotonew();

  }

  gotonew() {
    setTimeout(() => {
      this.bScroll.scrollToElement(this.card1.nativeElement, 280, 0, 0);
    }, 200)
  }

  callbackScd(data: ScdEmData) {
    this.copy(false);
    let aiData: ScdAiData = new ScdAiData();
    aiData.ti = data.ti;
    aiData.d = data.d;
    aiData.t = data.t;
    aiData.type = data.type;
    aiData.id = data.id;
    aiData.gs = data.gs;
    aiData.adr = data.adr;

    for (let femd of  data.updatefriends) {
      let ff: FriendAiData = new FriendAiData();
      ff.m = femd.m;
      ff.id = femd.id;
      ff.a = femd.a;
      ff.n = femd.n;
      ff.p = femd.p;
      ff.uid = femd.uid;
      aiData.friends.push(femd);

    }

    for (let femd of  data.friends) {
      let ff: FriendAiData = new FriendAiData();
      ff.m = femd.m;
      ff.id = femd.id;
      ff.a = femd.a;
      ff.n = femd.n;
      ff.p = femd.p;
      ff.uid = femd.uid;
      aiData.showfriends.push(femd);

    }

    this.aiData1.scd = aiData;
    this.gotonew();
  }


  callbackWaiting(waiting:boolean) {
    this.copy(waiting);

    this.changeDetectorRef.detectChanges();
    this.gotonew();
  }

  closePage() {
    this.aiData1 = new AiData();
    this.aiData2 = new AiData();
    this.aiData3 = new AiData();
    this.aiData4 = new AiData();
    this.aiData5 = new AiData();
    this.changeDetectorRef.detectChanges();
  }

  copy(iswaiting:boolean) {
    if (iswaiting){
       this.aiData4.copyto(this.aiData5);
       this.aiData3.copyto(this.aiData4);
       this.aiData2.copyto(this.aiData3);
       this.aiData1.copyto(this.aiData2);

      this.aiData1 = new AiData();
      this.aiData1.speechAi = new SpeechAiData();
      this.aiData1.speechAi.iswaitting = true;
    }else{
      this.aiData1.speechAi.iswaitting = false;
      this.aiData1.showTip = true;
      this.aiData1.showHelp = true;
    }
  }
}
