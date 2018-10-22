import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScheduleAddPage } from './schedule-add';
import {ParamsService} from "../../service/params.service";

@NgModule({
  declarations: [
    ScheduleAddPage,
  ],
  imports: [
    IonicPageModule.forChild(ScheduleAddPage),
  ],
  providers:[ParamsService]
})
export class ScheduleAddPageModule {}
