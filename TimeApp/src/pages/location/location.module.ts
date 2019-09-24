import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { LocationPage } from './location';
import { IonicModule } from "ionic-angular";
import { BaiduMapModule } from 'angular2-baidu-map';
import {ModalBoxComponentModule} from "../../components/modal-box/modal-box.module";
import {AutoCompleteModule} from "ionic2-auto-complete";
import {LocationSearchService} from "../../service/restful/LocationSearchService";

@NgModule({
  declarations: [
    LocationPage
  ],
  imports: [
    IonicModule,
    AutoCompleteModule,
    BaiduMapModule.forRoot({ ak: '98TMZR5WnSwbH5FdnHHDe0917UlcDfCL' }),
    ModalBoxComponentModule
  ],
  providers: [
    LocationSearchService
  ],
  entryComponents:[
    LocationPage
  ],
  exports:[
    LocationPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LocationPageModule {}
