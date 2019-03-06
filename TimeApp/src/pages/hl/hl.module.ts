import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HlPage } from './hl';
import {HlService} from "./hl.service";

@NgModule({
  declarations: [
    HlPage,
  ],
  imports: [
    IonicPageModule.forChild(HlPage),
  ],
  providers:[
    HlService,
  ],
})
export class HlPageModule {}
