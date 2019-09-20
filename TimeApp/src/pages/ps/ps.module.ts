import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PsPage } from './ps';
import {PsService} from "./ps.service";
import {PageBoxComponentModule} from "../../components/page-box/page-box.module";

@NgModule({
  declarations: [
    PsPage,
  ],
  imports: [
    IonicPageModule.forChild(PsPage),
    PageBoxComponentModule
  ],
  providers: [
    PsService,
  ],
})
export class PsPageModule {}
