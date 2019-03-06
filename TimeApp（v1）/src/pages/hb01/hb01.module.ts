import {ModuleWithProviders, NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Hb01Page } from './hb01';

@NgModule({
  declarations: [
    Hb01Page,
  ],
  imports: [
    IonicPageModule.forChild(Hb01Page),
  ],
  exports: [Hb01Page]
})
export class Hb01PageModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: Hb01Page
    };
  }
}
