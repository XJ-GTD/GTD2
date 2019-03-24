import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {PointComponent} from './point';
import {PointService} from "./point.service";
import {InputComponentModule} from "../input/input.module";


@NgModule({
  declarations: [
    PointComponent,
  ],
  imports: [
    IonicPageModule.forChild(PointComponent),
    InputComponentModule
  ],
  exports: [
    PointComponent,
  ],
  providers:[
    PointService,
  ],

  entryComponents:[
    PointComponent
  ],
})
export class PointComponentModule {
}
