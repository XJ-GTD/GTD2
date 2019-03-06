import {ModuleWithProviders, NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {TdlPage } from './tdl';
import {TdlService} from "./tdl.service";

@NgModule({
  declarations: [
    TdlPage,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    TdlPage,
  ],
  providers: [
    TdlService,
  ],
})
export class TdlPageModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: TdlPageModule
    };
  }
}
