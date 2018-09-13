import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScheduleListPage } from './schedule-list';

@NgModule({
  declarations: [
    ScheduleListPage,
  ],
  imports: [
    IonicPageModule.forChild(ScheduleListPage),
  ],
})
export class ScheduleListPageModule {}
