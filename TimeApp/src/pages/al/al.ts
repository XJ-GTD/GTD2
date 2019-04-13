import {Component} from '@angular/core';
import {IonicPage, Nav} from 'ionic-angular';
import {AlData, AlService} from "./al.service";
import {DataConfig} from "../../service/config/data.config";

/**
 * Generated class for the AlPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-al',
  template: `
    <div class="container">
      <div class="progress-wrapper">
      </div>
      <div class="text">{{ alData.text }}</div>
    </div>
    <BackComponent></BackComponent>
  `
})
export class AlPage {
  alData: AlData = new AlData();

  constructor(private alService: AlService,
              private nav: Nav,) {
    this.alData.text = "正在初始化";

  }

  ionViewDidEnter() {
    this.alinit();
  }

  async alinit() {

    this.alData = await this.alService.checkAllPermissions();
    this.alData = await this.alService.createDB();
    this.alData = await this.alService.checkSystem();
    if (!this.alData.checkSystem) {
      this.alData = await this.alService.createSystemData();
    }
    this.alData = await this.alService.setSetting();
    this.alData = await this.alService.checkUserInfo();
    if (!this.alData.islogin) {
      this.nav.setRoot(DataConfig.PAGE._LP_PAGE);
    } else {
      this.alData.text = "正在连接服务器。。。"
      this.alService.connWebSocket();
      this.alData.text = "进入您的日历"
      this.nav.setRoot(DataConfig.PAGE._M_PAGE);
    }
  }
}
