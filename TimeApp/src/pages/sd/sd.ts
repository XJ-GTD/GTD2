import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {BaseSqliteService} from "../../service/sqlite-service/base-sqlite.service";

/**
 * Generated class for the SdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sd',
  templateUrl: 'sd.html',
  providers: []
})
export class SdPage {

  scheduleName: string;
  remindTime: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController,private sqliteService:BaseSqliteService) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SdPage');
  }

  setAralmClock() {
    this.remindTime = this.remindTime.replace("T", " ");
    this.remindTime = this.remindTime.replace(":00Z", "");
    this.sqliteService.executeSql('',[])
    this.viewCtrl.dismiss(this.remindTime);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
