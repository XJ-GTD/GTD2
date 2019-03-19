import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {GlPage} from './gl';
import {GlService} from "./gl.service";
import {GcService} from "../gc/gc.service";

@NgModule({
  declarations: [
    GlPage,
  ],
  imports: [
    IonicPageModule.forChild(GlPage),
  ],
  providers:[
    GlService,GcService
  ],
})
export class GlPageModule {}
