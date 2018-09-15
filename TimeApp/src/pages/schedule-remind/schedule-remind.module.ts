import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScheduleRemindPage } from './schedule-remind';

@NgModule({
  declarations: [
    ScheduleRemindPage,
  ],
  imports: [
    IonicPageModule.forChild(ScheduleRemindPage),
  ],
  entryComponents: [
    ScheduleRemindPage,
  ]
})
export class ScheduleRemindPageModule {}
