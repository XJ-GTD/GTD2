import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {DrService} from "../dr/dr.service";
import {DrPage} from "./dr";

@NgModule({
  declarations: [
    DrPage,
  ],
  imports: [
    IonicPageModule.forChild(DrPage),
  ],
  providers: [
    DrService,
  ],
})
export class DrPageModule {}
