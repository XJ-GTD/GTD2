import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlPage } from './bl';
import {BlService} from "../bl/bl.service";

@NgModule({
  declarations: [
    BlPage,
  ],
  imports: [
    IonicPageModule.forChild(BlPage),
  ],
  providers: [
    BlService,
  ],
})
export class BlPageModule {}
