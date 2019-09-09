import { NgModule } from '@angular/core';
import { RepeatPage } from './repeat';
import { IonicModule } from "ionic-angular";
import { DirectivesModule } from "../../directives/directives.module";
import { RadioSelectComponentModule } from "../../components/radio-select/radio-select.module";
import { RadioSpinnerComponentModule } from "../../components/radio-spinner/radio-spinner.module";
import { DatePickerComponentModule } from "../../components/date-picker/date-picker.module";

@NgModule({
  declarations: [
    RepeatPage
  ],
  imports: [
    IonicModule,
    DirectivesModule,
    RadioSelectComponentModule,
    RadioSpinnerComponentModule,
    DatePickerComponentModule
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
