import { NgModule } from '@angular/core';
import { DtSelectPage } from './dtselect';
import { IonicModule } from "ionic-angular";
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";
import {DatePickerComponentModule} from "../../components/date-picker/date-picker.module";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    DtSelectPage
  ],
  imports: [
    IonicModule,
    ModalBoxComponentModule,
    DatePickerComponentModule,
    PipesModule,
  ],
  providers: [
  ],
  entryComponents:[
    DtSelectPage
  ],
  exports:[
    DtSelectPage
  ]
})
export class DtSelectPageModule {}
