import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LpPage } from './lp';

@NgModule({
  declarations: [
    LpPage,
  ],
  imports: [
    IonicPageModule.forChild(LpPage),
  ],
})
export class LpPageModule {}
