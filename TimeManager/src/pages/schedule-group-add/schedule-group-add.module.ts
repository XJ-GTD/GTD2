import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScheduleGroupAddPage } from './schedule-group-add';

@NgModule({
  declarations: [
    ScheduleGroupAddPage,
  ],
  imports: [
    IonicPageModule.forChild(ScheduleGroupAddPage),
  ],
})
export class ScheduleGroupAddPageModule {}
