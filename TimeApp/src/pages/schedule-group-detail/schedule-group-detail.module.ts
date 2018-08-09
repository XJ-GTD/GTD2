import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScheduleGroupDetailPage } from './schedule-group-detail';

@NgModule({
  declarations: [
    ScheduleGroupDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ScheduleGroupDetailPage),
  ],
})
export class ScheduleGroupDetailPageModule {}
