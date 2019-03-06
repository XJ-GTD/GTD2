import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PcPage } from './pc';

@NgModule({
  declarations: [
    PcPage,
  ],
  imports: [
    IonicPageModule.forChild(PcPage),
  ],
})
export class PcPageModule {}
