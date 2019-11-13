import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {TaskListComponentModule} from "../../components/task-list/task-list.module";
import {PageBoxComponentModule} from "../../components/page-box/page-box.module";
import {PipesModule} from "../../pipes/pipes.module";
import {AtmePage} from "./atme";
import {AtmeService} from "./atme.service";

@NgModule({
  declarations: [
    AtmePage,
  ],
  imports: [
    PipesModule,
    IonicPageModule,
    TaskListComponentModule,
    PageBoxComponentModule
  ],
  providers: [
    AtmeService
  ],
  entryComponents:[
    AtmePage,
  ],
  exports:[
    AtmePage,
  ]
})
export class AtmePageModule {}
