import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HPage} from './h';
import {CalendarModule} from "../../components/ion2-calendar";
import {TdlPageModule} from "../tdl/tdl.module";

@NgModule({
  declarations: [
    HPage,
  ],
  imports: [
    IonicPageModule.forChild(HPage),
    CalendarModule,
    TdlPageModule
  ],
  entryComponents: [
    HPage
  ]
})
export class HPageModule {
}
