import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScheduleGroupPage } from './schedule-group';

@NgModule({
  declarations: [
    ScheduleGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(ScheduleGroupPage),
  ],
})
export class ScheduleGroupPageModule {}
