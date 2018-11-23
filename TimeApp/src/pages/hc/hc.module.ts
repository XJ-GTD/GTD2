import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HcPage } from './hc';

@NgModule({
  declarations: [
    HcPage,
  ],
  imports: [
    IonicPageModule.forChild(HcPage),
  ],
})
export class HcPageModule {}
