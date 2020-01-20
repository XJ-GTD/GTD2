import {NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {HelpService} from "./help.service";
import {HelpComponent} from "./help";

@NgModule({
  declarations: [
    HelpComponent,
  ],
  imports: [
    IonicPageModule.forChild(HelpComponent)
  ],
  exports: [
    HelpComponent,
  ],
  providers:[
    HelpService,
  ],
})
export class HelpComponentModule {
}
