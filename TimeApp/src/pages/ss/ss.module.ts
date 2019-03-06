import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SsPage } from './ss';
import {SsService} from "./ss.service";

@NgModule({
  declarations: [
    SsPage,
  ],
  imports: [
    IonicPageModule.forChild(SsPage),
  ],
  providers: [
    SsService,
  ],
})
export class SsPageModule {}
