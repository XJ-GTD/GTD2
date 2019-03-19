import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GcPage } from './gc';
import {GcService} from "./gc.service";
import {FsService} from "../fs/fs.service";

@NgModule({
  declarations: [
    GcPage,
  ],
  imports: [
    IonicPageModule.forChild(GcPage),
  ],
  providers: [
    GcService,FsService
  ],
})
export class GcPageModule {}
