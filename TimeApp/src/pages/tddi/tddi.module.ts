import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TddiPage } from './tddi';

@NgModule({
  declarations: [
    TddiPage,
  ],
  imports: [
    IonicPageModule.forChild(TddiPage),
  ],
  entryComponents: [
    TddiPage,
  ]
})
export class TddiPageModule {}
