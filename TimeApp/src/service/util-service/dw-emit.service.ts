import { EventEmitter, Injectable } from "@angular/core";

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
      success($event)
    });
  }

  /**
   * 统一的销毁方法
   */
  public destroyEmit(emit: EventEmitter<any>) {
    emit.unsubscribe();
  }
}
