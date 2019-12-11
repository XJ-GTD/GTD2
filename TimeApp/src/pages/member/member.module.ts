import {NgModule} from '@angular/core';
import {MemberService} from "./member.service";
import {FdService} from "../fd/fd.service";
import {IonicModule} from "ionic-angular";
import {MemberPage} from "./member";
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";
import {DirectivesModule} from "../../directives/directives.module";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    MemberPage,
  ],
  imports: [
    IonicModule,
  ModalBoxComponentModule,
    DirectivesModule,
    PipesModule
],
  providers: [
    MemberService, FdService,
  ],

  entryComponents:[
    MemberPage,
  ]
})
export class MemberPageModule {
}
