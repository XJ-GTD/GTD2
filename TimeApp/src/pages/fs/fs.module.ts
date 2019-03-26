import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FsPage } from './fs';
import {FsService} from "./fs.service";
import {GcService} from "../gc/gc.service";
import {FdService} from "../fd/fd.service";
import {GlService} from "../gl/gl.service";

@NgModule({
  declarations: [
    FsPage,
  ],
  imports: [
    IonicPageModule.forChild(FsPage),
  ],
  providers: [
    FsService,GcService,FdService,GlService
  ],
})
export class FsPageModule {}
