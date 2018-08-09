import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScheduleDetailPage } from './schedule-detail';

@NgModule({
  declarations: [
    ScheduleDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ScheduleDetailPage),
  ],
})
export class ScheduleDetailPageModule {}
