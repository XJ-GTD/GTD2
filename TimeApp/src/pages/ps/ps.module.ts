import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PsPage } from './ps';
import {PsService} from "./ps.service";
import {PageBoxComponentModule} from "../../components/page-box/page-box.module";
import {DatePickerComponentModule} from "../../components/date-picker/date-picker.module";

@NgModule({
  declarations: [
    PsPage,
  ],
  imports: [
    IonicPageModule.forChild(PsPage),
    PageBoxComponentModule,
    DatePickerComponentModule

  ],
  providers: [
    PsService,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PsPageModule {}
