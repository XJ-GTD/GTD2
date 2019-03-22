import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GaPage } from './ga';
import {GcService} from "../gc/gc.service";

@NgModule({
  declarations: [
    GaPage,
  ],
  imports: [
    IonicPageModule.forChild(GaPage),
  ],
  providers:[GcService
  ],
})
export class GaPageModule {}
