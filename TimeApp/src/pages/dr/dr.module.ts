import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {DrService} from "../dr/dr.service";
import {SsService} from "../ss/ss.service";
import {DrPage} from "./dr";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    DrPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(DrPage),
  ],
  providers: [
    SsService,
    DrService,
  ],
})
export class DrPageModule {}
