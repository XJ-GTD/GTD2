import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MPage} from './m';
import {PointComponentModule} from "../../components/ai/point/point.module";

@NgModule({
  declarations: [
    MPage,
  ],
  imports: [
    IonicPageModule.forChild(MPage),
    PointComponentModule,
  ],
  entryComponents: [
    MPage,
  ],
})
export class MPageModule {
}
