import { NgModule } from '@angular/core';
import { BzPage } from './bz';
import { IonicModule } from "ionic-angular";

@NgModule({
  declarations: [
    BzPage
  ],
  imports: [
      IonicModule
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
