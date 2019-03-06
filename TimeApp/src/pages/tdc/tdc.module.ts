import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TdcPage } from './tdc';
import { ElModule } from 'element-angular'
import {TdcService} from "./tdc.service";

@NgModule({
  declarations: [
    TdcPage,
  ],
  imports: [
    IonicPageModule.forChild(TdcPage),
    ElModule
  ],
  providers: [
    TdcService,
  ],
})
export class TdcPageModule {}
