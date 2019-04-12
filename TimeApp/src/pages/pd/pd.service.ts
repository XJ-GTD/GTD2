import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {ShaeRestful, ShareData} from "../../service/restful/shaesev";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {ETbl} from "../../service/sqlite/tbl/e.tbl";
import {DTbl} from "../../service/sqlite/tbl/d.tbl";
import {BsModel} from "../../service/restful/out/bs.model";
import {AgdPro} from "../../service/restful/agdsev";

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

    sql = 'select gc.si,gc.sn,gc.bz,gc.ji,gc.rt,gc.sr,sp.sd,sp.st,sp.et,sp.ed from gtd_c gc ' +
      'left join gtd_sp sp on sp.si = gc.si ' +
      'where gc.ji = "'+ pid + '" order by sp.sd,sp.st desc';
    let cs = new  Array<CTbl>();
    cs = await this.sqlExce.getExtList<CTbl>(sql);

    let paList:Array<AgdPro> = Array<AgdPro>();
    if(cs.length>0){
      console.log('---------- PdService getPlan 获取计划日程开始 ----------------');
      //获取计划日程
      for(let jhc of cs){
        let pa:AgdPro = new AgdPro();

        pa.ai = jhc.si;//日程ID
        pa.at = jhc.sn;//主题
        pa.adt = jhc.sd +" "+ jhc.st ;//时间(YYYY/MM/DD HH:mm)
        pa.st = jhc.st;
        pa.et = jhc.et;//结束日期
        pa.ed = jhc.ed;//结束时间
        pa.ap = jhc.ji;//计划
        pa.ar = jhc.rt;//重复
        pa.aa = jhc.sr;//提醒
        pa.am = jhc.bz;//备注
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
   sharePlan(plan:any):Promise<any>{

     return new Promise((resolve, reject) => {
       console.log('---------- PdService sharePlan 分享计划开始 ----------------');

       let shareData:ShareData = new ShareData();
       shareData.ompn="";
       shareData.oai="";
       shareData.d.p.pn = plan.pn;
       shareData.d.p.pa = plan.pa;

       //restful上传计划
       this.shareRestful.share(shareData).then(data=>{
         console.log('---------- PdService sharePlan 分享计划结束 ----------------');
         // 返出参
         resolve(data);
       })

     })

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

    //修改日程表 计划为 null
    let sql ='update gtd_c set ji= null where ji = "'+ jhTbl.ji +'";';
    this.sqlExce.execSql(sql);

    //修改日程表 计划为 null
    let spSql ='update gtd_sp set ji= null where ji = "'+ jhTbl.ji +'";';
    this.sqlExce.execSql(spSql);

    /*let ctbls = await this.sqlExce.getList<CTbl>(ctbl);

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
    }*/

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

  js: any = 0; //日程数量
  jtd: string = "0"; //系统计划区别是否下载
  pt: string = "";//计划名  计划分享使用
}
