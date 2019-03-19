import {NgModule} from '@angular/core';
import { IonicPageModule} from 'ionic-angular';
import {TdlPage } from './tdl';
import {TdlService} from "./tdl.service";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    TdlPage,
  ],
  imports: [PipesModule,
    IonicPageModule.forChild(TdlPage),
  ],
  providers: [
    TdlService,
  ],
})
export class TdlPageModule {
}
