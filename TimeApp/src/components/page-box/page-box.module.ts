import { ModuleWithProviders, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PageBoxComponent } from './page-box';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    PageBoxComponent
  ],
  entryComponents: [
    PageBoxComponent
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(PageBoxComponent)
  ],
  providers: [],
  exports: [
    PageBoxComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PageBoxComponentModule {
}
