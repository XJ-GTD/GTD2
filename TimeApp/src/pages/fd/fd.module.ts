import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FdPage } from './fd';
import {FdService} from "./fd.service";

@NgModule({
  declarations: [
    FdPage,
  ],
  imports: [
    IonicPageModule.forChild(FdPage),
  ],
  providers: [
    FdService,
  ],
})
export class FdPageModule {}
