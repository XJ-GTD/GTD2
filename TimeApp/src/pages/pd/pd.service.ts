import {Injectable} from "@angular/core";
import {PersonRestful} from "../../service/restful/personsev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
import {ShaeRestful, ShareData} from "../../service/restful/shaesev";
import {AgdPro, ContactPerPro} from "../../service/restful/agdsev";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {ETbl} from "../../service/sqlite/tbl/e.tbl";
import {DTbl} from "../../service/sqlite/tbl/d.tbl";
import {BTbl} from "../../service/sqlite/tbl/b.tbl";
import {BsModel} from "../../service/restful/out/bs.model";

@Injectable()
export class PdService {
  constructor(private sqlExce: SqliteExec,
              private shareRestful:ShaeRestful,
  ) {
  }

  //获取计划 计划详情
  async getPlan(pid:string){
    pid = "chinese_famous_2019";

    //获取本地计划
    let jhTbl: JhTbl = new JhTbl();
    jhTbl.ji = pid;

    jhTbl = await this.sqlExce.getOne<JhTbl>(jhTbl);

    // 获取计划管理日程（重复日程处理等）
    let ctbl:CTbl =new CTbl();
    ctbl.ji = jhTbl.ji;

    let ctbls = await this.sqlExce.getList<CTbl>(ctbl);

    let paList:Array<AgdPro> = Array<AgdPro>();
    for (var j = 0, len = ctbls.length; j < len; j++) {
      let pa:AgdPro = new AgdPro();
      pa.ai = ctbls[j].si;//日程ID
      pa.at = ctbls[j].sn;//主题
      pa.adt = ctbls[j].sd + " " + ctbls[j].st;//时间(YYYY/MM/DD HH:mm)
      pa.ap = ctbls[j].ji;//计划
      pa.ar = ctbls[j].rt;//重复
      pa.aa = ctbls[j].sn;//提醒
      //参与人

      paList.push(pa);
    }
    console.log("testful shareData "+ JSON.stringify(paList));
    //显示处理


    // 返出参
    let ret = new BsModel();
    ret.code = 0;
    ret.data = paList;
    return ret;
  }

  //分享计划
  async sharePlan(pid:string){
    pid = "chinese_famous_2019";

    //获取本地计划
    let jhTbl: JhTbl = new JhTbl();
    jhTbl.ji = pid;

    jhTbl = await this.sqlExce.getOne<JhTbl>(jhTbl);

    // 获取计划管理日程（重复日程处理等）
    let ctbl:CTbl =new CTbl();
    ctbl.ji = jhTbl.ji;

    let ctbls = await this.sqlExce.getList<CTbl>(ctbl);

    let paList:Array<AgdPro> = Array<AgdPro>();
    for (var j = 0, len = ctbls.length; j < len; j++) {
      let pa:AgdPro = new AgdPro();
      pa.ai = ctbls[j].si;//日程ID
      pa.at = ctbls[j].sn;//主题
      pa.adt = ctbls[j].sd + " " + ctbls[j].st;//时间(YYYY/MM/DD HH:mm)
      pa.ap = ctbls[j].ji;//计划
      pa.ar = ctbls[j].rt;//重复
      pa.aa = ctbls[j].sn;//提醒

      //提醒获取
      let etbl:ETbl =new ETbl();
      etbl.si = ctbls[j].si;

      if(ctbls[j].rt == "0"){
        etbl = await this.sqlExce.getOne<ETbl>(etbl);
        //pa.am = etbl.  TODO
      }else {
        //TODO
        await this.sqlExce.getList<ETbl>(etbl);
      }

      //日程参与人
      let dtbl:DTbl =new DTbl();
      dtbl.si = ctbls[j].si;
      let dList = await this.sqlExce.getList<DTbl>(dtbl);
      for (var d = 0, len = dList.length; d < len; d++) {
        let btbl:BTbl =new BTbl();
        btbl.pwi = dList[d].ai;
        btbl = await this.sqlExce.getOne<BTbl>(btbl);
        //赋值给参与人信息
        let cp:ContactPerPro =new ContactPerPro();
        cp.ai = btbl.pwi;//帐户ID
        cp.bd = "1990/07/01";//生日
        cp.mpn = btbl.rc;//手机号码
        cp.n = btbl.rn;//姓名
        cp.s = "";//性别
        cp.a = btbl.hiu;//头像
        pa.ac.push(cp);//参与人
      }
      paList.push(pa);
    }

    let shareData:ShareData = new ShareData();
    shareData.ompn="";
    shareData.oai="";
    shareData.d.p.pn = "";
    shareData.d.p.pa = paList;

    //restful上传计划
    let bs = await this.shareRestful.share(shareData);
    console.log("testful shareData "+ JSON.stringify(bs));

    // 返出参
    let ret = new BsModel();
    ret.code = 0;
    ret.data = bs;
    return ret;
  }

  //删除计划
  async delete(pid:string){
    pid = "chinese_famous_2019";

    //获取本地计划
    let jhTbl: JhTbl = new JhTbl();
    jhTbl.ji = pid;

    jhTbl = await this.sqlExce.getOne<JhTbl>(jhTbl);

    // 删除本地计划日程关联
    //获取计划管理日程
    let ctbl:CTbl =new CTbl();
    ctbl.ji = jhTbl.ji;

    let ctbls = await this.sqlExce.getList<CTbl>(ctbl);

    for (var j = 0, len = ctbls.length; j < len; j++) {

      //提醒删除
      let etbl:ETbl =new ETbl();
      etbl.si = ctbls[j].si;
      await this.sqlExce.delete(etbl);

      //日程参与人删除
      let dtbl:DTbl =new DTbl();
      dtbl.si = ctbls[j].si;
      await this.sqlExce.delete(dtbl);

      //计划关联日程删除
      await this.sqlExce.delete(ctbl);
    }
    // 删除本地计划
    await this.sqlExce.delete(jhTbl);

    // TODO restful删除分享计划

    // 返出参
    let ret = new BsModel();
    ret.code = 0;
    return ret;
  }

}
