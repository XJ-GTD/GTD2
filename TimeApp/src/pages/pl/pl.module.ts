import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlPage } from './pl';

@NgModule({
  declarations: [
    PlPage,
  ],
  imports: [
    IonicPageModule.forChild(PlPage),
  ],
})
export class PlPageModule {}
