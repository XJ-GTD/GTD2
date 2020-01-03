import {Component} from '@angular/core';
import {App, IonicPage, Nav} from 'ionic-angular';
import {AlService} from "./al.service";
import {DataConfig} from "../../service/config/data.config";
import {AlData} from "../../data.mapping";

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
      <div class="progress-wrapper">
        <div class="loader">
          <div class="face">
            <div class="circle"></div>
          </div>
          <div class="face">
            <div class="circle"></div>
          </div>
        </div>
      </div>
      <div class="text">{{ alData.text }}</div>
  `
})
export class AlPage {
  alData: AlData = new AlData();

  constructor(private alService: AlService,
              private nav: Nav,
              public app: App) {
    this.alData.text = "正在初始化";

  }

  ionViewDidEnter() {
    this.alinit();

    this.app.setElementClass("white-theme",true);
  }

  async alinit() {
    this.alData = await this.alService.checkAllPermissions();
    this.alData = await this.alService.createDB();
    this.alData = await this.alService.checkSystem();
    this.alData = await this.alService.createSystemData();
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
