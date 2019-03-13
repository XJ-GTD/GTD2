import {Injectable} from "@angular/core";
import {PersonRestful} from "../../service/restful/personsev";
import {SmsRestful} from "../../service/restful/smssev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UtilService} from "../../service/util-service/util.service";
import {RestFulConfig} from "../../service/config/restful.config";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
import {ShaeRestful, ShareData} from "../../service/restful/shaesev";
import {AgdPro, ContactPerPro} from "../../service/restful/agdsev";

@Injectable()
export class PdService {
  constructor(private personRestful: PersonRestful,
              private smsRestful: SmsRestful,
              private sqlExce: SqliteExec,
              private util: UtilService,
              private restfulConfig: RestFulConfig,
              private shareRestful:ShaeRestful,
  ) {
  }

  //获取计划 计划详情
  getPlan(pid:string):Promise<any>{

    return new Promise<any>((resolve, reject) => {
      //获取本地计划
      let jhTbl: JhTbl = new JhTbl();
      //jhTbl.ji = pid;
      jhTbl.ji = "chinese_famous_2019";
      this.sqlExce.getOne(jhTbl).then(data=>{
        console.log("testful getPlan "+ JSON.stringify(data));
        // TODO 获取计划管理日程（重复日程处理等）
        // TODO 获取计划管理特殊日程（重复日程处理等）

      })
    })

  }

  //分享计划
  sharePlan(pid:string):Promise<any>{

    return new Promise<any>((resolve, reject) => {
      //获取本地计划日程
      let jhTbl: JhTbl = new JhTbl();
      jhTbl.ji = "chinese_famous_2019";

      let shareData:ShareData = new ShareData();
      shareData.ompn="13661617252";
      shareData.oai="13661617252";
      shareData.d.p.pn = "";
      let pa:AgdPro = new AgdPro();
      pa.ai= 'ai';//日程ID
      pa.at = 'at';//主题
      pa.adt= '2019/03/12';//时间(YYYY/MM/DD HH:mm)
      pa.ap= 'chinese_famous_2019';//计划
      pa.ar= '0'; //重复
      pa.aa= '1';//提醒
      pa.am= '0';//备注

      let cp:ContactPerPro =new ContactPerPro();
      cp.ai ="a15737921611";
      cp.bd="1990/07/01";
      cp.mpn="15737921611";
      cp.n="ding";
      cp.s="f";
      pa.ac.push(cp);//参与人
      shareData.d.p.pa.push(pa);

      /*
      let jhTbl: JhTbl = new JhTbl();
      //jhTbl.ji = pid;
      jhTbl.ji = "chinese_famous_2019";
      this.sqlExce.getOne(jhTbl).then(data=>{
        console.log("testful getPlan "+ JSON.stringify(data));
      })
       */

      //restful上传计划
      this.shareRestful.share(shareData).then(data=>{
        console.log("testful shareData "+ JSON.stringify(data));
      })
    })

  }

  //删除计划
  deletePlan(pid:string):Promise<any>{
    return new Promise<any>((resolve, reject) => {
      //获取本地计划
      let jhTbl: JhTbl = new JhTbl();
      //jhTbl.ji = pid;
      jhTbl.ji = "chinese_famous_2019";
      this.sqlExce.getOne(jhTbl).then(data=>{
        console.log("testful getPlan "+ JSON.stringify(data));
        // TODO 删除本地计划日程关联
        // 删除本地计划
        //this.sqlExce.delete(jhTbl);
        // TODO restful删除分享计划

      })
    })
  }
}
