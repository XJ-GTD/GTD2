import { NgModule } from '@angular/core';
import { CfPage } from './cf';
import { IonicModule } from "ionic-angular";
import { DirectivesModule } from "../../directives/directives.module";

@NgModule({
  declarations: [
    CfPage
  ],
  imports: [
    IonicModule,
    DirectivesModule
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
