import {ModuleWithProviders, NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {TdlPage } from './tdl';

@NgModule({
  declarations: [
    TdlPage,
  ],
  imports: [
    IonicModule,
  ],
  exports: [TdlPage]
})
export class TdlPageModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: TdlPageModule
    };
  }
}
