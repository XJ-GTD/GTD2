import { NgModule } from '@angular/core';
import { PlanPage } from './plan';
import {IonicModule} from "ionic-angular";
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";
import {PipesModule} from "../../pipes/pipes.module";
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
  declarations: [
    PlanPage
  ],
  imports: [
    IonicModule,
    PipesModule,
    ModalBoxComponentModule,
    DirectivesModule
  ],
  providers: [
  ],
  entryComponents:[
    PlanPage
  ],
  exports:[
    PlanPage
  ]
})
export class PlanPageModule {}
