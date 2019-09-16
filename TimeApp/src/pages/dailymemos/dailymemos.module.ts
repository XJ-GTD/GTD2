import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DailyMemosPage } from "./dailymemos";
import {PageBoxComponentModule} from "../../components/page-box/page-box.module";
import {CornerBadgeComponentModule} from "../../components/corner-badge/corner-badge.module";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    DailyMemosPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(DailyMemosPage),
    PageBoxComponentModule,
    CornerBadgeComponentModule
  ],
  providers: [
  ],
})
export class DailyMemosPageModule {}
