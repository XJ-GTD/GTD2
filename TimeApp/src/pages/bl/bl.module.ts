import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {BlService} from "../bl/bl.service";
import {FdService} from "../fd/fd.service";
import {BlPage} from "./bl";

@NgModule({
  declarations: [
    BlPage,
  ],
  imports: [
    IonicPageModule.forChild(BlPage),
  ],
  providers: [
    BlService,
    FdService,
  ],
})
export class BlPageModule {}
