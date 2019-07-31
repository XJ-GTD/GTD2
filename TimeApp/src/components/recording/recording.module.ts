import {ModuleWithProviders, NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecordingComponent } from './recording';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    RecordingComponent,
  ],
  entryComponents: [
    RecordingComponent,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(RecordingComponent)
  ],
  providers: [],
  exports: [
    RecordingComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RecordingComponentModule {
}
