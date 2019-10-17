import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoPage } from "./do";
import { DoService } from "./do.service";
import {TaskListComponentModule} from "../../components/task-list/task-list.module";
import {PageBoxComponentModule} from "../../components/page-box/page-box.module";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    DoPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule,
    TaskListComponentModule,
    PageBoxComponentModule
  ],
  providers: [
    DoService
  ],
  entryComponents:[
    DoPage,
  ],
  exports:[
    DoPage,
  ]
})
export class DoPageModule {}
