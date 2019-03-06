import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BrPage } from './br';
import {BrService} from "./br.service";

@NgModule({
  declarations: [
    BrPage,
  ],
  imports: [
    IonicPageModule.forChild(BrPage),
  ],
  providers: [
    BrService,
  ],
})
export class BrPageModule {}
