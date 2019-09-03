import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoPage } from "./do";
import { DoService } from "./do.service";
import {TaskListComponentModule} from "../../components/task-list/task-list.module";
import {PageBoxComponentModule} from "../../components/page-box/page-box.module";

@NgModule({
  declarations: [
    DoPage,
  ],
  imports: [
    IonicPageModule.forChild(DoPage),
    TaskListComponentModule,
    PageBoxComponentModule
  ],
  providers: [
    DoService
  ],
})
export class DoPageModule {}
