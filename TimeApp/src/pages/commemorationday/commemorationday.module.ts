import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommemorationDayPage } from "./commemorationday";
import { CommemorationDayService } from "./commemorationday.service";
import {PageBoxComponentModule} from "../../components/page-box/page-box.module";
import {CornerBadgeComponentModule} from "../../components/corner-badge/corner-badge.module";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    CommemorationDayPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(CommemorationDayPage),
    PageBoxComponentModule,
    CornerBadgeComponentModule
  ],
  providers: [
    CommemorationDayService
  ],
})
export class CommemorationDayPageModule {}
