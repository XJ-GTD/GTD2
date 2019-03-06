import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaPage } from './pa';

@NgModule({
  declarations: [
    PaPage,
  ],
  imports: [
    IonicPageModule.forChild(PaPage),
  ],
})
export class PaPageModule {}
