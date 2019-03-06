import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlPage } from './pl';
import {PlService} from "./pl.service";

@NgModule({
  declarations: [
    PlPage,
  ],
  imports: [
    IonicPageModule.forChild(PlPage),
  ],
  providers: [
    PlService,
  ],
})
export class PlPageModule {}
