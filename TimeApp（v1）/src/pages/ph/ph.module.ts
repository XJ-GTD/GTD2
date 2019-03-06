import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhPage } from './ph';

@NgModule({
  declarations: [
    PhPage,
  ],
  imports: [
    IonicPageModule.forChild(PhPage),
  ],
})
export class PhPageModule {}
