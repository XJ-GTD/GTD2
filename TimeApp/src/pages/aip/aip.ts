import {ChangeDetectorRef, Component, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {AipService} from "./aip.service";
import {EmitService} from "../../service/util-service/emit.service";
import {UtilService} from "../../service/util-service/util.service";
import {AssistantService} from "../../service/cordova/assistant.service";
import {InputComponent} from "../../components/ai/input/input";
import * as moment from "moment";
import {DataConfig} from "../../service/config/data.config";
import {UserConfig} from "../../service/config/user.config";
import {HelpComponent} from "../../components/help/help";

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
          <!--<button ion-button icon-only (click)="showhelp()">-->
            <!--<ion-icon class="fal fa-question-circle" ></ion-icon>-->
          <!--</button>-->
          <button ion-button icon-only (click)="goBack()">
            <ion-icon class="fal fa-times" ></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <!--<BackComponent></BackComponent>-->
      <AiComponent ></AiComponent>
      <HelpComponent *ngIf="showGuide" class="animated fadeIn"></HelpComponent>
      <PointComponent [showInput] = "true" (onPonintClick)="listenStart()" [hasPopper]="false" (onInputClick)="inputClick()"></PointComponent>
      <InputComponent #inputComponent></InputComponent>
    </ion-content>
  `,
})

export class AipPage{

  @ViewChild('inputComponent')
  inputComponent: InputComponent;
  @ViewChild(HelpComponent)
  helpComponent: HelpComponent;
  showGuide:boolean

  statusListener:boolean = false;
  constructor(private aipService: AipService,
              private navController: NavController,
              private emitService: EmitService,
              private utilService: UtilService,
              private assistantService: AssistantService,
              private changeDetectorRef: ChangeDetectorRef,
              private _renderer: Renderer2,
  ) {
    //
    this.emitService.registerListener((b)=>{
      this.statusListener = b;
      if (this.showGuide){
        this._renderer.removeClass(this.helpComponent.elementRef.nativeElement,"fadeIn");
        this._renderer.addClass(this.helpComponent.elementRef.nativeElement,"fadeOut");
        setTimeout(()=>{
          this.showGuide = false;
        },1500);
      }
    });

  }

  ngOnDestroy() {
    // this.tellyouService.unRegeditTellYou();
    // if (this.aiTellYou)
    //   this.aiTellYou.unsubscribe();
  }

  ngOnInit() {
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

    // this.showGuide = DataConfig.hasWelcome;
    this.showGuide = true;

    let preword = words.get(moment().format("HH"));
    let name = UserConfig.user.nickname;
    let guide = UserConfig.getSetting(DataConfig.SYS_SIP);

    // let welcome: any = {
    //   header: {
    //     version: 'V1.1',
    //     sender: 'xunfei/aiui',
    //     datetime: moment().format("YYYY/MM/DD HH:mm"),
    //     describe: []
    //   },
    //   content: {}
    // };
    //
    // if (!DataConfig.hasWelcome) {
    //   welcome['header']['describe'].push('S');
    //
    //   welcome['content']['0'] = {
    //     processor: 'S',
    //     option: 'S.P',
    //     parameters: {
    //       t: "WELCOME"
    //     },
    //     input: {
    //       textvariables: [
    //         {name: 'timewelcome', value: preword},
    //         {name: 'username', value: name}
    //       ]
    //     }
    //   };
    //
    //   if (guide) {
    //     welcome['header']['describe'].push('S');
    //
    //     welcome['content']['1'] = {
    //       processor: 'S',
    //       option: 'S.P',
    //       parameters: {
    //         t: 'HowtoUse'
    //       }
    //     };
    //   }
    //
    //   DataConfig.hasWelcome = true;
    // } else {
    //   if (guide) {
    //     welcome['header']['describe'].push('S');
    //
    //     welcome['content']['0'] = {
    //       processor: 'S',
    //       option: 'S.P',
    //       parameters: {
    //         t: 'HowtoUse'
    //       }
    //     };
    //   }
    // }
    //
    // if (welcome['header']['describe'].length > 0) {
    //   this.emitService.emit('local.message.received', {body: JSON.stringify(welcome)});
    // }
  }

  inputClick(){
    this.inputComponent.inputStart();
    if (this.showGuide){
      this._renderer.removeClass(this.helpComponent.elementRef.nativeElement,"fadeIn");
      this._renderer.addClass(this.helpComponent.elementRef.nativeElement,"fadeOut");
      setTimeout(()=>{
        this.showGuide = false;
      },1500);
    }
  }

  listenStart() {
    if (!this.statusListener)
      this.assistantService.listenAudio();
    else this.assistantService.stopListenAudio();
    if (this.showGuide){
      this._renderer.removeClass(this.helpComponent.elementRef.nativeElement,"fadeIn");
      this._renderer.addClass(this.helpComponent.elementRef.nativeElement,"fadeOut");
      setTimeout(()=>{
        this.showGuide = false;
      },1500);
    }
  }

  goBack() {
    this.navController.pop();
  }

  showhelp(){
    this.showGuide = true;
  }
  //
  // ngOnInit() {
  //   // websocket连接成功消息回调
  //   // this.emitService.register("on.websocket.connected", () => {
  //   //   this.aiready = true;
  //   //   DataConfig.RABBITMQ_STATUS = "connected";
  //   // });
  //   //
  //   // // websocket断开连接消息回调
  //   // this.emitService.register("on.websocket.closed", () => {
  //   //   this.aiready = false;
  //   //   DataConfig.RABBITMQ_STATUS = "";
  //   // });
  //
  // }
}
