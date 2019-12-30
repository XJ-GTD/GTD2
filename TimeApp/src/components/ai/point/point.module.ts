import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {PointComponent} from './point';
import {PointService} from "./point.service";
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
    IonicPageModule.forChild(ListeningComponent),
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
})
export class PointComponentModule {
}
