import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FoPage } from './fo';
import {FoService} from "./fo.service";

@NgModule({
  declarations: [
    FoPage,
  ],
  imports: [
    IonicPageModule.forChild(FoPage),
  ],
  providers: [
    FoService,
  ],
})
export class FoPageModule {}
