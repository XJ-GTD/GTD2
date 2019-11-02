import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PdPage } from './pd';
import {PdService} from "./pd.service";
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";
import {DirectivesModule} from "../../directives/directives.module";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    PdPage,
  ],
  imports: [
    IonicPageModule.forChild(PdPage),
    ModalBoxComponentModule,
    DirectivesModule,
    PipesModule
  ],
  providers: [
    PdService,
  ],
})
export class PdPageModule {}
