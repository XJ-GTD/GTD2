import {Injectable} from "@angular/core";
import {UtilService} from "../../../service/util-service/util.service";
import {AssistantService} from "../../../service/cordova/assistant.service";
import {EmitService} from "../../../service/util-service/emit.service";
import {TimeOutService} from "../../../util/timeOutService";
import {AsyncQueue} from "../../../util/asyncQueue";
import * as noop from "lodash/noop.js"
import {TellyouIdType, TellyouType} from "../../../data.enum";
import {AgendaData, EventService, MiniTaskData} from "../../../service/business/event.service";
import {CalendarService, PlanItemData} from "../../../service/business/calendar.service";

@Injectable()
export class TellyouService {

  private tellYouQueue: AsyncQueue;

  private reminds: Array<TellYouBase> = new Array<TellYouBase>();
  private systems: Array<TellYouBase> = new Array<TellYouBase>();
  private invites: Array<TellYouBase> = new Array<TellYouBase>();
  private showfn:Function = noop;
  private closefn:Function = noop;

  constructor(private utilService: UtilService,
              private assistantService: AssistantService,
              private emitService: EmitService,
              private timeoutService: TimeOutService,
              private eventService:EventService,
              private calendarService:CalendarService,) {
    this.init();


  }

  init(){
    this.tellYouQueue = new AsyncQueue(({message}, callback) => {
      let tellYouData:TellYouBase = message;
      let show = false;
      let time1 = 2000;
      let time2 = 5000;
      let pageData:TellYou = new TellYou();
      Object.assign(pageData,tellYouData);
      switch (tellYouData.tellType) {
        case TellyouType.invite_agenda,
          TellyouType.invite_planitem:
          //是邀请的情况，在缓存中拿是否播报
          let index = this.invites.findIndex(
            (val)=>{
              return val.id == tellYouData.id && val.tellType == tellYouData.tellType;
            });

          if (index == -1){
            break;
          }

          this.invites.splice(index,1);

          if(tellYouData.idtype == TellyouIdType.Agenda){
            this.eventService.getAgenda(tellYouData.id,false).then(agendaData =>{
              pageData.formperson= agendaData.creator.ran; //发起人
              pageData.fromdate= agendaData.evt + agendaData.evi; //日期 时间 时长
              pageData.datetype= agendaData.evn;//1 开始时间 2 截至到
              pageData.sn= agendaData.evn; //内容主题
              pageData.repeat= agendaData.rtjson.text();//重复文字
              pageData.invites= agendaData.members.length; //邀请人数

              pageData.bells= this.reminds.length; //剩余提醒个数
              pageData.handshake=this.invites.length;//剩余邀请个数
              pageData.systems= this.systems.length;//剩余系统消息个数
              pageData.spearktext = pageData.formperson + "邀请你一个活动。主题" + pageData.sn + "时间：" + pageData.fromdate;//播报格式
              // pageData.remindtime = "111111";//提醒时间，提醒的情况下有
            });
          }

          if(tellYouData.idtype == TellyouIdType.PlantIem){

            this.calendarService.getPlanItem(tellYouData.id).then(planItem =>{

              pageData.formperson= planItem.ui; //发起人
              pageData.fromdate= planItem.sd + planItem.st; //日期 时间 时长
              pageData.datetype= planItem.sd;//1 开始时间 2 截至到
              pageData.sn= planItem.jtn; //内容主题
              pageData.repeat= planItem.rtjson.text();//重复文字
              pageData.invites= planItem.members.length; //邀请人数

              pageData.bells= this.reminds.length; //剩余提醒个数
              pageData.handshake=this.invites.length;//剩余邀请个数
              pageData.systems= this.systems.length;//剩余系统消息个数
              pageData.spearktext = pageData.formperson + "邀请你一个活动。主题" + pageData.sn + "时间：" + pageData.fromdate;//播报格式
              // pageData.remindtime = "111111";//提醒时间，提醒的情况下有
            });
          }


          // if(tellYouData.idtype == TellyouIdType.MiniTask){
          //   let miniTask:MiniTaskData = await this.eventService.getMiniTask(tellYouData.id);
          // }

          break;

        case TellyouType.remind_agenda,
          TellyouType.remind_minitask,
          TellyouType.remind_planitem,
          TellyouType.remind_todo,
          TellyouType.remind_merge:

          break;
        case TellyouType.system:
          pageData.formperson="111"; //发起人
          pageData.fromdate= "22222"; //日期 时间 时长
          pageData.datetype= "22222";//1 开始时间 2 截至到
          pageData.sn= "22222"; //内容主题
          pageData.repeat= "22222";//重复文字
          pageData.invites= "22222"; //邀请人数

          pageData.bells= this.reminds.length; //剩余提醒个数
          pageData.handshake=this.invites.length;//剩余邀请个数
          pageData.systems= this.systems.length;//剩余系统消息个数
          pageData.spearktext = pageData.formperson + "邀请你一个活动。主题" + pageData.sn + "时间：" + pageData.fromdate;//播报格式

          show = true;

          break;
        default:

          break;
      }


      callback([{data:pageData,time1:time1,time2:time2,show:show}]);
      // callback([message]);
    }, 1, 1, "tellyou.queue", this.utilService, this.timeoutService);
  }

   regeditTellYou(showfn:Function,closefn:Function){
    this.showfn = showfn;
    this.closefn = closefn;
  }

   unRegeditTellYou(){
    this.showfn = noop;
    this.closefn = noop;
  }

   private pushTellYouData(tellYou: TellYouBase, fun: Function) {

     if (tellYou.tellType == TellyouType.remind_agenda || tellYou.tellType == TellyouType.remind_minitask ||
       tellYou.tellType == TellyouType.remind_planitem || tellYou.tellType == TellyouType.remind_todo ||
       tellYou.tellType == TellyouType.remind_merge ){
       this.tellYouQueue.unshift({message: tellYou}, (message) => {
         fun(message);
       });
     }else{
       this.tellYouQueue.push({message: tellYou}, (message) => {
         fun(message);
       });
     }
  }

  private pauseTellYou() {
    this.tellYouQueue.pause();
  }

  resumeTellYou() {
    this.tellYouQueue.resume();
  }

  ignoreAll() {
    this.tellYouQueue.kill();
    this.reminds.length = 0;
    this.systems.length = 0;
    this.invites.length = 0;
  }

  public prepare(base: TellYouBase) {
    if (base.tellType == TellyouType.invite_agenda || base.tellType == TellyouType.invite_planitem){
      this.invites.push(base);
    }else{
      if (base.tellType == TellyouType.remind_agenda || base.tellType == TellyouType.remind_minitask ||
        base.tellType == TellyouType.remind_planitem || base.tellType == TellyouType.remind_todo ||
        base.tellType == TellyouType.remind_merge ){
        this.reminds.push(base);
      }
      if (base.tellType == TellyouType.system){
        this.systems.push(base);
      }
       this.tellyou(base);
    }
  }

  public tellyou(tellYouData: TellYouBase) {
    this.pushTellYouData(tellYouData,(warp)=>{
      this.tellyoubegin(warp.data,warp.time1,warp.time2,warp.show);
    })

  }

  private tellyoubegin(tellYouData:TellYou,layshow:number,layclose:number,show:boolean){
    if (show){
      this.pauseTellYou();

      this.timeoutService.timeOutOnlyOne(layshow, () => {
        this.showfn(tellYouData);

        this.timeoutService.timeOutOnlyOne(layclose, () => {
          this.closefn();
          this.resumeTellYou();
        }, "close.home.ai.talk");

      }, "open.home.ai.talk");

    }
  }
}

export class TellYouBase {
  //1活动邀请 2日历项邀请 3活动提醒 4小任务提醒 5日历项提醒 6重要事项系统 7和并提醒 10系统消息
  tellType: TellyouType;
  id: string; //活动，日历项，小任务
  idtype: TellyouIdType;//活动，日历项，小任务
  spearktext: string;//播报格式
  remindtime: string;//提醒时间，提醒的情况下有
}


export class TellYou extends TellYouBase{
  formperson: string; //发起人
  fromdate: string; //日期 时间 时长
  datetype: string //1 开始时间 2 截至到
  sn: string;  //内容主题
  repeat: string; //重复文字
  invites;number //邀请人数
  bells: number; //剩余提醒个数
  handshake: number;//剩余邀请个数
  systems: number;//剩余系统消息个数
}

