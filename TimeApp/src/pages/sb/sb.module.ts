import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SbPage } from './sb';
import {ParamsService} from "../../service/util-service/params.service";

@NgModule({
  declarations: [
    SbPage,
  ],
  imports: [
    IonicPageModule.forChild(SbPage),
  ],
  providers:[ParamsService]
})
export class SbPageModule {}
