import {NgModule} from '@angular/core';
import {FsService} from "./fs.service";
import {GcService} from "../gc/gc.service";
import {FdService} from "../fd/fd.service";
import {GlService} from "../gl/gl.service";
import {Fs4gPage} from "./fs4g";
import {Fs4foPage} from "./fs4fo";
import {IonicModule} from "ionic-angular";
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
  declarations: [
    Fs4gPage,
    Fs4foPage
  ],
  imports: [
    IonicModule,
    ModalBoxComponentModule,
    DirectivesModule
  ],
  providers: [
    FsService, GcService, FdService, GlService
  ],

  entryComponents: [
    Fs4gPage,
    Fs4foPage
  ]
})
export class FsPageModule {
}
