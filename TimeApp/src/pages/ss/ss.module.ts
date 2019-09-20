import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SsPage } from './ss';
import {SsService} from "./ss.service";
import {PageBoxComponentModule} from "../../components/page-box/page-box.module";

@NgModule({
  declarations: [
    SsPage,
  ],
  imports: [
    IonicPageModule.forChild(SsPage),
    PageBoxComponentModule
  ],
  providers: [
    SsService,
  ],
})
export class SsPageModule {}
