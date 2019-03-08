import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {AlPage} from './al';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import {AlService} from "./al.service";

@NgModule({
  declarations: [
    AlPage,
  ],
  imports: [
    IonicPageModule.forChild(AlPage),
    RoundProgressModule
  ],
  providers: [
    AlService,
  ]


})
export class AlPageModule {
}
