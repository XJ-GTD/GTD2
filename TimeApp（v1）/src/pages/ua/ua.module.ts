import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UaPage } from './ua';

@NgModule({
  declarations: [
    UaPage,
  ],
  imports: [
    IonicPageModule.forChild(UaPage),
  ],
})
export class UaPageModule {}
