import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RPage } from './r';
import {RService} from "./r.service";
import {BrService} from "../br/br.service";

@NgModule({
  declarations: [
    RPage,
  ],
  imports: [
    IonicPageModule.forChild(RPage),
  ],
  providers: [
    RService
  ],
})
export class RPageModule {}
