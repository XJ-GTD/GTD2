import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {AipService} from "./aip.service";
import {EmitService} from "../../service/util-service/emit.service";
import {UtilService} from "../../service/util-service/util.service";
import {AssistantService} from "../../service/cordova/assistant.service";
import {InputComponent} from "../../components/ai/input/input";
import * as moment from "moment";
import {DataConfig} from "../../service/config/data.config";
import {UserConfig} from "../../service/config/user.config";

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
      <PointComponent [showInput] = "true" (onPonintClick)="listenStart()" [hasPopper]="false" (onInputClick)="inputClick()"></PointComponent>
      <InputComponent #inputComponent></InputComponent>
    </ion-content>
  `,
})

export class AipPage{

  @ViewChild('inputComponent')
  inputComponent: InputComponent;

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

  ionViewDidEnter() {
    // 增加语音界面启动后,自动发出提示语音对话
    // 早上好, 中午好或者晚上好, 用户名
    let words: Map<string, string> = new Map<string, string>();
    words.set("00", "凌晨");
    words.set("01", "凌晨");
    words.set("02", "凌晨");
    words.set("03", "凌晨");
    words.set("04", "凌晨");
    words.set("05", "早上");
    words.set("06", "早上");
    words.set("07", "早上");
    words.set("08", "上午");
    words.set("09", "上午");
    words.set("10", "上午");
    words.set("11", "中午");
    words.set("12", "中午");
    words.set("13", "下午");
    words.set("14", "下午");
    words.set("15", "下午");
    words.set("16", "下午");
    words.set("17", "下午");
    words.set("18", "下午");
    words.set("19", "下午");
    words.set("20", "晚上");
    words.set("21", "晚上");
    words.set("22", "晚上");
    words.set("23", "晚上");

    let preword = words.get(moment().format("HH"));
    let name = UserConfig.user.nickname;

    let welcome: any = {
      header: {
        version: 'V1.1',
        sender: 'xunfei/aiui',
        datetime: moment().format("YYYY/MM/DD HH:mm"),
        describe: []
      },
      content: {}
    };

    if (!DataConfig.hasWelcome) {
      welcome['header']['describe'].push('S');

      welcome['content']['0'] = {
        processor: 'S',
        option: 'S.AN',
        parameters: {
          an: `${name}, ${preword}好, 我是小冥。`
        }
      };

      welcome['header']['describe'].push('S');

      welcome['content']['1'] = {
        processor: 'S',
        option: 'S.P',
        parameters: {
          t: 'HowtoUse'
        }
      };

      DataConfig.hasWelcome = true;
    } else {
      welcome['header']['describe'].push('S');

      welcome['content']['0'] = {
        processor: 'S',
        option: 'S.P',
        parameters: {
          t: 'HowtoUse'
        }
      };
    }

    this.emitService.emit('rabbitmq.message.received', {body: JSON.stringify(welcome)});
  }

  inputClick(){
    this.inputComponent.inputStart();
  }

  listenStart() {
    if (!this.statusListener)
      this.assistantService.listenAudio();
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
