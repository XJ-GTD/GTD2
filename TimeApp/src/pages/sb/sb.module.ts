import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SbPage } from './sb';

@NgModule({
  declarations: [
    SbPage,
  ],
  imports: [
    IonicPageModule.forChild(SbPage),
  ],
})
export class SbPageModule {}
