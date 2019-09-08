import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgendaPage } from "./agenda";
import { AgendaService } from "./agenda.service";
import {PageBoxComponentModule} from "../../components/page-box/page-box.module";
import {CornerBadgeComponentModule} from "../../components/corner-badge/corner-badge.module";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    AgendaPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(AgendaPage),
    PageBoxComponentModule,
    CornerBadgeComponentModule
  ],
  providers: [
    AgendaService
  ],
})
export class AgendaPageModule {}
