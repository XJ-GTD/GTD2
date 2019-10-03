import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {GlPage} from './gl';
import {GlService} from "./gl.service";
import {GcService} from "../gc/gc.service";
import {PageBoxComponentModule} from "../../components/page-box/page-box.module";
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
  declarations: [
    GlPage,
  ],
  imports: [
    IonicPageModule.forChild(GlPage),
    PageBoxComponentModule,DirectivesModule

  ],
  providers:[
    GlService,GcService
  ],
})
export class GlPageModule {}
