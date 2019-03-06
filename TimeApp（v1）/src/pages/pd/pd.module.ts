import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PdPage } from './pd';

@NgModule({
  declarations: [
    PdPage,
  ],
  imports: [
    IonicPageModule.forChild(PdPage),
  ],
})
export class PdPageModule {}
