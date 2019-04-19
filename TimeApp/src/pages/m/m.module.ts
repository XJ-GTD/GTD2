import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MPage} from './m';
import {TdlPageModule} from "../tdl/tdl.module";
import {BackComponentModule} from "../../components/backComponent/back.module";

@NgModule({
  declarations: [
    MPage,
  ],
  imports: [
    IonicPageModule.forChild(MPage),
    TdlPageModule,
    BackComponentModule
  ],
  entryComponents: [
    MPage,
  ],
})
export class MPageModule {
}
