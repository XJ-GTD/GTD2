import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HPage} from './h';
import {CalendarModule} from "../../components/ion2-calendar";
import {HService} from "./h.service";
import {BackComponentModule} from "../../components/backComponent/back.module";

import { TdlPageModule } from '../tdl/tdl.module';
import {TestDataService} from "../../service/testData.service";
import {PlusModal} from "./plusModal";
import {PointComponentModule} from "../../components/ai/point/point.module";
@NgModule({
  declarations: [
    HPage,
    PlusModal
  ],
  imports: [
    IonicPageModule,
    CalendarModule,
    BackComponentModule,
    TdlPageModule,
    PointComponentModule,
  ],
  entryComponents: [
    HPage,
    PlusModal
  ],
  providers:[
    HService,
    TestDataService
  ],
})
export class HPageModule {
}
