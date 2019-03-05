import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LsPage } from './ls';

@NgModule({
  declarations: [
    LsPage,
  ],
  imports: [
    IonicPageModule.forChild(LsPage),
  ],
})
export class LsPageModule {}
