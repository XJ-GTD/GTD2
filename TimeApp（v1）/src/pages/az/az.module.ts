import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AzPage } from './az';

@NgModule({
  declarations: [
    AzPage,
  ],
  imports: [
    IonicPageModule.forChild(AzPage),
  ],
})
export class AzPageModule {}
