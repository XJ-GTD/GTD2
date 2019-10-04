import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FdPage } from './fd';
import {FdService} from "./fd.service";
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";

@NgModule({
  declarations: [
    FdPage,
  ],
  imports: [
    IonicPageModule.forChild(FdPage),
    ModalBoxComponentModule
  ],
  providers: [
    FdService,
  ],
})
export class FdPageModule {}
