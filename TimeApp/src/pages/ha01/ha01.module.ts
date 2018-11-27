import {ModuleWithProviders, NgModule} from '@angular/core';
import {IonicModule, IonicPageModule} from 'ionic-angular';
import { Ha01Page } from './ha01';

@NgModule({
  declarations: [
    Ha01Page,
  ],
  imports: [
    IonicModule,
    // IonicPageModule.forChild(Ha01Page),
  ],
  exports: [Ha01Page]
})
export class Ha01PageModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: Ha01PageModule
    };
  }
}
