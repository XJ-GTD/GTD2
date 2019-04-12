import {ModuleWithProviders, NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {ConfirmboxComponent} from "./confirmbox";

@NgModule({
  declarations: [
    ConfirmboxComponent,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmboxComponent),
  ],
  exports: [
    ConfirmboxComponent,
  ],
})
export class ConfirmboxComponentModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule:ConfirmboxComponent
    };
  }
}
