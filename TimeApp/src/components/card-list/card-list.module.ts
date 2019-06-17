import {ModuleWithProviders, NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CardListComponent } from './card-list';
import { WeatherIconsModule } from 'ngx-icons';

@NgModule({
  declarations: [
    CardListComponent,
  ],
  entryComponents: [
    CardListComponent,
  ],
  imports: [
    IonicPageModule.forChild(CardListComponent),
    WeatherIconsModule
  ],
  providers: [],
  exports: [
    CardListComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CardListComponentModule {
}
