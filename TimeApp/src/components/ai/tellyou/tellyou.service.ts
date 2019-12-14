import {Injectable} from "@angular/core";
import {Subscriber} from "rxjs";
import {UtilService} from "../../../service/util-service/util.service";
import {AssistantService} from "../../../service/cordova/assistant.service";
import {EmitService} from "../../../service/util-service/emit.service";
import {TimeOutService} from "../../../util/timeOutService";
import {AsyncQueue} from "../../../util/asyncQueue";

@Injectable()
export class TellyouService {

  tellYouQueue:AsyncQueue;

  reminds:Array<any> = new Array<any>();
  systems:Array<any> = new Array<any>();
  invites:Array<any> = new Array<any>();

  constructor(private utilService: UtilService,
              private assistantService: AssistantService,
              private emitService: EmitService,
              private timeoutService: TimeOutService) {
    this.tellYouQueue = new AsyncQueue(({message},callback) =>{
      callback([message]);
    },1,1,"tellyou.queue",this.utilService,this.timeoutService);
  }

  pushTellYouData($data:any,fun:Function){
    this.tellYouQueue.push({message: $data},(message)=>{
      fun(message);
    })
  }

  pauseTellYou(){
    this.tellYouQueue.pause();
  }

  resumeTellYou(){
    this.tellYouQueue.resume();
  }
  ignoreAll(){
    this.tellYouQueue.kill();
    this.reminds.length = 0;
    this.systems.length = 0;
    this.invites.length = 0;
  }
}
