import { Component } from '@angular/core';
import {IonicPage, Nav} from 'ionic-angular';
import {PageConfig} from "../../app/page.config";

/**
 * Generated class for the AzPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-az',
  templateUrl: 'az.html',
})
export class AzPage {
  constructor(private nav:Nav) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AzPage ionViewDidLoad ');
  }

  startApp(){
    console.debug('time app go to ' + PageConfig.AL_PAGE);
    console.log('time app go to ' + PageConfig.AL_PAGE);
    this.nav.push(PageConfig.AL_PAGE);
  }
}
