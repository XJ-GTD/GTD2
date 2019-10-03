import { NgModule } from '@angular/core';
import { CfPage } from './cf';
import { IonicModule } from "ionic-angular";
import { DirectivesModule } from "../../directives/directives.module";
import { RadioSelectComponentModule } from "../../components/radio-select/radio-select.module";
import { RadioSpinnerComponentModule } from "../../components/radio-spinner/radio-spinner.module";
import { DatePickerComponentModule } from "../../components/date-picker/date-picker.module";

@NgModule({
  declarations: [
    CfPage
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
    CfPage
  ],
  exports:[
    CfPage
  ]
})
export class CfPageModule {}
