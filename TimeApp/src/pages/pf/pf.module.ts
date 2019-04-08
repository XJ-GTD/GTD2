import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PfPage } from './pf';
import {PfService} from "./pf.service";

@NgModule({
  declarations: [
    PfPage,
  ],
  imports: [
    IonicPageModule.forChild(PfPage),
  ],
  providers:[
    PfService,
  ]
})
export class PfPageModule {}
