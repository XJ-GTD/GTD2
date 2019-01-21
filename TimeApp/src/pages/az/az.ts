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
  template: '<ion-slides>' +
  '  <ion-slide style="background-image:url(assets/imgs/wlcome_2.jpg);background-repeat:no-repeat; background-size:100% 100%;-moz-background-size:100% 100%; ">' +
  '  </ion-slide>' +
  '  <ion-slide style="background-image:url(assets/imgs/wlcome_1.jpg);background-repeat:no-repeat; background-size:100% 100%;-moz-background-size:100% 100%; ">' +
  '  </ion-slide>' +
  '  <ion-slide style="background-image:url(assets/imgs/wlcome_3.jpg);background-repeat:no-repeat; background-size:100% 100%;-moz-background-size:100% 100%; ">' +
  '    <img src="/assets/imgs/wlcome_3.jpg" class="slide-image"/>' +
  '    <button ion-button large clear icon-end color="primary" (click)="startApp()">' +
  '      立即开始' +
  '      <ion-icon name="arrow-forward"></ion-icon>' +
  '    </button>' +
  '  </ion-slide>' +
  '</ion-slides>'
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
