import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BrPage } from './br';
import {BrService} from "./br.service";
import {PageBoxComponentModule} from "../../components/page-box/page-box.module";

@NgModule({
  declarations: [
    BrPage,
  ],
  imports: [
    IonicPageModule.forChild(BrPage),
    PageBoxComponentModule
  ],
  providers: [
    BrService,
  ],
})
export class BrPageModule {}
