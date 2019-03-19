import {ModuleWithProviders, NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PointComponent } from './point';
import {PointService} from "./point.service";

@NgModule({
  declarations: [
    PointComponent,
  ],
  imports: [
    IonicPageModule.forChild(PointComponent),
  ],
  exports: [
    PointComponent,
  ],
  providers:[
    PointService,
  ],
})
export class PointComponentModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PointComponent
    };
  }
}
