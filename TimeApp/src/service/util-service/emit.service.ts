import {EventEmitter, Injectable} from "@angular/core";
import {Moment} from "moment";
import * as moment from "moment";

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

  registerListener(callback) {
    if (this.listenerEm.closed) {
      this.listenerEm = new EventEmitter<boolean>();
    }
    this.listenerEm.subscribe(($data: boolean) => {
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


  registerSpeak(callback) {
    if (this.speakEm.closed) {
      this.speakEm = new EventEmitter<boolean>();
    }
    this.speakEm.subscribe(($data: boolean) => {
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

  registerRef(callback) {
    if (this.refEm.closed) {
      this.refEm = new EventEmitter<string>();
    }
    this.refEm.subscribe(($data: string) => {
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

  registerNewMessageClick(callback) {
    if (this.newMessageClickEm.closed) {
      this.newMessageClickEm = new EventEmitter<ScdEmData>();
    }
    this.newMessageClickEm.subscribe(($data:ScdEmData) => {
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



  registerSelectDate(callback) {
    if (this.selectDateEm.closed) {
      this.selectDateEm = new EventEmitter<moment.Moment>();
    }
    this.selectDateEm.subscribe(($data: moment.Moment) => {
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


  registerScded(callback) {
    if (this.scdedEm.closed) {
      this.scdedEm = new EventEmitter<ScdEmData>();
    }
    this.scdedEm.subscribe(($data: ScdEmData) => {
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

  registerScdLs(callback) {
    if (this.scdLsEm.closed) {
      this.scdLsEm = new EventEmitter<ScdLsEmData>();
    }
    this.scdLsEm.subscribe(($data: ScdLsEmData) => {
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

  registerSpeech(callback) {
    if (this.speechEm.closed) {
      this.speechEm = new EventEmitter<SpeechEmData>();
    }
    this.speechEm.subscribe(($data: SpeechEmData) => {
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


  registerScd(callback) {
    if (this.scdEm.closed) {
      this.scdEm = new EventEmitter<ScdEmData>();
    }
    this.scdEm.subscribe(($data: ScdEmData) => {
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
}
