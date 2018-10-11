import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpeechPage } from './speech';
import { ParamsService } from "../../service/params.service";
import { XiaojiAssistantService } from "../../service/xiaoji-assistant.service";

@NgModule({
  declarations: [
    SpeechPage,
  ],
  imports: [
    IonicPageModule.forChild(SpeechPage),

  ],
  providers: [
    ParamsService,
    XiaojiAssistantService
  ],
  entryComponents: [
    SpeechPage,
  ]
})
export class SpeechPageModule {}
