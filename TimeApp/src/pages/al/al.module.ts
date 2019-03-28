import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {AlPage} from './al';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import {AlService} from "./al.service";
import {BackComponentModule} from "../../components/backComponent/back.module";

@NgModule({
  declarations: [
    AlPage,
  ],
  imports: [
    IonicPageModule.forChild(AlPage),
    RoundProgressModule,
    BackComponentModule
  ],
  providers: [
    AlService,
  ]


})
export class AlPageModule {
}
