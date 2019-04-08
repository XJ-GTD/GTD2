import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MPage} from './m';
import {TdlPageModule} from "../tdl/tdl.module";

@NgModule({
  declarations: [
    MPage,
  ],
  imports: [
    IonicPageModule.forChild(MPage),
    TdlPageModule
  ],
  entryComponents: [
    MPage,
  ],
})
export class MPageModule {
}
