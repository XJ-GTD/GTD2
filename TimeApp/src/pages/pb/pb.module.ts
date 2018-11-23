import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PbPage } from './pb';

@NgModule({
  declarations: [
    PbPage,
  ],
  imports: [
    IonicPageModule.forChild(PbPage),
  ],
})
export class PbPageModule {}
