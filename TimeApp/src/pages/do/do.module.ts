import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoPage } from "./do";
import { DaService } from "./do.service";
import {CardListComponentModule} from "../../components/card-list/card-list.module";

@NgModule({
  declarations: [
    DoPage,
  ],
  imports: [
    IonicPageModule.forChild(DoPage),
    CardListComponentModule
  ],
  providers: [
    DaService
  ],
})
export class DoPageModule {}
