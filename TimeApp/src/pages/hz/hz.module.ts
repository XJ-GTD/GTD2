import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HzPage } from './hz';

@NgModule({
  declarations: [
    HzPage,
  ],
  imports: [
    IonicPageModule.forChild(HzPage),
  ],
})
export class HzPageModule {}
