import { NgModule } from '@angular/core';
import { TdmPage } from './tdm';
import {IonicModule} from "ionic-angular";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    TdmPage
  ],
  imports: [
      IonicModule,
      PipesModule
  ],
  providers: [
  ],
  entryComponents:[
    TdmPage
  ],
  exports:[
    TdmPage
  ]
})
export class TdmPageModule {}
