import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HaPage} from './ha';
import {CalendarModule} from "../../components/ion2-calendar";
import {TdlPageModule} from "../tdl/tdl.module";

@NgModule({
  declarations: [
    HaPage,
  ],
  imports: [
    IonicPageModule.forChild(HaPage),
    CalendarModule,
    TdlPageModule
  ],
  entryComponents: [
    HaPage
  ]
})
export class HaPageModule {
}
