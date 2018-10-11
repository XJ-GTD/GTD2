import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { CalendarModule } from "../../components/ion2-calendar/calendar.module";

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    CalendarModule
  ],
  entryComponents: [
    HomePage,
  ]
})
export class HomePageModule {}
