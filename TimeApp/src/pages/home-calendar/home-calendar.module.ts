import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeCalendarPage } from './home-calendar';

@NgModule({
  declarations: [
    HomeCalendarPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeCalendarPage),
  ],
})
export class HomeCalendarPageModule {}
