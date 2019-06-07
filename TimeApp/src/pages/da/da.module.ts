import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DaPage } from "./da";
import { DaService } from "./da.service";
import {CardListComponentModule} from "../../components/card-list/card-list.module";

@NgModule({
  declarations: [
    DaPage,
  ],
  imports: [
    IonicPageModule.forChild(DaPage),
  ],
  providers: [
    DaService
  ],
})
export class DaPageModule {}
