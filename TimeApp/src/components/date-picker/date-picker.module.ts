import {ModuleWithProviders, NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DatePickerComponent } from './date-picker';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    DatePickerComponent,
  ],
  entryComponents: [
    DatePickerComponent,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(DatePickerComponent)
  ],
  providers: [

  ],
  exports: [
    DatePickerComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DatePickerComponentModule {
}
