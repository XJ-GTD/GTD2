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
    BaiduMapModule.forRoot({ ak: 'zD6zCIA9w7ItoXwxQ8IRPD4rk5E9GEew' }),
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
