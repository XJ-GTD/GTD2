import {ModuleWithProviders, NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RadioSpinnerComponent } from './radio-spinner';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    RadioSpinnerComponent,
  ],
  entryComponents: [
    RadioSpinnerComponent,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(RadioSpinnerComponent)
  ],
  providers: [

  ],
  exports: [
    RadioSpinnerComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RadioSpinnerComponentModule {
}
