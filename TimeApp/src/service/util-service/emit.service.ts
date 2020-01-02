import {EventEmitter, Injectable} from "@angular/core";
import * as moment from "moment";
import {Immediately} from "../cordova/assistant.service";

/**
 * 数据传递广播处理类
 */
@Injectable()
export class EmitService {

  //新消息透传(共享数据 入库)
  private scdedEm: EventEmitter<ScdEmData> = new EventEmitter<ScdEmData>();
  //查询数据透传(语音界面返回显示)
  private scdLsEm: EventEmitter<ScdLsEmData> = new EventEmitter<ScdLsEmData>();
  //语音播报透传 （语音播报内容）
  private speechEm: EventEmitter<SpeechEmData> = new EventEmitter<SpeechEmData>();
  //新建修改删除 （语音界面使用）
  private scdEm: EventEmitter<ScdEmData> = new EventEmitter<ScdEmData>();
  //主页选择时间后，Ls更新
  private selectDateEm: EventEmitter<moment.Moment> = new EventEmitter<moment.Moment>();

  //新消息点击后
  private newMessageClickEm: EventEmitter<ScdEmData> = new EventEmitter<ScdEmData>();

  //新日程增加修改删除信息消息刷新
  private refEm: EventEmitter<string> = new EventEmitter<string>();

  //语音播放或结束事件
  private speakEm:EventEmitter<boolean> = new EventEmitter<boolean>();
  //语音播放或结束事件
  private listenerEm:EventEmitter<boolean> = new EventEmitter<boolean>();

  //新日程增加修改删除信息消息刷新
  private immediatelyEm: EventEmitter<Immediately> = new EventEmitter<Immediately>();

  private aiTellYouEm: EventEmitter<string> = new EventEmitter<string>();


  registerAiTellYou(callback) :any{
    if (this.aiTellYouEm.closed) {
      this.aiTellYouEm = new EventEmitter<string>();
    }
    return this.aiTellYouEm.subscribe(($data: string) => {
      callback($data);
    });
  };

  emitAiTellYou($data: any) {
    if (!this.aiTellYouEm.isStopped) {
      this.aiTellYouEm.emit($data);
    }
  }


  registerImmediately(callback) :any{
    if (this.immediatelyEm.closed) {
      this.immediatelyEm = new EventEmitter<Immediately>();
    }
    return this.immediatelyEm.subscribe(($data: Immediately) => {
      callback($data);
    });
  };

  emitImmediately($data: Immediately) {
    if (!this.immediatelyEm.isStopped) {
      this.immediatelyEm.emit($data);
    }
  }

  destroyImmediately() {
    this.immediatelyEm.unsubscribe();
  }

  //冥王星内建事件订阅/触发管理
  //同一个事件可以被多个调用注册
  private static buildinEvents: Map<string, Array<EventEmitter<any>>> = new Map<string, Array<EventEmitter<any>>>();

  constructor() {
  }

  //冥王星内建事件订阅
  register(handler: string, callback): EventEmitter<any> {
    let el: Array<EventEmitter<any>> = EmitService.buildinEvents.get(handler);

    //事件不存在，创建并加入管理
    if (!el) {
      el = new Array<EventEmitter<any>>();
    }

    let ee: EventEmitter<any> = new EventEmitter<any>();

    //订阅事件回调
    ee.subscribe(($data: any) => {
      callback($data);
    });

    el.push(ee);
    EmitService.buildinEvents.set(handler, el);

    return ee;
  }

  //冥王星内建事件触发
  emit(handler: string, $data: any = {}): number {
    let emitted: number = 0;
    let el: Array<EventEmitter<any>> = EmitService.buildinEvents.get(handler);

    //事件不存在直接返回
    if (!el || el.length < 1) {
      return emitted;
    }

    //普通事件
    if (el && el.length > 0) {
      for (let ee of el) {
        if (!ee.isStopped) {
          ee.emit($data);
          emitted++;
        }
      }
    }

    return emitted;
  }

  //冥王星内建事件注销
  destroy(handler: string) {
    let el: Array<EventEmitter<any>> = EmitService.buildinEvents.get(handler);

    //事件不存在直接返回
    if (!el || el.length < 1) {
      return;
    }

    for (let ee of el) {
      ee.unsubscribe();
    }

    //从管理中移除当前事件
    EmitService.buildinEvents.delete(handler);
  }

  registerListener(callback) :any{
    if (this.listenerEm.closed) {
      this.listenerEm = new EventEmitter<boolean>();
    }
    return this.listenerEm.subscribe(($data: boolean) => {
      callback($data);
    });
  };

  emitListener($data: boolean) {
    if (!this.listenerEm.isStopped) {
      this.listenerEm.emit($data);
    }
  }

  destroyListener(emit: EventEmitter<boolean>) {
    this.listenerEm.unsubscribe();
  }


  registerSpeak(callback):any {
    if (this.speakEm.closed) {
      this.speakEm = new EventEmitter<boolean>();
    }
    return  this.speakEm.subscribe(($data: boolean) => {
      callback($data);
    });
  };

  emitSpeak($data: boolean) {
    if (!this.speakEm.isStopped) {
      this.speakEm.emit($data);
    }
  }

  destroySpeak(emit: EventEmitter<boolean>) {
    this.speakEm.unsubscribe();
  }

  registerRef(callback) :any{
    if (this.refEm.closed) {
      this.refEm = new EventEmitter<string>();
    }
    return  this.refEm.subscribe(($data: string) => {
      callback($data);
    });
  };

  emitRef($data: string) {
    if (!this.refEm.isStopped) {
      this.refEm.emit($data);
    }
  }

  destroyRef(emit: EventEmitter<string>) {
    this.refEm.unsubscribe();
  }

  registerNewMessageClick(callback) :any{
    if (this.newMessageClickEm.closed) {
      this.newMessageClickEm = new EventEmitter<ScdEmData>();
    }
    return  this.newMessageClickEm.subscribe(($data:ScdEmData) => {
      callback($data);
    });
  };

  emitNewMessageClick($data:ScdEmData) {
    if (!this.newMessageClickEm.isStopped) {
      this.newMessageClickEm.emit($data);
    }
  }

  destroyNewMessageClick(emit: EventEmitter<moment.Moment>) {
    this.newMessageClickEm.unsubscribe();
  }



  registerSelectDate(callback):any {
    if (this.selectDateEm.closed) {
      this.selectDateEm = new EventEmitter<moment.Moment>();
    }
    return  this.selectDateEm.subscribe(($data: moment.Moment) => {
      callback($data);
    });
  };

  emitSelectDate($data: moment.Moment) {
    if (!this.selectDateEm.isStopped) {
      this.selectDateEm.emit($data);
    }
  }

  destroySelectDate(emit: EventEmitter<moment.Moment>) {
    this.selectDateEm.unsubscribe();
  }


  registerScded(callback):any {
    if (this.scdedEm.closed) {
      this.scdedEm = new EventEmitter<ScdEmData>();
    }
    return  this.scdedEm.subscribe(($data: ScdEmData) => {
      callback($data);
    });
  };

  emitScded($data: ScdEmData) {
    if (!this.scdedEm.isStopped) {
      this.scdedEm.emit($data);
    }
  }

  destroyScded(emit: EventEmitter<ScdEmData>) {
    this.scdedEm.unsubscribe();
  }

  registerScdLs(callback):any {
    if (this.scdLsEm.closed) {
      this.scdLsEm = new EventEmitter<ScdLsEmData>();
    }
    return this.scdLsEm.subscribe(($data: ScdLsEmData) => {
      callback($data);
    });
  };

  emitScdLs($data: ScdLsEmData) {
    if (!this.scdLsEm.isStopped) {
      this.scdLsEm.emit($data);
    }
  }

  destroyScdLs(emit: EventEmitter<ScdLsEmData>) {
    this.scdLsEm.unsubscribe();
  }

  registerSpeech(callback) :any{
    if (this.speechEm.closed) {
      this.speechEm = new EventEmitter<SpeechEmData>();
    }
    return  this.speechEm.subscribe(($data: SpeechEmData) => {
      callback($data);
    });
  };

  emitSpeech($data: SpeechEmData) {
    if (!this.speechEm.isStopped) {
      this.speechEm.emit($data);
    }
  }

  destroySpeech(emit: EventEmitter<SpeechEmData>) {
    this.speechEm.unsubscribe();
  }


  registerScd(callback) :any{
    if (this.scdEm.closed) {
      this.scdEm = new EventEmitter<ScdEmData>();
    }
    return this.scdEm.subscribe(($data: ScdEmData) => {
      callback($data);
    });
  };

  emitScd($data: ScdEmData) {
    if (!this.speechEm.isStopped) {
      this.scdEm.emit($data);
    }
  }

  destroyScd(emit: EventEmitter<ScdEmData>) {
    this.scdEm.unsubscribe();
  }
}

export class ScdLsEmData {
  desc: string = "";
  scdTip : string ="";
  datas: Array<ScdEmData> = new Array<ScdEmData>();
}

export class ScdEmData {
  id: string = "";
  d: string = "";
  t: string = "";
  ti: string = "";
  gs:string = "";
  scdTip:string ="";
  datas: Array<FriendEmData> = new Array<FriendEmData>();
}

export class FriendEmData {
  id: string = "";
  n: string = "";
  m: string = "";
  p: string = "";
  a: string = "";
  uid: string = "";
}

export class SpeechEmData {
  an: string = "";
  org: string = "";
  iswaitting: boolean = false;
}
