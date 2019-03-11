import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HbPage } from './ai';
import { ParamsService } from "../../../service/util-service/params.service";
import { XiaojiAssistantService } from "../../../service/cordova/assistant.service";
import { XiaojiFeedbackService } from "../../../service/cordova/feedback.service";
import {AiService} from "./ai.service";

@NgModule({
  declarations: [
    HbPage,
  ],
  imports: [
    IonicPageModule.forChild(HbPage),
  ],
  providers: [
    ParamsService,
    XiaojiAssistantService,
    XiaojiFeedbackService,
    AiService,
  ],
  entryComponents: [
    HbPage,
  ],
})
export class HbPageModule {}
