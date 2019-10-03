import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PcPage } from './pc';
import {PcService} from "./pc.service";
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
  declarations: [
    PcPage,
  ],
  imports: [
    IonicPageModule.forChild(PcPage),
    ModalBoxComponentModule,
    DirectivesModule
  ],
  providers: [
    PcService,
  ],
})
export class PcPageModule {}
