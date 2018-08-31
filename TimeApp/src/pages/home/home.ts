import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WebsocketService } from "../../service/websocket.service";
import {ParamsService} from "../../service/params.service";

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: []
})
export class HomePage {
  tab1Root = 'SpeechPage';

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private webSocketService: WebsocketService,
              private paramsService: ParamsService) {

    //消息队列接收
    this.webSocketService.connect(this.paramsService.user.accountMobile);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  switchPage(page) {
    this.navCtrl.push(page);
  }
}
