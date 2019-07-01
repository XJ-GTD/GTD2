import {ModuleWithProviders, NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScrollSelectComponent } from './scroll-select';
import { ScrollSelectOptionComponent } from './scroll-select-option';
import { WeatherIconsModule } from 'ngx-icons';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    ScrollSelectComponent,
    ScrollSelectOptionComponent
  ],
  entryComponents: [
    ScrollSelectComponent,
    ScrollSelectOptionComponent
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ScrollSelectComponent)
  ],
  providers: [],
  exports: [
    ScrollSelectComponent,
    ScrollSelectOptionComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ScrollSelectComponentModule {
}
