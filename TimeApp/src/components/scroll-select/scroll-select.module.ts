import {ModuleWithProviders, NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScrollSelectComponent } from './scroll-select';
import { WeatherIconsModule } from 'ngx-icons';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    ScrollSelectComponent,
  ],
  entryComponents: [
    ScrollSelectComponent,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ScrollSelectComponent)
  ],
  providers: [],
  exports: [
    ScrollSelectComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ScrollSelectComponentModule {
}
