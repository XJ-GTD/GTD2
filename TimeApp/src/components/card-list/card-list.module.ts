import {ModuleWithProviders, NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CardListComponent } from './card-list';
import { WeatherIconsModule } from 'ngx-icons';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    CardListComponent,
  ],
  entryComponents: [
    CardListComponent,
  ],
  imports: [
    PipesModule,
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
