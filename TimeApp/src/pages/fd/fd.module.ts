import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FdPage } from './fd';

@NgModule({
  declarations: [
    FdPage,
  ],
  imports: [
    IonicPageModule.forChild(FdPage),
  ],
})
export class FdPageModule {}
