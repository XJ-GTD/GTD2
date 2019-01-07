import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SwPage } from './sw';

@NgModule({
  declarations: [
    SwPage,
  ],
  imports: [
    IonicPageModule.forChild(SwPage),
  ],
})
export class SwPageModule {}
