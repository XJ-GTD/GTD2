import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlPage } from './al';
import {RoundProgressModule} from 'angular-svg-round-progressbar';

@NgModule({
  declarations: [
    AlPage,
  ],
  imports: [
    IonicPageModule.forChild(AlPage),
    RoundProgressModule
  ],
})
export class AlPageModule {}
