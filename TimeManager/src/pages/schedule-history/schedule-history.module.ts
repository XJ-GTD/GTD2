import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScheduleHistoryPage } from './schedule-history';

@NgModule({
  declarations: [
    ScheduleHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(ScheduleHistoryPage),
  ],
})
export class ScheduleHistoryPageModule {}
