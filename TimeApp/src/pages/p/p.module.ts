import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PPage } from './p';
import {PService} from "./p.service";

@NgModule({
  declarations: [
    PPage,
  ],
  imports: [
    IonicPageModule.forChild(PPage),
  ],
  providers: [
    PService,
  ],
})
export class PPageModule {}
