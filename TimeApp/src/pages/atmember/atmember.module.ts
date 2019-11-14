import {NgModule} from '@angular/core';
import {IonicModule} from "ionic-angular";
import {AtMemberPage} from "./atmember";
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
  declarations: [
    AtMemberPage,
  ],
  imports: [
    IonicModule,
    ModalBoxComponentModule,
    DirectivesModule
],
  providers: [

  ],

  entryComponents:[
    AtMemberPage,
  ]
})
export class AtMemberPageModule {
}
