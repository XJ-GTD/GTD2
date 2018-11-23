import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HaPage } from './ha';

@NgModule({
  declarations: [
    HaPage,
  ],
  imports: [
    IonicPageModule.forChild(HaPage),
  ],
})
export class HaPageModule {}
