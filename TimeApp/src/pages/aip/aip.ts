import {ChangeDetectorRef, Component, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {AipService} from "./aip.service";
import {DataConfig} from "../../service/config/data.config";
import {AiComponent} from "../../components/ai/answer/ai";
import {EmitService} from "../../service/util-service/emit.service";
import {UtilService} from "../../service/util-service/util.service";
import {AssistantService} from "../../service/cordova/assistant.service";

/**
 * Generated class for the AlPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-aip',
  template: `
    
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons right>
          <button ion-button icon-only (click)="goBack()">
            <ion-icon class="fal fa-times" ></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <!--<BackComponent></BackComponent>-->
      <AiComponent></AiComponent>
      <PointComponent [showInput] = "true" (onPonintClick)="listenStart()" [hasPopper]="false"></PointComponent>
    </ion-content>
  `,
})

export class AipPage{

  statusListener:boolean = false;
  constructor(private aipService: AipService,
              private navController: NavController,
              private emitService: EmitService,
              private utilService: UtilService,
              private assistantService: AssistantService,
              private changeDetectorRef: ChangeDetectorRef,
  ) {
    //
    this.assistantService.startWakeUp();
    this.emitService.registerListener((b)=>{
      this.statusListener = b;
    });

  }


  listenStart() {
    if (!this.statusListener) this.assistantService.listenAudio().then(data=>{
      this.emitService.emitImmediately("");
      this.changeDetectorRef.detectChanges();
    })
    else this.assistantService.stopListenAudio();
  }

  goBack() {
    this.navController.pop();
  }

  ngOnInit() {
    // websocket连接成功消息回调
    // this.emitService.register("on.websocket.connected", () => {
    //   this.aiready = true;
    //   DataConfig.RABBITMQ_STATUS = "connected";
    // });
    //
    // // websocket断开连接消息回调
    // this.emitService.register("on.websocket.closed", () => {
    //   this.aiready = false;
    //   DataConfig.RABBITMQ_STATUS = "";
    // });

  }
}
