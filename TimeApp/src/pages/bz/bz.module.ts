import { NgModule } from '@angular/core';
import { BzPage } from './bz';
import { IonicModule } from "ionic-angular";
import { DirectivesModule } from "../../directives/directives.module";

@NgModule({
  declarations: [
    BzPage
  ],
  imports: [
    IonicModule,
    DirectivesModule
  ],
  providers: [
  ],
  entryComponents:[
    BzPage
  ],
  exports:[
    BzPage
  ]
})
export class BzPageModule {}
