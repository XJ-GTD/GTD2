import { Injectable } from "@angular/core";
import {WsModel} from "./model/ws.model";
import {MQProcess} from "./process/interface.process";
import {ProcessEnumModel} from "./process/process.enum";
import {CudscdProcess} from "./process/cudscd.process";
import {FindFriendProcess} from "./process/findfriend.process";
import {FindScdProcess} from "./process/findscd.process";
import {RemindProcess} from "./process/remind.process";
import {SendProcess} from "./process/send.process";
import {ThirdProcess} from "./process/third.process";
import {SpeechProcess} from "./process/speech.process";

/**
 * webSocket公用处理方法
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class ProcessFactory{
  private factory:Map<string,MQProcess> = new Map<string, MQProcess>();
  constructor(){
    this.factory.set("CD",  new CudscdProcess());
    this.factory.set("FF",  new FindFriendProcess());
    this.factory.set("FD",  new FindScdProcess());
    this.factory.set("R",  new RemindProcess());
    this.factory.set("S",  new SendProcess());
    this.factory.set("SP",  new SpeechProcess());
    this.factory.set("SP",  new ThirdProcess());
  }

  findProcess(key:string):MQProcess{
    return this.factory.get(key);
  }
}
