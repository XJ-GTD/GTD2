import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HPage} from './h';
import {CalendarModule} from "../../components/ion2-calendar";
import {HService} from "./h.service";
import {BackComponentModule} from "../../components/backComponent/back.module";
import {AiComponentModule} from "../../components/ai/answer/ai.module";
import { InAppBrowser } from '@ionic-native/in-app-browser';

@NgModule({
  declarations: [
    HPage,
  ],
  imports: [
    IonicPageModule.forChild(HPage),
    CalendarModule,
    BackComponentModule,
    AiComponentModule,
  ],
  entryComponents: [
    HPage
  ],
  providers:[
    HService,
    InAppBrowser
  ],
})
export class HPageModule {
}
