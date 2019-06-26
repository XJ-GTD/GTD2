import {ModuleWithProviders, NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScrollRangePickerComponent } from './scroll-range-picker';
import { WeatherIconsModule } from 'ngx-icons';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    ScrollRangePickerComponent,
  ],
  entryComponents: [
    ScrollRangePickerComponent,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ScrollRangePickerComponent)
  ],
  providers: [],
  exports: [
    ScrollRangePickerComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ScrollRangePickerComponentModule {
}
