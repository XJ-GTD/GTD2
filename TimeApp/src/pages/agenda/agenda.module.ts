import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AgendaPage } from "./agenda";
import { DoService } from "./agenda.service";
import {PageBoxComponentModule} from "../../components/page-box/page-box.module";

@NgModule({
  declarations: [
    AgendaPage,
  ],
  imports: [
    IonicPageModule.forChild(AgendaPage),
    PageBoxComponentModule
  ],
  providers: [
    AgendaService
  ],
})
export class AgendaPageModule {}
