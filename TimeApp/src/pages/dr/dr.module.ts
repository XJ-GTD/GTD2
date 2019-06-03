import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {DrService} from "../dr/dr.service";
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
    DrService,
  ],
})
export class DrPageModule {}
