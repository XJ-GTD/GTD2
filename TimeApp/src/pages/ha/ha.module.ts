import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HaPage } from './ha';
import {SuperTabsController, SuperTabsModule} from "../../components/ionic2-super-tabs";
import {CalendarModule} from "../../components/ion2-calendar";
import {Hb01PageModule} from "../hb01/hb01.module";
import {Ha01PageModule} from "../ha01/ha01.module";

@NgModule({
  declarations: [
    HaPage,
  ],
  imports: [
    IonicPageModule.forChild(HaPage),
    CalendarModule,
    SuperTabsModule,
    Hb01PageModule,
    Ha01PageModule
  ],
  entryComponents: [
    HaPage
  ],
  providers:[
    SuperTabsController
  ]
})
export class HaPageModule {}
