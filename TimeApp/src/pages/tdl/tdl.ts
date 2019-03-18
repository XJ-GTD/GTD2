import {Component, ElementRef, Input, Renderer2} from '@angular/core';
import {App, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import * as moment from "moment";

/**
 * Generated class for the 日程列表 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tdl',
  template: `<ion-content>
    <ion-grid>
      <ion-row>
        <div class="w-10 leftside">
          <ion-grid>
            <ion-row justify-content-center align-items-center>
              <div class="text-rotate-90">二月 2019</div>
            </ion-row>
          </ion-grid>
        </div>
        <div class="w-15 leftside">
          <ion-grid>
            <ion-row justify-content-center align-items-center>
              <div>
                <div>周二</div><div>18</div>
              </div>
            </ion-row>
            <ion-row justify-content-center align-items-center>
              <div>
                <div>周三</div><div>19</div>
              </div>
            </ion-row>
            <ion-row justify-content-center align-items-center>
              <div>
                <div>周四</div><div>20</div>
              </div>
            </ion-row>
            <ion-row justify-content-center align-items-center>
              <div>
                <div>周五</div><div>21</div>
              </div>
            </ion-row>
          </ion-grid>
        </div>
        <div class="w-auto rightside">
          <ion-list no-lines>
            <ion-item>
              test
            </ion-item>
          </ion-list>
        </div>
      </ion-row>
    </ion-grid>
  </ion-content>`

})
export class TdlPage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AgendaListPage');
  }


}
