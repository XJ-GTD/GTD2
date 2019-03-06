import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PdPage } from './pd';
import {PdService} from "./pd.service";

@NgModule({
  declarations: [
    PdPage,
  ],
  imports: [
    IonicPageModule.forChild(PdPage),
  ],
  providers: [
    PdService,
  ],
})
export class PdPageModule {}
