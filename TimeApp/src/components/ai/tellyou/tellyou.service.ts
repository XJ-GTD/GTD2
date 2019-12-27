import {Injectable} from "@angular/core";
import {UtilService} from "../../../service/util-service/util.service";
import {TimeOutService} from "../../../util/timeOutService";
import {AsyncQueue} from "../../../util/asyncQueue";
import * as noop from "lodash/noop.js"
import {TellyouIdType, TellyouType} from "../../../data.enum";
import {EventService, MiniTaskData} from "../../../service/business/event.service";
import {CalendarService} from "../../../service/business/calendar.service";
import * as moment from "moment";
import {UserConfig} from "../../../service/config/user.config";
import {DataConfig} from "../../../service/config/data.config";
import {AnnotationService} from "../../../service/business/annotation.service";

@Injectable()
export class TellyouService {

  private tellYouQueue: AsyncQueue;

  private reminds: Array<TellYouBase> = new Array<TellYouBase>();
  private systems: Array<TellYouBase> = new Array<TellYouBase>();
  private invites: Array<TellYouBase> = new Array<TellYouBase>();
  private showfn:Function = noop;
  private closefn:Function = noop;

  friends: Array<any> = UserConfig.friends;

  constructor(private utilService: UtilService,
              private timeoutService: TimeOutService,
              private eventService:EventService,
              private calendarService:CalendarService,
              private annotationService:AnnotationService,) {
    this.init();


  }

  getRemindlen() {
    return this.reminds.length;
  }

  getSystemslen() {
    return this.systems.length;

  }

  getInvitelen() {
    return this.invites.length;
  }

  init(){
    this.tellYouQueue = new AsyncQueue(({message}, callback) => {
      let tellYouData:TellYouBase = message;
      let show = false;
      let time1 = 0;
      let time2 = 0;
      let pageData:TellYou = new TellYou();
      Object.assign(pageData,tellYouData);
      console.log("12111111111===tellYouQueue===>" + tellYouData.id + "===>" + tellYouData.tellType);
      switch (tellYouData.tellType) {
        case TellyouType.invite_agenda:
        case TellyouType.invite_planitem:
        case TellyouType.at_agenda:
        case TellyouType.cancel_planitem:
        case TellyouType.cancel_agenda:

          let index = this.invites.findIndex(
            (val)=>{
              return val.id == tellYouData.id && val.tellType == tellYouData.tellType;
            });

          if (index > -1 ){

            this.invites.splice(index,1);

            this.createtellData([tellYouData]).then((datas)=>{

              if (datas.length > 0  && datas[0].sn){
                Object.assign(pageData,datas[0]);
                time1 = 10;
                time2 = 30000;
                show = true;
              }
              callback([{data:pageData,time1:time1,time2:time2,show:show}]);
            }).catch(()=>{
              callback([{data:pageData,time1:time1,time2:time2,show:show}]);
            })
          }else{
            callback([{data:pageData,time1:time1,time2:time2,show:show}]);
          }

          break;

        case TellyouType.remind_agenda:
        case TellyouType.remind_minitask:
        case TellyouType.remind_planitem:
        case TellyouType.remind_todo:
        case TellyouType.remind_merge:

          this.createtellData(this.reminds).then((datas)=>{
            this.reminds.splice(0,this.reminds.length);

            if (datas.length > 0){
              if (datas.length == 1){
                Object.assign(pageData,datas[0]);
              }else{
                pageData.tellType = TellyouType.remind_merge;
                pageData.reminds = datas ;
              }
              time1 = 10;
              time2 = 30000;
              show = true;
              callback([{data:pageData,time1:time1,time2:time2,show:show}]);
            }else{
              callback([{data:pageData,time1:time1,time2:time2,show:show}]);
            }
          }).catch(()=>{
            callback([{data:pageData,time1:time1,time2:time2,show:show}]);
          })


          break;
        case TellyouType.system:

          let systems_i = this.systems.findIndex(
            (val)=>{
              return val.id == tellYouData.id && val.tellType == tellYouData.tellType;
            });

          if (index > -1 ){

            this.systems.splice(systems_i,1);

            this.createtellData([tellYouData]).then((datas)=>{

              if (datas.length > 0){
                Object.assign(pageData,datas[0]);
                time1 = 20;
                time2 = 5000;
                show = true;
              }
              callback([{data:pageData,time1:time1,time2:time2,show:show}]);
            }).catch(()=>{
              callback([{data:pageData,time1:time1,time2:time2,show:show}]);
            })
          }else{
            callback([{data:pageData,time1:time1,time2:time2,show:show}]);
          }

          break;
        default:

          callback([{data:pageData,time1:time1,time2:time2,show:show}]);
      }

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

  //把播报的数据放缓存中
  public prepare4wating(tellYouData: TellYouBase) {
    console.log("12111111111===prepare4wating===>" + tellYouData.id + "===>" + tellYouData.tellType);
    if (tellYouData.tellType == TellyouType.invite_agenda || tellYouData.tellType == TellyouType.invite_planitem
    ||tellYouData.tellType == TellyouType.at_agenda || tellYouData.tellType == TellyouType.cancel_agenda
      || tellYouData.tellType == TellyouType.cancel_planitem) {
      this.invites.push(tellYouData);
    } else if(tellYouData.tellType == TellyouType.remind_agenda || tellYouData.tellType == TellyouType.remind_minitask ||
      tellYouData.tellType == TellyouType.remind_planitem || tellYouData.tellType == TellyouType.remind_todo ||
      tellYouData.tellType == TellyouType.remind_merge) {
        this.reminds.push(tellYouData);
    } else{
      this.systems.push(tellYouData);
    }
  }

  public tellyou4invsited(tellYouData: TellYouBase) {
    //把播报数据推入Q中，方法参数要data，打开页面延迟时间，自动关闭页面时间，是否显示
    console.log("12111111111===tellyou4invsited===>" + tellYouData.id + "===>" + tellYouData.tellType);

    //是邀请的情况，在缓存中拿是否播报
    let index = this.invites.findIndex(
      (val)=>{
        return val.id == tellYouData.id;
      });

    if (index > -1 ){
      if (!this.invites[index].dataid) this.invites[index].dataid = tellYouData.dataid;
      if (this.invites[index].tellType == TellyouType.default) this.invites[index].tellType = tellYouData.tellType;

      Object.assign(tellYouData,this.invites[index]);
      this.pushTellYouData(tellYouData,(warp)=>{
        console.log("12111111111===tellyoubegin start===>" + tellYouData.id + "===>" + tellYouData.tellType);
        this.tellyoubegin(warp.data,warp.time1,warp.time2,warp.show);
      })
    }
  }

  public tellyou4remind(tellYouData: TellYouBase) {
    this.prepare4wating(tellYouData);
    //把播报数据推入Q中，方法参数要data，打开页面延迟时间，自动关闭页面时间，是否显示
    this.pushTellYouData(tellYouData,(warp)=>{
      this.tellyoubegin(warp.data,warp.time1,warp.time2,warp.show);
    })
  }

  public tellyou4system(tellYouData: TellYouBase) {
    this.prepare4wating(tellYouData);
    //把播报数据推入Q中，方法参数要data，打开页面延迟时间，自动关闭页面时间，是否显示
    this.pushTellYouData(tellYouData,(warp)=>{
      //设置中关闭消息
      if (!UserConfig.getSetting(DataConfig.SYS_CLV)){
        this.tellyoubegin(warp.data,warp.time1,warp.time2,warp.show);
      }
    })
  }

  private tellyoubegin(tellYouData:TellYou,layshow:number,layclose:number,show:boolean){
    if (show){
      this.pauseTellYou();

      this.timeoutService.timeOutOnlyOne(layshow, () => {
        this.createSpeakText(tellYouData);
        this.showfn(tellYouData);

        this.timeoutService.timeOutOnlyOne(layclose, () => {
          this.closefn();
          this.resumeTellYou();
        }, "close.home.ai.talk");

      }, "open.home.ai.talk");

    }
  }

   private async  createtellData(tellYous: Array<TellYouBase>){
    let tellYouDatas:Array<TellYou> = new Array<TellYou>();

    for (let tellyoubase of tellYous){
      let pageData: TellYou = new TellYou();
      Object.assign(pageData,tellyoubase);

      let searchid = tellyoubase.dataid?tellyoubase.dataid:tellyoubase.id;

      if(tellyoubase.idtype == TellyouIdType.Agenda){
        let agendaData = await  this.eventService.getAgenda(searchid,false);
        if (!agendaData){
          continue;
        }
          pageData.formperson= agendaData.ui; //发起人
          pageData.fromdate= agendaData.evd + agendaData.evt; //日期 时间 时长
          pageData.datetype= agendaData.al;//1 开始时间 2 截至到
          pageData.sn= agendaData.evn; //内容主题
          pageData.repeat= agendaData.rtjson.text();//重复文字
          pageData.invites= agendaData.members.length; //邀请人数

        if (tellyoubase.tellType == TellyouType.at_agenda){
          this.annotationService.getAnnotation()
        }
      }

      if(tellyoubase.idtype == TellyouIdType.PlanItem){

        let planItem = await this.calendarService.getPlanItem(searchid);
        if (!planItem){
          continue;
        }
          pageData.formperson = planItem.ui; //发起人
          pageData.fromdate= planItem.sd + planItem.st; //日期 时间 时长
          pageData.datetype= "0";//1 开始时间 2 截至到
          pageData.sn= planItem.jtn; //内容主题
          pageData.repeat= planItem.rtjson.text();//重复文字
          pageData.invites= planItem.members.length; //邀请人数
      }


      if(tellyoubase.idtype == TellyouIdType.MiniTask){


        let miniTask:MiniTaskData = await this.eventService.getMiniTask(searchid);
        if (!miniTask){
          continue;
        }
          // pageData.formperson = miniTask.ui; //发起人
          pageData.fromdate= miniTask.evd + miniTask.evi; //日期 时间 时长
          pageData.datetype= "0";//1 开始时间 2 截至到
          pageData.sn= miniTask.evn; //内容主题
          pageData.repeat= "";//重复文字
          pageData.invites= 0; //邀请人数
      }

      tellYouDatas.push(pageData)
    }

    return tellYouDatas

  }

  createSpeakText(pageData:TellYou){
    let time =  pageData.fromdate ? moment(pageData.fromdate,"YYYY/MM/DD hh:ss").format("YYYY年M月D日 A h点s分"):"";

    let person = pageData.formperson;
    let friend = this.friends.find((val) => {
      return person == val.ui;
    })
    if (friend){
      person = friend.ran;
    }
    let text = pageData.sn;
    let repeat = pageData.repeat;
    let timeype = pageData.datetype != '2'? '开始于':'截至到';
    let remindtime =  pageData.remindtime ? moment(pageData.remindtime,"YYYY/MM/DD hh:ss").format("YYYY年M月D日 A h点s分"):"";
    let atype = "";
    if (pageData.idtype ==  TellyouIdType.PlanItem){
      atype = "日历";
    }
    if (pageData.idtype ==  TellyouIdType.Agenda){
      atype = "活动";
    }
    if (pageData.idtype ==  TellyouIdType.MiniTask){
      atype = "小任务";
    }
    let invites = "有" + (pageData.invites + 1) + "个参与人";

    if (pageData.tellType == TellyouType.invite_planitem
      || pageData.tellType == TellyouType.invite_agenda){
      pageData.spearktext = `${person}有一个${atype}。内容是${text}。希望加入到你的冥王星。这个 ${atype} ${timeype} ${time}。已经${invites}`;

    } else if (pageData.tellType == TellyouType.remind_planitem
      || pageData.tellType == TellyouType.remind_agenda){
      pageData.spearktext = `提醒。${text}。这个${atype}来自${person}`;

    }else if (pageData.tellType == TellyouType.remind_minitask){
      pageData.spearktext = `提醒。${text}`;
    }else if (pageData.tellType == TellyouType.remind_todo){
      pageData.spearktext = `提醒。${text}。这个${atype}来自${person}。它超过预定的时间了。`;
    }else if (pageData.tellType == TellyouType.remind_merge){
      pageData.spearktext = `有${pageData.reminds.length}个提醒。有点多，可以关注一下冥王星中的活动。`;
    }else if (pageData.tellType == TellyouType.at_agenda){
      pageData.spearktext = `${person}@你。${text}。你可能需要去关注一下。`;
    }else if (pageData.tellType == TellyouType.cancel_agenda ||pageData.tellType == TellyouType.cancel_planitem ){
      pageData.spearktext = `你有一个${atype}被取消了。内容是${text}。`;
    }else{
      pageData.spearktext = `小冥刚才做了${pageData.spearktext}`;
    }

  }
}

export class TellYouBase {
  //1活动邀请 2日历项邀请 3活动提醒 4小任务提醒 5日历项提醒 6重要事项系统 7和并提醒 10系统消息
  tellType: TellyouType;
  id: string; //活动，日历项，小任务
  dataid: string; //at
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
  speakering:boolean = true;
  reminds:Array<TellYou>;// 合并提醒的数据集合
  mp3:string = "9";//对方提醒的MP3
}
