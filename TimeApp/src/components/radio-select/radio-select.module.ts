import {ModuleWithProviders, NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RadioSelectComponent } from './radio-select';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    RadioSelectComponent,
  ],
  entryComponents: [
    RadioSelectComponent,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(RadioSelectComponent)
  ],
  providers: [],
  exports: [
    RadioSelectComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RadioSelectComponentModule {
}
