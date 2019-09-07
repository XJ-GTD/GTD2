import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CalendarController } from './calendar.controller';
import { IonicModule, ModalController } from 'ionic-angular';
import { IonCalendarService } from "./services/calendar.service";
import { CALENDAR_COMPONENTS } from "./components/index";
import {CalendarAnimation} from "./calendar-animation";

export function calendarController(modalCtrl: ModalController,
                                   calSvc: IonCalendarService) {
  return new CalendarController(modalCtrl, calSvc);
}

@NgModule({
  imports: [IonicModule],
  declarations: CALENDAR_COMPONENTS,
  exports: CALENDAR_COMPONENTS,
  entryComponents: CALENDAR_COMPONENTS,
  providers: [
    IonCalendarService,
    {
      provide: CalendarController,
      useFactory: calendarController,
      deps: [ModalController, IonCalendarService]
    }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CalendarModule {
}
