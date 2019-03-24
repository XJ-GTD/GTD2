import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {TdcService} from "./tdc.service";
import {ScrollSelectComponent} from "../../components/scroll-select/scroll-select";
import {ScrollRangePickerComponent} from "../../components/scroll-range-picker/scroll-range-picker";
import {TdcPage} from "./tdc";

@NgModule({
  declarations: [
    TdcPage,
    ScrollSelectComponent,
    ScrollRangePickerComponent
  ],
  imports: [
    IonicPageModule.forChild(TdcPage),
  ],
  providers: [
    TdcService,
  ],
})
export class TdcPageModule {}
