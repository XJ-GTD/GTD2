import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlPage } from './bl';
import {BlService} from "../bl/bl.service";
import {FdService} from "../fd/fd.service";

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
