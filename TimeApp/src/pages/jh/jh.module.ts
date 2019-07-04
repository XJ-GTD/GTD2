import { NgModule } from '@angular/core';
import { JhPage } from './jh';
import { IonicModule } from "ionic-angular";

@NgModule({
  declarations: [
    JhPage
  ],
  imports: [
      IonicModule
  ],
  providers: [
  ],
  entryComponents:[
    JhPage
  ],
  exports:[
    JhPage
  ]
})
export class JhPageModule {}
