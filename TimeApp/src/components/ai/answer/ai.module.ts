import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HbPage } from './ai';
import { AssistantService } from "../../../service/cordova/assistant.service";
import { FeedbackService } from "../../../service/cordova/feedback.service";
import {AiService} from "./ai.service";

@NgModule({
  declarations: [
    HbPage,
  ],
  imports: [
    IonicPageModule.forChild(HbPage),
  ],
  providers: [
    AssistantService,
    FeedbackService,
    AiService,
  ],
  entryComponents: [
    HbPage,
  ],
})
export class HbPageModule {}
