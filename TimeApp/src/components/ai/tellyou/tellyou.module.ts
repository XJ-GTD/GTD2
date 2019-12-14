import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {TellYouComponent} from "./tellyou";
import {TellyouService} from "./tellyou.service";


@NgModule({
  declarations: [
    TellYouComponent
  ],
  imports: [
    IonicPageModule.forChild(TellYouComponent),
  ],
  exports: [
    TellYouComponent,
  ],
  providers:[
    TellyouService,
  ],

  entryComponents:[
    TellYouComponent
  ],
})
export class TellyouComponentModule {
}
