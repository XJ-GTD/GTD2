import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PPage } from './p';

@NgModule({
  declarations: [
    PPage,
  ],
  imports: [
    IonicPageModule.forChild(PPage),
  ],
})
export class PPageModule {}
