import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AcPage } from './ac';

@NgModule({
  declarations: [
    AcPage,
  ],
  imports: [
    IonicPageModule.forChild(AcPage),
  ],
})
export class AcPageModule {}
