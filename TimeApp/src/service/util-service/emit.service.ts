import {EventEmitter, Injectable} from "@angular/core";

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

  registerScded(callback) {
    if (this.scdedEm.closed) {
      this.scdedEm = new EventEmitter();
    }
    this.scdedEm.subscribe($data => {
      callback($data);
    });
  };

  emitScded($data) {
    if (!this.scdedEm.isStopped) {
      this.scdedEm.emit($data);
    }
  }

  destroyScded(emit: EventEmitter<any>) {
    this.scdedEm.unsubscribe();
  }

  registerScdLs(callback) {
    if (this.scdLsEm.closed) {
      this.scdLsEm = new EventEmitter();
    }
    this.scdLsEm.subscribe($data => {
      callback($data);
    });
  };

  emitScdLs($data) {
    if (!this.scdLsEm.isStopped) {
      this.scdLsEm.emit($data);
    }
  }

  destroyScdLs(emit: EventEmitter<any>) {
    this.scdLsEm.unsubscribe();
  }

  registerSpeech(callback) {
    if (this.speechEm.closed) {
      this.speechEm = new EventEmitter();
    }
    this.speechEm.subscribe($data => {
      callback($data);
    });
  };

  emitSpeech($data) {
    if (!this.speechEm.isStopped) {
      this.speechEm.emit($data);
    }
  }

  destroySpeech(emit: EventEmitter<any>) {
    this.speechEm.unsubscribe();
  }


  registerScd(callback) {
    if (this.scdEm.closed) {
      this.scdEm = new EventEmitter();
    }
    this.scdEm.subscribe($data => {
      callback($data);
    });
  };

  emitScd($data) {
    if (!this.speechEm.isStopped) {
      this.scdEm.emit($data);
    }
  }

  destroyScd(emit: EventEmitter<any>) {
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
  datas: Array<FriendEmData> = new Array<FriendEmData>();
}

export class FriendEmData {
  id: string = "";
  n: string = "";
  m: string = "";
  p: string = "";
  a: string = "";
}
export class SpeechEmData {
  an: string = "";
  org: string = "";
}
