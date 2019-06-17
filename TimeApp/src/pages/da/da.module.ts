import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DaPage } from "./da";
import { DaService } from "./da.service";
import {CardListComponentModule} from "../../components/card-list/card-list.module";
import { WeatherIconsModule } from 'ngx-icons';

@NgModule({
  declarations: [
    DaPage,
  ],
  imports: [
    IonicPageModule.forChild(DaPage),
    CardListComponentModule,
    WeatherIcons
  ],
  providers: [
    DaService
  ],
})
export class DaPageModule {}
