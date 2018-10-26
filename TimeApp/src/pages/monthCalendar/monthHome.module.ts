import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MonthHome } from './monthHome';
import { CalendarModule } from "../../components/ion2-calendar/calendar.module";

@NgModule({
  declarations: [
    MonthHome,
  ],
  imports: [
    IonicPageModule.forChild(MonthHome),
    CalendarModule
  ],
  entryComponents: [
    MonthHome
    ]
})
export class MonthHomePageModule {}
