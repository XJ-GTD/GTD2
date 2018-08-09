import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScheduleEditPage } from './schedule-edit';

@NgModule({
  declarations: [
    ScheduleEditPage,
  ],
  imports: [
    IonicPageModule.forChild(ScheduleEditPage),
  ],
})
export class ScheduleEditPageModule {}
