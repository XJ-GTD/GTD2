import {ModuleWithProviders, NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import { Ha01Page } from './ha01';

@NgModule({
  declarations: [
    Ha01Page,
  ],
  imports: [
    IonicModule,
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
