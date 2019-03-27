import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlaPage } from './pla';
import {PlService} from "../pl/pl.service";

@NgModule({
  declarations: [
    PlaPage,
  ],
  imports: [
    IonicPageModule.forChild(PlaPage),
  ],
  providers: [
    PlService,
  ]
})
export class PlaPageModule {}
