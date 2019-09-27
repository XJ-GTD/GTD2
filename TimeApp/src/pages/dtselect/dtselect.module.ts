import { NgModule } from '@angular/core';
import { DtSelectPage } from './dtselect';
import { IonicModule } from "ionic-angular";
import { BaiduMapModule } from 'angular2-baidu-map';
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";
import {ScrollSelectComponentModule} from "../../components/scroll-select/scroll-select.module";
import {MultiPickerModule} from "ion-multi-picker";
import {DatePickerComponentModule} from "../../components/date-picker/date-picker.module";

@NgModule({
  declarations: [
    DtSelectPage
  ],
  imports: [
    IonicModule,
    ModalBoxComponentModule,
    ScrollSelectComponentModule,
    MultiPickerModule,DatePickerComponentModule
  ],
  providers: [
  ],
  entryComponents:[
    DtSelectPage
  ],
  exports:[
    DtSelectPage
  ]
})
export class DtSelectPageModule {}
