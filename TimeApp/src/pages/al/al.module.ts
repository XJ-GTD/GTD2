import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {AlPage} from './al';
import {AlService} from "./al.service";
import {BackComponentModule} from "../../components/backComponent/back.module";
import {TdcPageModule} from "../tdc/tdc.module";

@NgModule({
  declarations: [
    AlPage,
  ],
  imports: [
    IonicPageModule.forChild(AlPage),
    BackComponentModule,
    TdcPageModule,
  ],
  providers: [
    AlService,
  ]


})
export class AlPageModule {
}
