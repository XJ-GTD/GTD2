import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskPage } from "./task";
import { TaskService } from "./task.service";
import {PageBoxComponentModule} from "../../../components/page-box/page-box.module";
import {CornerBadgeComponentModule} from "../../../components/corner-badge/corner-badge.module";
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    TaskPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(TaskPage),
    PageBoxComponentModule,
    CornerBadgeComponentModule
  ],
  providers: [
    TaskService
  ],
})
export class TaskPageModule {}
