import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GcPage } from './gc';
import {FsService} from "../fs/fs.service";
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";
import {DirectivesModule} from "../../directives/directives.module";

@NgModule({
  declarations: [
    GcPage,
  ],
  imports: [
    IonicPageModule.forChild(GcPage),
    ModalBoxComponentModule,
    DirectivesModule
  ],
  providers: [
    FsService
  ],
})
export class GcPageModule {}
