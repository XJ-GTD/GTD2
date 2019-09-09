import { ModuleWithProviders, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalBoxComponent } from './modal-box';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    ModalBoxComponent
  ],
  entryComponents: [
    ModalBoxComponent
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ModalBoxComponent)
  ],
  providers: [],
  exports: [
    ModalBoxComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalBoxComponentModule {
}
