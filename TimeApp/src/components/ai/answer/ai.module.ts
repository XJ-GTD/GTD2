import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AiComponent } from './ai';
import { AssistantService } from "../../../service/cordova/assistant.service";
import { FeedbackService } from "../../../service/cordova/feedback.service";
import {AiService} from "./ai.service";

@NgModule({
  declarations: [
    AiComponent,
  ],
  imports: [
    IonicPageModule.forChild(AiComponent),
  ],
  providers: [
    AssistantService,
    FeedbackService,
    AiService,
  ],
  entryComponents: [
    AiComponent,
  ],
})
export class HbPageModule {}
