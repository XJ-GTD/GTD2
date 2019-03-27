import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {ShaeRestful, ShareData} from "../../service/restful/shaesev";
import {AgdPro, ContactPerPro} from "../../service/restful/agdsev";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
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
    console.log('---------- PdService getPlan 获取计划开始 ----------------');
    //获取本地计划
    let jh: JhTbl = new JhTbl();
    jh.ji = pid;
    jh = await this.sqlExce.getOne<JhTbl>(jh);

    // 获取计划管理日程（重复日程处理等）
    let sql = 'select * from gtd_c  where ji ="'+ pid +'" order by sd';

    sql = 'select gc.si,gc.sn,gc.bz,sp.sd,sp.st from gtd_c gc ' +
      'left join gtd_sp sp on sp.si = gc.si ' +
      'where gc.ji = "'+ pid + '" order by sp.sd,sp.st desc';
    let cs = new  Array<CTbl>();
    cs = await this.sqlExce.getExtList<CTbl>(sql);

    let paList:Array<ScdData> = Array<ScdData>();
    if(cs.length>0){
      console.log('---------- PdService getPlan 获取计划日程开始 ----------------');
      //获取计划日程
      for(let jhc of cs){
        let pa:ScdData = new ScdData();
        pa.si = jhc.si;//日程ID
        pa.sn = jhc.sn;//主题
        pa.adt = jhc.sd;//时间(YYYY/MM/DD HH:mm)
        pa.st = jhc.st;//开始时间
        pa.et = jhc.et;//结束日期
        pa.ed = jhc.ed;//结束时间
        pa.ji = jhc.ji;//计划
        pa.rt = jhc.rt;//重复
        pa.sn = jhc.sn;//提醒
        pa.bz = jhc.bz;//备注
        paList.push(pa);
      }
      console.log('---------- PlService getPlan 获取计划日程结束 ----------------');
    }
    //显示处理
    console.log('---------- PdService getPlan 获取计划结束 ----------------');
    // 返出参
    let bs = new BsModel();
    bs.code = 0;
    bs.data = paList;
    return bs;
  }

  //分享计划
  async sharePlan(pid:string){
    console.log('---------- PdService sharePlan 分享计划开始 ----------------');
    //获取本地计划
    let jhTbl: JhTbl = new JhTbl();
    jhTbl.ji = pid;
    jhTbl = await this.sqlExce.getOne<JhTbl>(jhTbl);

    // 获取计划管理日程（重复日程处理等）
    let ctbl:CTbl =new CTbl();
    ctbl.ji = jhTbl.ji;
    let ctbls = await this.sqlExce.getList<CTbl>(ctbl);

    let paList:Array<AgdPro> = Array<AgdPro>();
    if(ctbls.length>0){
      console.log('---------- PdService sharePlan 获取计划日程开始 ----------------');
      //获取计划日程
      for(let jhc of ctbls){
        let pa:AgdPro = new AgdPro();
        pa.ai = jhc.si;//日程ID
        pa.at = jhc.sn;//主题
        pa.adt = jhc.sd;//时间(YYYY/MM/DD HH:mm)
        pa.ap = jhc.ji;//计划
        pa.ar = jhc.rt;//重复
        pa.aa = jhc.sn;//提醒

        //提醒获取
        let etbl:ETbl =new ETbl();
        etbl.si = jhc.si;

        if(jhc.rt == "0"){
          etbl = await this.sqlExce.getOne<ETbl>(etbl);
          //pa.am = etbl.  TODO
        }else {
          //TODO
          await this.sqlExce.getList<ETbl>(etbl);
        }

        //日程参与人
        let dtbl:DTbl =new DTbl();
        dtbl.si = jhc.si;
        let dList = await this.sqlExce.getList<DTbl>(dtbl);
        for (let d = 0, len = dList.length; d < len; d++) {
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

        paList.push(pa)
      }
      console.log("testful shareData "+ JSON.stringify(paList));
      console.log('---------- PlService sharePlan 获取计划日程结束 ----------------');
    }

    let shareData:ShareData = new ShareData();
    shareData.ompn="";
    shareData.oai="";
    shareData.d.p.pn = "";
    shareData.d.p.pa = paList;

    //restful上传计划
    let share = await this.shareRestful.share(shareData);
    console.log("testful shareData "+ JSON.stringify(share));
    console.log('---------- PdService sharePlan 分享计划结束 ----------------');
    // 返出参
    let bs = new BsModel();
    bs.code = 0;
    bs.data = share;
    return bs;
  }

  //删除计划
  async delete(pid:string):Promise<BsModel<any>>{
    console.log('---------- PdService delete 删除计划开始 ----------------');
    //获取本地计划
    let jhTbl: JhTbl = new JhTbl();
    jhTbl.ji = pid;
    jhTbl = await this.sqlExce.getOne<JhTbl>(jhTbl);

    // 删除本地计划日程关联
    //获取计划管理日程
    let ctbl:CTbl =new CTbl();
    ctbl.ji = jhTbl.ji;
    let ctbls = await this.sqlExce.getList<CTbl>(ctbl);

    if(ctbls.length > 0){
      for (let j = 0, len = ctbls.length; j < len; j++) {
        //提醒删除
        let etbl:ETbl =new ETbl();
        etbl.si = ctbls[j].si;
        await this.sqlExce.delete(etbl);

        //日程参与人删除
        let dtbl:DTbl =new DTbl();
        dtbl.si = ctbls[j].si;
        await this.sqlExce.delete(dtbl);
      }
      //计划关联日程删除
      await this.sqlExce.delete(ctbl);

    }else{
      console.log('---------- PdService delete 计划管理日程无数据 ----------------');
    }

    // 删除本地计划
    let tbl: JhTbl = new JhTbl();
    tbl.ji = jhTbl.ji;
    await this.sqlExce.delete(tbl);



    // TODO restful删除分享计划
    console.log('---------- PdService delete 删除计划结束 ----------------');
    // 返出参
    let bs = new BsModel();
    bs.code = 0;
    return bs;
  }

}

//页面项目
export class PagePDPro{
  ji: string = "";//计划ID
  jn: string = "";//计划名
  jg: string = "";//计划描述
  jc: string = "";//计划颜色标记
  jt: string = "";//计划类型

  js: number = 0; //日程数量
  jtd: string = "0"; //系统计划区别是否下载
}

export class ScdData {
  si: string = "";//日程事件ID
  sn: string = "";//日程事件主题
  ui: string = "";//创建者
  adt: string = "";//开始日期
  st: string = "";//开始时间
  ed: string = "";//结束日期
  et: string = "";//结束时间
  rt: string = "";//重复类型
  ji: string = "";//计划ID
  sr: string = "";//日程关联ID
  bz: string = "";//备注
  tx: string = "";//提醒方式
  pni:string = "";//日程原始ID
  wtt: number;//时间戳
  du:string ="";//消息读取状态
  gs:string ="";//归属
}
