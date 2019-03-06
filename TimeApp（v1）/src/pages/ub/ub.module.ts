import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UbPage } from './ub';

@NgModule({
  declarations: [
    UbPage,
  ],
  imports: [
    IonicPageModule.forChild(UbPage),
  ],
})
export class UbPageModule {}
