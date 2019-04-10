import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {FsService} from "./fs.service";
import {GcService} from "../gc/gc.service";
import {FdService} from "../fd/fd.service";
import {GlService} from "../gl/gl.service";
import {Fs4cPage} from "./fs4c";
import {Fs4gPage} from "./fs4g";

@NgModule({
  declarations: [
    Fs4cPage,
    Fs4gPage
  ],
  providers: [
    FsService,GcService,FdService,GlService
  ],
})
export class FsPageModule {}
