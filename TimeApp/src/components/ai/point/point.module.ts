import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {PointComponent} from './point';
import {PointService} from "./point.service";
import {InputComponentModule} from "../input/input.module";
import {ListeningComponent} from "./listening";
import { NgxPopper } from 'angular-popper';
import {TellyouComponentModule} from "../tellyou/tellyou.module";


@NgModule({
  declarations: [
    PointComponent,
    ListeningComponent,
  ],
  imports: [
    IonicPageModule.forChild(PointComponent),
    InputComponentModule,
    TellyouComponentModule,
    NgxPopper
  ],
  exports: [
    PointComponent,
    ListeningComponent,
  ],
  providers:[
    PointService,
  ],

  entryComponents:[
    PointComponent,
    ListeningComponent
  ],
})
export class PointComponentModule {
}
