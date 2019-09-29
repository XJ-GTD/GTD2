import {NgModule} from '@angular/core';
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

  ],

  entryComponents:[
    InvitesPage
  ]
})
export class InvitesPageModule {
}
