import { NgModule } from '@angular/core';
import { JhPage } from './jh';
import { IonicModule } from "ionic-angular";
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
  declarations: [
    JhPage
  ],
  imports: [
      IonicModule,
    ModalBoxComponentModule,
    DirectivesModule
  ],
  providers: [
  ],
  entryComponents:[
    JhPage
  ],
  exports:[
    JhPage
  ]
})
export class JhPageModule {}
