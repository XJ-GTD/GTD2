import {Injectable} from "@angular/core";
import {Subscriber} from "rxjs";
import {UtilService} from "../../../service/util-service/util.service";
import {AssistantService} from "../../../service/cordova/assistant.service";
import {EmitService} from "../../../service/util-service/emit.service";
import {TimeOutService} from "../../../util/timeOutService";
import {AsyncQueue} from "../../../util/asyncQueue";

@Injectable()
export class PointService {


  aiTellYou: Subscriber<any>;
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

    // this.aiTellYou = this.emitService.registerAiTellYou(($data) => {

      // if ($data.close) {
      //   this.popperShow = true;
      // } else {
      //   this.popperShow = false;
      //   this.tellYouData.push($data.message);
      //   if (!this.changeDetectorRef['destroyed']) {
      //     this.changeDetectorRef.detectChanges();
      //     this.popper.create();
      //   }
      //   // this.timeoutService.timeOutOnlyOne(30000,()=>{
      //   //   this.closepopper();
      //   // },"close.home.ai.talk");
      // }
    // });
  }

  pushTellYouData($data:any,fun:Function){
    this.tellYouQueue.push({message: $data},(message)=>{
      fun(message);
    })
  }

  pauseTellYou($data:any){
    this.tellYouQueue.pause();
  }

  resumeTellYou($data:any){
    this.tellYouQueue.resume();
  }

  ngOnDestroy() {
    if (this.aiTellYou)
      this.aiTellYou.unsubscribe();
  }
}
