import {ModuleWithProviders, NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageSendComponent } from './message-send';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    MessageSendComponent,
  ],
  entryComponents: [
    MessageSendComponent,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(MessageSendComponent)
  ],
  providers: [],
  exports: [
    MessageSendComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MessageSendComponentModule {
}
