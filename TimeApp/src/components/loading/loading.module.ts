import {ModuleWithProviders, NgModule} from '@angular/core';
import {IonicPageModule } from 'ionic-angular';
import {LoadingComponent} from "./loading";

@NgModule({
  declarations: [
    LoadingComponent,
  ],
  imports: [
    IonicPageModule.forChild(LoadingComponent),
  ],
  exports: [
    LoadingComponent,
  ],
})
export class LoadingComponentModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LoadingComponent
    };
  }
}
