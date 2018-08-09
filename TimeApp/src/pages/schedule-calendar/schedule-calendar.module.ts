import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScheduleCalendarPage } from './schedule-calendar';

@NgModule({
  declarations: [
    ScheduleCalendarPage,
  ],
  imports: [
    IonicPageModule.forChild(ScheduleCalendarPage),
  ],
})
export class ScheduleCalendarPageModule {}
