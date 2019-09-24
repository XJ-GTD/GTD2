import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoPage } from "./do";
import { DoScrumPage } from "./do.scrum";
import { DoService } from "./do.service";
import {TaskListComponentModule} from "../../components/task-list/task-list.module";
import {PageBoxComponentModule} from "../../components/page-box/page-box.module";

@NgModule({
  declarations: [
    DoPage,
    DoScrumPage
  ],
  imports: [
    IonicPageModule,
    TaskListComponentModule,
    PageBoxComponentModule
  ],
  providers: [
    DoService
  ],
  entryComponents:[
    DoPage,
    DoScrumPage
  ],
  exports:[
    DoPage,
    DoScrumPage
  ]
})
export class DoPageModule {}
