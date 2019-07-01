import { ModuleWithProviders, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpeechBubbleComponent } from './speech-bubble';

@NgModule({
  declarations: [
    SpeechBubbleComponent,
  ],
  entryComponents: [
    SpeechBubbleComponent,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(SpeechBubbleComponent)
  ],
  providers: [],
  exports: [
    SpeechBubbleComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SpeechBubbleComponentModule {
}
