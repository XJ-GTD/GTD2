import { EventEmitter, Injectable } from "@angular/core";

/**
 * 数据传递广播处理类
 */
@Injectable()
export class EmitService {

  //新消息透传(共享数据 入库)
  private newMessage: EventEmitter<any> = new EventEmitter();
  //查询数据透传(语音界面返回显示)
  private findDatas: EventEmitter<any> = new EventEmitter();
  //语音播报透传 （语音播报内容）
  private strSpeech: EventEmitter<any> = new EventEmitter();

  registerMessage(callback){
    if (this.newMessage.closed)  {
      this.newMessage = new EventEmitter();
    }
    this.newMessage.subscribe($data => {
      callback($data);
    });
  };

  emitMessage($data){
    if (!this.newMessage.isStopped) {
      this.newMessage.emit($data);
    }
  }

  destroyMessage(emit: EventEmitter<any>) {
    this.newMessage.unsubscribe();
  }

  registerDatas(callback){
    if (this.findDatas.closed)  {
      this.findDatas = new EventEmitter();
    }
    this.findDatas.subscribe($data => {
      callback($data);
    });
  };

  emitDatas($data){
    if (!this.findDatas.isStopped) {
      this.findDatas.emit($data);
    }
  }

  destroyDatas(emit: EventEmitter<any>) {
    this.findDatas.unsubscribe();
  }

  registerSpeech(callback){
    if (this.strSpeech.closed)  {
      this.strSpeech = new EventEmitter();
    }
    this.strSpeech.subscribe($data => {
      callback($data);
    });
  };

  emitSpeech($data){
    if (!this.strSpeech.isStopped) {
      this.strSpeech.emit($data);
    }
  }

  destroySpeech(emit: EventEmitter<any>) {
    this.strSpeech.unsubscribe();
  }
}
