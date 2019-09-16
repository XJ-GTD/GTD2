import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemoPage } from "./memo";
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";
import {CornerBadgeComponentModule} from "../../components/corner-badge/corner-badge.module";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    MemoPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(MemoPage),
    ModalBoxComponentModule,
    CornerBadgeComponentModule
  ],
  providers: [
  ],
})
export class MemoPageModule {}
