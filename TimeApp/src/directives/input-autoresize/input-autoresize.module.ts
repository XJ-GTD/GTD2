import {ModuleWithProviders, NgModule} from '@angular/core';
import { AutoresizeDirective } from './input-autoresize';

@NgModule({
  declarations: [
    AutoresizeDirective
  ],
  imports: [
  ],
  providers: [
    AutoresizeDirective
  ],
  exports: [
    AutoresizeDirective
  ]
})
export class AutoresizeDirectiveModule {
}
