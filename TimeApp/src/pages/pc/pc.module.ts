import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PcPage } from './pc';
import {PcService} from "./pc.service";

@NgModule({
  declarations: [
    PcPage,
  ],
  imports: [
    IonicPageModule.forChild(PcPage),
  ],
  providers: [
    PcService,
  ],
})
export class PcPageModule {}
