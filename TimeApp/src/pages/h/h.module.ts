import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HPage} from './h';
import {CalendarModule} from "../../components/ion2-calendar";
import {HService} from "./h.service";
import {BackComponentModule} from "../../components/backComponent/back.module";
import {AiComponentModule} from "../../components/ai/answer/ai.module";

@NgModule({
  declarations: [
    HPage,
  ],
  imports: [
    IonicPageModule.forChild(HPage),
    CalendarModule,
    BackComponentModule,
    AiComponentModule
  ],
  entryComponents: [
    HPage
  ],
  providers:[
    HService,
  ],
})
export class HPageModule {
}
