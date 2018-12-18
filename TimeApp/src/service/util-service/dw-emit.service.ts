import {Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Injectable, NgModule, Output} from "@angular/core";
import { HaPage } from "../../pages/ha/ha";

/**
 * 数据传递广播处理类
 */
@Injectable()
export class DwEmitService {



  //首页数据传递
  private ha: EventEmitter<any>;

  public setHaData($event) {
    this.createEmit(this.ha);
    this.ha.emit($event);
  }

  public getHaData(success) {
    this.ha.subscribe($event => {
      //调取页面方法,在这里调用页面逻辑
      success($event);
    })
  }

  //语音界面数据传递
  public hbOfMq: EventEmitter<any> = new EventEmitter();

  public setHbData($event): void {
    this.hbOfMq.emit($event);
  }

  public getHbData(success){
    this.hbOfMq.subscribe($event => {
      success($event).then(() => {
        this.destroyEmit(this.hbOfMq);
      });
    });
  }

  /**
   * 统一的创建方法
   * @param emit
   */
  private createEmit(emit: EventEmitter<any>) {
    if (emit == null) emit = new EventEmitter<any>();
  }
  /**
   * 统一的销毁方法
   */
  private destroyEmit(emit: EventEmitter<any>) {
    emit = null;
  }
}
