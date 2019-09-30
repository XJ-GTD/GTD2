import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PPage } from './p';
import {PService} from "./p.service";
import {PageBoxComponentModule} from "../../components/page-box/page-box.module";

@NgModule({
  declarations: [
    PPage,
  ],
  imports: [
    IonicPageModule.forChild(PPage),
    PageBoxComponentModule,
  ],
  providers: [
    PService,
  ],
})
export class PPageModule {}
