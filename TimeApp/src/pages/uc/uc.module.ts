import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UcPage } from './uc';

@NgModule({
  declarations: [
    UcPage,
  ],
  imports: [
    IonicPageModule.forChild(UcPage),
  ],
})
export class UcPageModule {}
