import {ModuleWithProviders, NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CornerBadgeComponent } from './corner-badge';

@NgModule({
  declarations: [
    CornerBadgeComponent
  ],
  entryComponents: [
    CornerBadgeComponent
  ],
  imports: [
    IonicPageModule.forChild(CornerBadgeComponent)
  ],
  providers: [],
  exports: [
    CornerBadgeComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CornerBadgeComponentModule {
}
