import { NgModule } from '@angular/core';
import { CfPage } from './cf';
import { IonicModule } from "ionic-angular";
import { DirectivesModule } from "../../directives/directives.module";
import { RadioSelectComponentModule } from "../../components/radio-select/radio-select.module";

@NgModule({
  declarations: [
    CfPage
  ],
  imports: [
    IonicModule,
    DirectivesModule,
    RadioSelectComponentModule
  ],
  providers: [
  ],
  entryComponents:[
    CfPage
  ],
  exports:[
    CfPage
  ]
})
export class CfPageModule {}
