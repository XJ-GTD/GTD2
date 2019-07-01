import { NgModule } from '@angular/core';
import { TxPage } from './tx';
import { IonicModule } from "ionic-angular";
import { ScrollSelectComponentModule } from "../../components/scroll-select/scroll-select.module";

@NgModule({
  declarations: [
    TxPage
  ],
  imports: [
      IonicModule,
      ScrollSelectComponentModule
  ],
  providers: [
  ],
  entryComponents:[
    TxPage
  ],
  exports:[
    TxPage
  ]
})
export class TxPageModule {}
