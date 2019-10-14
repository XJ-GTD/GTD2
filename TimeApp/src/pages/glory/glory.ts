import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the 每日荣誉 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-glory',
  template: `<ion-content padding>
    <ion-grid>
      <!--垂直居中-->
      <ion-row class="h100" align-items-center>
        <ion-grid>
          <!--水平居中-->
          <ion-row justify-content-center>
            <p>成功击败</p>
          </ion-row>
          <ion-row justify-content-center>
            <h3>90%</h3>
          </ion-row>
          <ion-row justify-content-center>
            <p>冥王星用户</p>
          </ion-row>
          <ion-row class="h20" justify-content-center>
            <p></p>
          </ion-row>
          <ion-row justify-content-center>
            <div>
              <h3>0</h3>
              <p>纪念日</p>
            </div>
            <div>
              <h3>13</h3>
              <p>活动</p>
            </div>
            <div>
              <h3>2</h3>
              <p>备忘</p>
            </div>
          </ion-row>
        </ion-grid>
      </ion-row>
    </ion-grid>
    <ion-fab bottom center>
      <button ion-fab (click)="goBack()">
        <ion-icon name="close"></ion-icon>
      </button>
    </ion-fab>
  </ion-content>`
})
export class GloryPage {
  constructor(public navCtrl: NavController) {
  }

  goBack() {
    this.navCtrl.pop();
  }
}
