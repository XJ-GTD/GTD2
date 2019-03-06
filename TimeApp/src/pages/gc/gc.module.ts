import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GcPage } from './gc';

@NgModule({
  declarations: [
    GcPage,
  ],
  imports: [
    IonicPageModule.forChild(GcPage),
  ],
})
export class GcPageModule {}
