import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GcPage } from './gc';
import {GcService} from "./gc.service";
import {FsService} from "../fs/fs.service";
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";

@NgModule({
  declarations: [
    GcPage,
  ],
  imports: [
    IonicPageModule.forChild(GcPage),
    ModalBoxComponentModule
  ],
  providers: [
    GcService,FsService
  ],
})
export class GcPageModule {}
