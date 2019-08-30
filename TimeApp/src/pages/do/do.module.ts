import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoPage } from "./do";
import { DoService } from "./do.service";
import {TaskListComponentModule} from "../../components/task-list/task-list.module";

@NgModule({
  declarations: [
    DoPage,
  ],
  imports: [
    IonicPageModule.forChild(DoPage),
    TaskListComponentModule
  ],
  providers: [
    DoService
  ],
})
export class DoPageModule {}
