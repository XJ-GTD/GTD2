import { EventEmitter, Injectable } from "@angular/core";

/**
 * 数据传递广播处理类
 */
@Injectable()
export class DwEmitService {

  //首页数据传递
  private ha: EventEmitter<any> = new EventEmitter();
//语音界面数据传递
  private hbOfMq: EventEmitter<any> = new EventEmitter();

  public setHaData($event) {
    this.setEmit(this.ha, $event);
  }

  public getHaData(success) {
    if (this.ha.closed)  {
      this.ha = new EventEmitter();
    }
    this.ha.subscribe($event => {
      success($event);
    });
  }

  public destroyHaData() {
    this.destroyEmit(this.ha);
  }

  public setHbData($event): void {
    this.setEmit(this.hbOfMq, $event);
  }

  public getHbData(success) {
    if (this.hbOfMq.closed)  {
      this.hbOfMq = new EventEmitter();
    }
    this.hbOfMq.subscribe($event => {
      success($event);
    });
  }

  public destroyHbData() {
    this.destroyEmit(this.hbOfMq);
  }
  /**
   * 统一的广播方法
   */
  private setEmit(emit: EventEmitter<any>, $event) {
    if (!emit.isStopped) {
      emit.emit($event);
    }
  }

  /**
   * 统一的销毁方法
   */
  private destroyEmit(emit: EventEmitter<any>) {
    emit.unsubscribe();
  }
}
