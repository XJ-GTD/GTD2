import { NgModule } from '@angular/core';
import { RemindPage } from './remind';
import { IonicModule } from "ionic-angular";
import { ScrollSelectComponentModule } from "../../components/scroll-select/scroll-select.module";
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";

@NgModule({
  declarations: [
    RemindPage
  ],
  imports: [
      IonicModule,
      ModalBoxComponentModule,
      ScrollSelectComponentModule
  ],
  providers: [
  ],
  entryComponents:[
    RemindPage
  ],
  exports:[
    RemindPage
  ]
})
export class RemindPageModule {}
