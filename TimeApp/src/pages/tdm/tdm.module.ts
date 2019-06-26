import { NgModule } from '@angular/core';
import { TdmPage } from './tdm';
import {IonicModule} from "ionic-angular";
import {PipesModule} from "../../pipes/pipes.module";
import {Autosize} from "../../directives/ng-autosize/autosize.directive";

@NgModule({
  declarations: [
    TdmPage,
    Autosize
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
