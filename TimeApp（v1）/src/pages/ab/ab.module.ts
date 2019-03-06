import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AbPage } from './ab';

@NgModule({
  declarations: [
    AbPage,
  ],
  imports: [
    IonicPageModule.forChild(AbPage),
  ],
})
export class AbPageModule {}
