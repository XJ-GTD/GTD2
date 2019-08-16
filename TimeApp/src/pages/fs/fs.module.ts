import {NgModule} from '@angular/core';
import {FsService} from "./fs.service";
import {GcService} from "../gc/gc.service";
import {FdService} from "../fd/fd.service";
import {GlService} from "../gl/gl.service";
import {Fs4cPage} from "./fs4c";
import {Fs4gPage} from "./fs4g";
import {Fs4foPage} from "./fs4fo";
import {IonicModule} from "ionic-angular";

@NgModule({
  declarations: [
    Fs4cPage,
    Fs4gPage,
    Fs4foPage
  ],
  imports: [
    IonicModule],
  providers: [
    FsService, GcService, FdService, GlService
  ],

  entryComponents:[
    Fs4cPage,
    Fs4gPage,
    Fs4foPage
  ]
})
export class FsPageModule {
}
