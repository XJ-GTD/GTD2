import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LsPage } from './ls';
import {LsService} from "./ls.service";

@NgModule({
  declarations: [
    LsPage,
  ],
  imports: [
    IonicPageModule.forChild(LsPage),
  ],
  providers: [
    LsService,
  ],
})
export class LsPageModule {}
