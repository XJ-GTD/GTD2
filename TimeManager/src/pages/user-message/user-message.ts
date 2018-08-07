import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ParamsService} from "../../service/params.service";

/**
 * Generated class for the UserMessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-message',
  templateUrl: 'user-message.html',
  providers: []
})
export class UserMessagePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private paramsService: ParamsService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserMessagePage');
  }

  //接受任务
  acceptTask() {
  }

  //拒绝任务
  refuseTask() {
  }
}
