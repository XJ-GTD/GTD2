import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PsPage } from './ps';
import {PsService} from "./ps.service";

@NgModule({
  declarations: [
    PsPage,
  ],
  imports: [
    IonicPageModule.forChild(PsPage),
  ],
  providers: [
    PsService,
  ],
})
export class PsPageModule {}
