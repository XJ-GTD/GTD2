import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpeechPage } from './speech';
import { ParamsService } from "../../service/util-service/params.service";
import { XiaojiAssistantService } from "../../service/util-service/xiaoji-assistant.service";
import { XiaojiFeedbackService } from "../../service/util-service/xiaoji-feedback.service";
import {LightSvgPageModule} from "../light-svg/light-svg.module";

@NgModule({
  declarations: [
    SpeechPage,
  ],
  imports: [
    IonicPageModule.forChild(SpeechPage),
    LightSvgPageModule
  ],
  providers: [
    ParamsService,
    XiaojiAssistantService,
    XiaojiFeedbackService
  ],
  entryComponents: [
    SpeechPage,
  ]
})
export class SpeechPageModule {}
