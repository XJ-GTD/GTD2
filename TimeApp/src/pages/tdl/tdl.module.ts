import {NgModule} from '@angular/core';
import { IonicPageModule} from 'ionic-angular';
import {TdlPage } from './tdl';
import {TdlService} from "./tdl.service";

@NgModule({
  declarations: [
    TdlPage,
  ],
  imports: [
    IonicPageModule.forChild(TdlPage),
  ],
  providers: [
    TdlService,
  ],
})
export class TdlPageModule {
}
