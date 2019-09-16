import { NgModule } from '@angular/core';
import { AttachPage } from './attach';
import { IonicModule } from "ionic-angular";
import { DirectivesModule } from "../../directives/directives.module";
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";

@NgModule({
  declarations: [
    AttachPage
  ],
  imports: [
    IonicModule,
    ModalBoxComponentModule,
    DirectivesModule
  ],
  providers: [
  ],
  entryComponents:[
    AttachPage
  ],
  exports:[
    AttachPage
  ]
})
export class AttachPageModule {}
