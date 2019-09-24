import { NgModule } from '@angular/core';
import { LocationPage } from './location';
import { IonicModule } from "ionic-angular";
import { BaiduMapModule } from 'angular2-baidu-map';
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";

@NgModule({
  declarations: [
    LocationPage
  ],
  imports: [
    IonicModule,
    BaiduMapModule.forRoot({ ak: '98TMZR5WnSwbH5FdnHHDe0917UlcDfCL' }),
    ModalBoxComponentModule
  ],
  providers: [
  ],
  entryComponents:[
    LocationPage
  ],
  exports:[
    LocationPage
  ]
})
export class LocationPageModule {}
