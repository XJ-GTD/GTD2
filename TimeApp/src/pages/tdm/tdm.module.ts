import { NgModule } from '@angular/core';
import { TdmPage } from './tdm';
import {IonicModule} from "ionic-angular";
import {PipesModule} from "../../pipes/pipes.module";
import {ScrollSelectComponentModule} from "../../components/scroll-select/scroll-select.module";

@NgModule({
  declarations: [
    TdmPage
  ],
  imports: [
      IonicModule,
      PipesModule,
      ScrollSelectComponentModule
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
