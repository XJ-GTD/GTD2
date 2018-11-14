import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { CalendarModule } from "../../components/ion2-calendar";
import { SuperTabsModule,SuperTabsController} from "../../components/ionic2-super-tabs";
import {LightSvgPageModule} from "../light-svg/light-svg.module";
import {HomeWorkListPageModule} from "../home-work-list/home-work-list.module";
@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    CalendarModule,
    SuperTabsModule,
    LightSvgPageModule,
    HomeWorkListPageModule
  ],
  entryComponents: [
    HomePage
  ],
  providers:[
    SuperTabsController
  ]
})
export class HomePageModule {}
