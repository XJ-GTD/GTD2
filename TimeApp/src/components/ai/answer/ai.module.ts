import {ModuleWithProviders, NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AiComponent } from './ai';
import {AiService} from "./ai.service";
import {PointComponentModule} from "../point/point.module";

@NgModule({
  declarations: [
    AiComponent,
  ],
  imports: [
    IonicPageModule.forChild(AiComponent),
    PointComponentModule,
  ],
  providers: [
    AiService
  ],
  exports: [
    AiComponent,
  ],
})
export class AiComponentModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AiComponent
    };
  }
}
