import {Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Injectable, NgModule, Output} from "@angular/core";
import { HaPage } from "../../pages/ha/ha";

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
  public hbOfMq: EventEmitter<any> = new EventEmitter();

  public setHbData($event): void {
    if (this.hbOfMq!= null) this.hbOfMq.emit($event);
  }
  public setEventEmitter(eventEmit:EventEmitter<any>){
    this.hbOfMq = eventEmit;

  }

  public getHbData(success){
    this.hbOfMq.subscribe($event => {
      success($event);
    });
  }

}
