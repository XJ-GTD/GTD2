import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TddjPage } from './tddj';
import {TddiService} from "../tddi/tddi.service";

@NgModule({
  declarations: [
    TddjPage,
  ],
  imports: [
    IonicPageModule.forChild(TddjPage),
  ],
  providers: [
    TddiService,
  ],
})
export class TddjPageModule {}
