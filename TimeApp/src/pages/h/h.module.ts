import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HPage} from './h';
import {CalendarModule} from "../../components/ion2-calendar";
import {HService} from "./h.service";
import {BackComponentModule} from "../../components/backComponent/back.module";
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { TdlPageModule } from '../tdl/tdl.module';
import {TestDataService} from "../../service/testData.service";
@NgModule({
  declarations: [
    HPage,
  ],
  imports: [
    IonicPageModule,
    CalendarModule,
    BackComponentModule,
    TdlPageModule
  ],
  entryComponents: [
    HPage
  ],
  providers:[
    HService,
    InAppBrowser,
    TestDataService
  ],
})
export class HPageModule {
}
