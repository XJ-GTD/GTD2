import {NgModule} from '@angular/core';
import {FsService} from "./fs.service";
import {GcService} from "../gc/gc.service";
import {FdService} from "../fd/fd.service";
import {GlService} from "../gl/gl.service";
import {InvitesPage} from "./invites";
import {IonicModule} from "ionic-angular";
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";

@NgModule({
  declarations: [
    InvitesPage
  ],
  imports: [
    IonicModule,
    ModalBoxComponentModule
  ],
  providers: [
    FsService, GcService, FdService, GlService
  ],

  entryComponents:[
    InvitesPage
  ]
})
export class InvitesPageModule {
}
