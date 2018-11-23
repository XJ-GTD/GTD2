import {ModuleWithProviders, NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import { LightSvgPage } from './light-svg';
import {UtilService} from "../../service/util-service/util.service";

@NgModule({
  declarations: [
    LightSvgPage,
  ],
  imports: [
    IonicModule
  ],
  exports: [LightSvgPage]
})
export class LightSvgPageModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LightSvgPage
    };
  }
}
