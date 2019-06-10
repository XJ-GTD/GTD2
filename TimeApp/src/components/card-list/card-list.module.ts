import {ModuleWithProviders, NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CardListComponent } from './card-list';

@NgModule({
  declarations: [
    CardListComponent,
  ],
  entryComponents: [
    CardListComponent,
  ],
  imports: [
    IonicPageModule.forChild(CardListComponent)
  ],
  providers: [],
  exports: [
    CardListComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CardListComponentModule {
}
