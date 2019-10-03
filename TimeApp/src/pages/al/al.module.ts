import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {AlPage} from './al';
import {AlService} from "./al.service";
import {BackComponentModule} from "../../components/backComponent/back.module";

@NgModule({
  declarations: [
    AlPage,
  ],
  imports: [
    IonicPageModule.forChild(AlPage),
    BackComponentModule,
  ],
  providers: [
    AlService,
  ]


})
export class AlPageModule {
}
