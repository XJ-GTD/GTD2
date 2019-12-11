import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FdPage } from './fd';
import {FdService} from "./fd.service";
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    FdPage,
  ],
  imports: [
    IonicPageModule.forChild(FdPage),
    ModalBoxComponentModule,
    PipesModule
  ],
  providers: [
    FdService,
  ],
})
export class FdPageModule {}
