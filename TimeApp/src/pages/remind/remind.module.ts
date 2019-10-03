import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { RemindPage } from './remind';
import { IonicModule } from "ionic-angular";
import { ScrollSelectComponentModule } from "../../components/scroll-select/scroll-select.module";
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";
import {MultiPickerModule} from "ion-multi-picker";
import {DatePickerComponentModule} from "../../components/date-picker/date-picker.module";
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
  declarations: [
    RemindPage
  ],
  imports: [
      IonicModule,
      ModalBoxComponentModule,
      ScrollSelectComponentModule,
      MultiPickerModule,DatePickerComponentModule,DirectivesModule

  ],
  providers: [
  ],
  entryComponents:[
    RemindPage
  ],
  exports:[
    RemindPage
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class RemindPageModule {}
