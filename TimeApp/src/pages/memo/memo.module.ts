import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemoPage } from "./memo";
import {CornerBadgeComponentModule} from "../../components/corner-badge/corner-badge.module";
import {PipesModule} from "../../pipes/pipes.module";
import {PageBoxComponentModule} from "../../components/page-box/page-box.module";

@NgModule({
  declarations: [
    MemoPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(MemoPage),
    PageBoxComponentModule,
    CornerBadgeComponentModule
  ],
  providers: [
  ],
})
export class MemoPageModule {}
