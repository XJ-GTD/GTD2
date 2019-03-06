import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LpPage } from './lp';
import {LpService} from "./lp.service";

@NgModule({
  declarations: [
    LpPage,
  ],
  imports: [
    IonicPageModule.forChild(LpPage),
  ],
  providers:[
    LpService,
  ],
})
export class LpPageModule {}
