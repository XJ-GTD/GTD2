import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LsPage } from './ls';
import {LsService} from "./ls.service";
import {BrService} from "../br/br.service";

@NgModule({
  declarations: [
    LsPage,
  ],
  imports: [
    IonicPageModule.forChild(LsPage),
  ],
  providers: [
    LsService,
    BrService,
  ],
})
export class LsPageModule {}
