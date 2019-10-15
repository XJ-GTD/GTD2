import { NgModule } from '@angular/core';
import { RepeatPage } from './repeat';
import { IonicModule } from "ionic-angular";
import { DirectivesModule } from "../../directives/directives.module";
import { RadioSelectComponentModule } from "../../components/radio-select/radio-select.module";
import { RadioSpinnerComponentModule } from "../../components/radio-spinner/radio-spinner.module";
import { DatePickerComponentModule } from "../../components/date-picker/date-picker.module";
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    RepeatPage
  ],
  imports: [
    IonicModule,
    ModalBoxComponentModule,
    DirectivesModule,
    RadioSelectComponentModule,
    RadioSpinnerComponentModule,
    DatePickerComponentModule,
    PipesModule,
  ],
  providers: [
  ],
  entryComponents:[
    RepeatPage
  ],
  exports:[
    RepeatPage
  ]
})
export class RepeatPageModule {}
