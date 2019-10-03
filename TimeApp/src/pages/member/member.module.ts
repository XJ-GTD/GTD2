import {NgModule} from '@angular/core';
import {MemberService} from "./member.service";
import {GcService} from "../gc/gc.service";
import {FdService} from "../fd/fd.service";
import {GlService} from "../gl/gl.service";
import {IonicModule} from "ionic-angular";
import {MemberPage} from "./member";
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
  declarations: [
    MemberPage,
  ],
  imports: [
    IonicModule,
  ModalBoxComponentModule,
    DirectivesModule
],
  providers: [
    MemberService, GcService, FdService, GlService
  ],

  entryComponents:[
    MemberPage,
  ]
})
export class MemberPageModule {
}
