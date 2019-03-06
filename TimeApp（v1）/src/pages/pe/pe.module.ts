import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PePage } from './pe';

@NgModule({
  declarations: [
    PePage,
  ],
  imports: [
    IonicPageModule.forChild(PePage),
  ],
})
export class PePageModule {}
