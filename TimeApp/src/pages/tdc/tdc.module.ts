import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TdcPage } from './tdc';
import { ElModule } from 'element-angular'

@NgModule({
  declarations: [
    TdcPage,
  ],
  imports: [
    IonicPageModule.forChild(TdcPage),
    ElModule
  ],
})
export class TdcPageModule {}
