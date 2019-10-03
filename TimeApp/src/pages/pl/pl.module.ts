import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlPage } from './pl';
import {PlService} from "./pl.service";
import {PageBoxComponentModule} from "../../components/page-box/page-box.module";
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
  declarations: [
    PlPage,
  ],
  imports: [
    IonicPageModule.forChild(PlPage),
    PageBoxComponentModule,
    DirectivesModule
  ],
  providers: [
    PlService,
  ],
})
export class PlPageModule {}
