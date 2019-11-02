import {Injectable} from "@angular/core";
import {ShaeRestful, ShareData} from "../../service/restful/shaesev";
import {PagePDPro} from "../../data.mapping";
import {CalendarService, PlanData, PlanItemData} from "../../service/business/calendar.service";
import {EventData} from "../../service/business/event.service";
import {MemoData} from "../../service/business/memo.service";
import {PdItem} from "./pd";
import * as moment from "moment";
@Injectable()
export class PdService {
  constructor(private shareRestful: ShaeRestful,private calendarService: CalendarService) {}

  //获取计划 计划详情
  async getPlan(pid: string,jt:string) {
    let pdItems:Array<PdItem> = new Array<PdItem>();
    let paList: PlanData = await this.calendarService.getPlan(pid,true);
    let tmpyear:number = -1;

    let getDatetime = (element) => {
      let datetime: string = moment().format("YYYY/MM/DD HH:mm");

      let activityType: string =  this.calendarService.getActivityType(first);

      switch (activityType) {
        case "PlanItemData" :
          let item: PlanItemData = {} as PlanItemData;
          Object.assign(item, element);

          datetime = item.sd + " " + item.st;
          break;
        case "AgendaData" :
        case "TaskData" :
        case "MiniTaskData" :
          let event: EventData = {} as EventData;
          Object.assign(event, element);

          datetime = event.evd + " " + event.evt;
          break;
        case "MemoData" :
          let memo: MemoData = {} as MemoData;
          Object.assign(memo, element);

          datetime = memo.sd + " " + memo.st;
          break;
      }

      return datetime;
    };

    paList.items.sort((first, second) => {
      let firstdt: string = getDatetime(first);
      let seconddt: string = getDatetime(second);

      return moment(firstdt, "YYYY/MM/DD HH:mm").diff(seconddt);
    });

    paList.items.forEach((v,i,a)=>{
      let activityType: string =  this.calendarService.getActivityType(v);
      // 取得活动日期
      let pdItem:PdItem = new PdItem();
      pdItem.type = activityType;
      let tmp:moment.Moment;
      switch (activityType) {
        case "PlanItemData" :
          pdItem.planItemData = v;
           tmp = moment(pdItem.planItemData.sd);
          pdItem.yearitem = tmp.get("year");
          pdItem.date = tmp.format("YYYY/MM/DD");
          pdItem.time = pdItem.planItemData.st;
          break;
        case "AgendaData" :
          pdItem.agendaData = v;
           tmp = moment(pdItem.agendaData.evd);
          pdItem.yearitem = tmp.get("year");
          pdItem.date = tmp.format("YYYY/MM/DD");
          pdItem.time = pdItem.agendaData.evt;
          break;
        case "TaskData" :
          pdItem.taskData = v;
          tmp = moment(pdItem.taskData.evd);
          pdItem.yearitem = tmp.get("year");
          pdItem.date = tmp.format("YYYY/MM/DD");
          pdItem.time = pdItem.taskData.evt;
          break;
        case "MiniTaskData" :
          pdItem.miniTaskData = v;
          tmp = moment(pdItem.miniTaskData.evd);
          pdItem.yearitem = tmp.get("year");
          pdItem.date = tmp.format("YYYY/MM/DD");
          pdItem.time = pdItem.miniTaskData.evt;
          break;
        case "MemoData" :
          pdItem.memoData = v;
          tmp = moment(pdItem.memoData.sd);
          pdItem.yearitem = tmp.get("year");
          pdItem.date = tmp.format("YYYY/MM/DD");
          pdItem.time = pdItem.memoData.st;
          break;
        default:
          break;
      }

      if (tmpyear != pdItem.yearitem){
        tmpyear = pdItem.yearitem;
        let pdyearItem:PdItem = new PdItem();
        pdyearItem.yearitem = tmpyear;
        pdyearItem.type = "YearData";
        pdItems.push(pdyearItem);
      }

      pdItems.push(pdItem);

    });

    // pdItems.sort((first, second) => {
    //   let firstdt: string = first.date? (first.date + " " + first.time) : (first.yearitem + "/01/01 00:00");
    //   let seconddt: string = second.date? (second.date + " " + second.time) : (second.yearitem + "/01/01 00:00");
    //   return moment(firstdt, "YYYY/MM/DD HH:mm").diff(seconddt);
    // });

    // 返出参
    return pdItems;
  }

  //分享计划
  sharePlan(plan: PagePDPro): Promise<any> {

    return new Promise((resolve, reject) => {
      console.log('---------- PdService sharePlan 分享计划开始 ----------------');

      let shareData: ShareData = new ShareData();
      shareData.ompn = "";
      shareData.oai = "";
      // plan.pn.pt = plan.pn.jn; // pt 计划分享使用
      // shareData.d.p.pn = plan.pn;
      // shareData.d.p.pa = plan.pa;

      //restful上传计划
      this.shareRestful.share(shareData).then(data => {
        console.log('---------- PdService sharePlan 分享计划结束 ----------------');
        // 返出参
        resolve(data);
      })

    })

  }

  //删除计划
  async delete(jh:PagePDPro){
    // return this.calendarService.removePlan().delRcByJiAndJt(jh.ji,jh.jt);
  }
}
