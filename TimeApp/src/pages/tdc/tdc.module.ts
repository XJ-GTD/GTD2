import { NgModule } from '@angular/core';
import { TdcPage } from './tdc';
import {TddiPage} from "./tddi";
import {TddjPage} from "./tddj";
import {IonicModule} from "ionic-angular";
import {PipesModule} from "../../pipes/pipes.module";
import {TddsPage} from "./tdds";
import {AutoresizeDirective} from "../../directives/ng-autosize/autosize.directive";

@NgModule({
  declarations: [
    TdcPage,
    TddiPage,
    TddjPage,
    TddsPage,
    AutoresizeDirective
  ],
  imports: [
      IonicModule,
      PipesModule
  ],
  providers: [
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
