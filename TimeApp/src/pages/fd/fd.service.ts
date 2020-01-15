import {Injectable} from "@angular/core";
import {PersonRestful} from "../../service/restful/personsev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UtilService} from "../../service/util-service/util.service";
import {BlaReq, BlaRestful} from "../../service/restful/blasev";
import {UserConfig} from "../../service/config/user.config";
import {CalendarService, ExchangeSummaryData} from "../../service/business/calendar.service";
import {FsData} from "../../data.mapping";
import {Friend, GrouperService} from "../../service/business/grouper.service";

@Injectable()
export class FdService {
  constructor(private personRes:PersonRestful,
              private blasev:BlaRestful,
              private util:UtilService,
              private calendarService:CalendarService,
              private sqlite:SqliteExec,
              private userConfig:UserConfig,
              private grouperService:GrouperService) {
  }

  /**
   * 获取个人详情
   * @param {String} id
   * @returns {Promise<FsData>}
   */
  get(fd:Friend):Promise<Friend>{
    return new Promise<Friend>((resolve, reject)=>{
      this.grouperService.updateOneFs(fd.rc).then(data=>{
        resolve(data);
      })
    })
  }

  async getExchangeSummary(fd:Friend): Promise<ExchangeSummaryData> {
    return await this.calendarService.getExchangeActivitySummary(fd.rc);
  }

  getBlack(phoneno:string):Promise<boolean> {

    return new Promise((resolve, reject)=>{
      let isBlack:boolean = false;
      //restFul查询是否是黑名单
      this.blasev.list().then(data=>{
        if(data && data.length>0){
          for(let bla of data){
            if(bla.mpn == phoneno){
              isBlack = true; //是黑名单；
              break;
            }
          }
        }
        resolve(isBlack);
      }).catch(error=>{
        resolve(isBlack);
      })
    })
  }

  //restFul 加入黑名单
  putBlack(fd:Friend):Promise<boolean>{
    return new Promise<boolean>((resolve, reject)=>{
      let bla = new BlaReq();
       if(fd && fd.rc){
         bla.ai=fd.ui;
         bla.mpn= fd.rc;
         bla.n= fd.rn;
         //bla.a= fd.hiu;
         bla.s='';
         bla.bd= '';
       }
      this.blasev.add(bla).then(data=>{
        resolve(true);
      }).catch(e=>{
        resolve(false);
      })
    })
  }

  /**
   * restFul 移除入黑名单
   * @param {string} mpn 手机号
   * @returns {Promise<BsModel<BlaReq>>}
   */
  removeBlack(mpn:string):Promise<boolean>{
    return new Promise<boolean>((resolve, reject)=>{
      let bla = new BlaReq();
      bla.mpn = mpn;
      this.blasev.remove(bla).then(data=>{
        resolve(true);
      }).catch(e=>{
        resolve(false);
      })
    })

  }
}
