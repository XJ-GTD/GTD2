import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScheduleAddPage } from './schedule-add';

@NgModule({
  declarations: [
    ScheduleAddPage,
  ],
  imports: [
    IonicPageModule.forChild(ScheduleAddPage),
  ],
})
export class ScheduleAddPageModule {}
