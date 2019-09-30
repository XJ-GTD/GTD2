import {NgModule} from '@angular/core';
import {MemberService} from "./member.service";
import {GcService} from "../gc/gc.service";
import {FdService} from "../fd/fd.service";
import {GlService} from "../gl/gl.service";
import {IonicModule} from "ionic-angular";
import {MemberPage} from "./member";

@NgModule({
  declarations: [
    MemberPage,
  ],
  imports: [
    IonicModule],
  providers: [
    MemberService, GcService, FdService, GlService
  ],

  entryComponents:[
    MemberPage,
  ]
})
export class MemberPageModule {
}
