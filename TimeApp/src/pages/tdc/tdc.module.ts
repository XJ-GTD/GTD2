import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TdcPage } from './tdc';
import { ElModule } from 'element-angular'
import {TdcService} from "./tdc.service";
import {ScrollSelectComponent} from "../../components/scroll-select/scroll-select";
import {ScrollRangePickerComponent} from "../../components/scroll-range-picker/scroll-range-picker";

@NgModule({
  declarations: [
    TdcPage,
    ScrollSelectComponent,
    ScrollRangePickerComponent
  ],
  imports: [
    IonicPageModule.forChild(TdcPage),
    ElModule,
  ],
  providers: [
    TdcService,
  ],
})
export class TdcPageModule {}
