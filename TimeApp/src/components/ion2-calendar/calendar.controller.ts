import { Injectable } from '@angular/core';
import {ModalController, Platform} from 'ionic-angular';
import { ModalOptions, CalendarModalOptions } from './calendar.model'
import { IonCalendarService } from './services/calendar.service';
import {CalendarComponent} from "./components/calendar.component";
import {CalendarAnimation} from "./calendar-animation";

@Injectable()
export class CalendarController {

  constructor(public modalCtrl: ModalController,
              public calSvc: IonCalendarService) {
  }

  static create(cmp: CalendarComponent, plt: Platform):CalendarAnimation{
    return new CalendarAnimation(plt,cmp);
  }

  /**
   * @deprecated
   * @param {CalendarModalOptions} calendarOptions
   * @param {ModalOptions} modalOptions
   * @returns {any}
   */
  openCalendar(calendarOptions: CalendarModalOptions, modalOptions: ModalOptions = {}): Promise<{}> {
    return null;
    //
    // let options = this.calSvc.safeOpt(calendarOptions);
    // let calendarModal = this.modalCtrl.create(CalendarModal, Object.assign({
    //   options: options
    // }, options), modalOptions);
    //
    // calendarModal.present();
    //
    // return new Promise((resolve, reject) => {
    //
    //   calendarModal.onDidDismiss((data: {}) => {
    //     if (data) {
    //       resolve(data);
    //     } else {
    //       reject('cancelled')
    //     }
    //   });
    // });

  }

}
