import { NgModule } from '@angular/core';
import { DzPage } from './dz';
import { IonicModule } from "ionic-angular";
import { BaiduMapModule } from 'angular2-baidu-map';

@NgModule({
  declarations: [
    DzPage
  ],
  imports: [
    IonicModule,
    BaiduMapModule.forRoot({ ak: 'zD6zCIA9w7ItoXwxQ8IRPD4rk5E9GEew' })
  ],
  providers: [
  ],
  entryComponents:[
    DzPage
  ],
  exports:[
    DzPage
  ]
})
export class DzPageModule {}
