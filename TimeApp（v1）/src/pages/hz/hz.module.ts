import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HzPage } from './hz';
import { CalendarModule } from "../../components/ion2-calendar";

@NgModule({
  declarations: [
    HzPage,
  ],
  imports: [
    IonicPageModule.forChild(HzPage),
    CalendarModule
  ],
  entryComponents: [
    HzPage,
  ]
})
export class HzPageModule {}
