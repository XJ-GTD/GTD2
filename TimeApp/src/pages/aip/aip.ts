import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {AipService} from "./aip.service";
import {DataConfig} from "../../service/config/data.config";
import {AiComponent} from "../../components/ai/answer/ai";
import {EmitService} from "../../service/util-service/emit.service";

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
        <ion-buttons left>
          <button ion-button icon-only (click)="goBack()" color="danger">
            <img class="img-header-left" src="./assets/imgs/back-white.png">
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <BackComponent></BackComponent>
      <AiComponent [ready]="aiready" #aiDiv></AiComponent>
    </ion-content>
  `,
})
export class AipPage {
  @ViewChild('aiDiv')
  aiDiv: AiComponent;
  aiready: boolean = true;

  constructor(private aipService: AipService,
              private navController: NavController,
              private emitService: EmitService,
  ) {
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
