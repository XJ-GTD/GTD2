import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScheduleGroupListPage } from './schedule-group-list';

@NgModule({
  declarations: [
    ScheduleGroupListPage,
  ],
  imports: [
    IonicPageModule.forChild(ScheduleGroupListPage),
  ],
})
export class ScheduleGroupListPageModule {}
