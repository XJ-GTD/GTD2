import { NgModule } from '@angular/core';
import { TdcPage } from './tdc';
import {TdcService} from "./tdc.service";
import {TddiPage} from "./tddi";
import {TddjPage} from "./tddj";
import {IonicModule} from "ionic-angular";
import {PipesModule} from "../../pipes/pipes.module";
import {TddsPage} from "./tdds";

@NgModule({
  declarations: [
    TdcPage,
    TddiPage,
    TddjPage,TddsPage
  ],
  imports: [
      IonicModule,
      PipesModule
  ],
  providers: [
    TdcService,
  ],
  entryComponents:[
    TdcPage,
    TddiPage,
    TddjPage,TddsPage
  ],
  exports:[
    TdcPage,
    TddiPage,
    TddjPage,TddsPage

  ]
})
export class TdcPageModule {}
