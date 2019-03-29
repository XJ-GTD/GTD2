import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TdcPage } from './tdc';
import {TdcService} from "./tdc.service";

@NgModule({
  declarations: [
    TdcPage,
  ],
  imports: [
    IonicPageModule.forChild(TdcPage),
  ],
  providers: [
    TdcService,
  ],
})
export class TdcPageModule {}
