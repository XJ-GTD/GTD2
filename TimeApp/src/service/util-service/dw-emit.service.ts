import { EventEmitter, Injectable } from "@angular/core";
import { HbPage } from "../../pages/hb/hb";
import {HaPage} from "../../pages/ha/ha";
import {AdPage} from "../../pages/ad/ad";

/**
 * 数据传递广播处理类
 */
@Injectable()
export class DwEmitService {

  //首页数据传递
  private ha: EventEmitter<any> = new EventEmitter();

  public setHaData($event) {
    this.ha.emit($event);
  }

  public getHaData(page: HaPage) {
    this.ha.subscribe($event => {
      //调取页面方法,在这里调用页面逻辑
      page.test($event);
    })
  }

  //语音界面数据传递
  private hb: EventEmitter<any> = new EventEmitter();

  public setHbData($event) {
    this.hb.emit($event);
  }

  public getHbData(page: HbPage) {
    this.hb.subscribe($event => {
      // page.messageHanding($event);
      page.test($event);
    })
  }

  //test
  private ad: EventEmitter<any> = new EventEmitter();

  public setAdPage($event) {
    this.ad.emit($event);
  }

  public getAdPage(page: AdPage) {
    this.ad.subscribe($event => {
      page.test($event);
    })
  }

}
