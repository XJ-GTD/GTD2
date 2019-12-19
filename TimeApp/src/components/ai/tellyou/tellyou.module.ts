import { NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {TellYouComponent} from "./tellyou";
import {TellyouService} from "./tellyou.service";
import {PipesModule} from "../../../pipes/pipes.module";


@NgModule({
  declarations: [
    TellYouComponent
  ],
  imports: [
    PipesModule,
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
