import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {ShaeRestful, ShareData} from "../../service/restful/shaesev";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {AgdPro} from "../../service/restful/agdsev";
import {PagePDPro} from "../../data.mapping";

@Injectable()
export class PdService {
  constructor(private sqlExec: SqliteExec,
              private shareRestful: ShaeRestful,) {}

  //获取计划 计划详情
  async getPlan(pid: string) {
    console.log('---------- PdService getPlan 获取计划开始 ----------------');
    // 获取计划管理日程（重复日程处理等）
    let  sql = 'select gc.* from gtd_c gc left join gtd_sp sp on gc.si = sp.si where gc.ji = "' + pid + '"  order by gc.sd,gc.st desc';
    let  cs = await this.sqlExec.getExtList<CTbl>(sql);

    let paList: Array<AgdPro> = Array<AgdPro>();
    if (cs.length > 0) {
      console.log('---------- PdService getPlan 获取计划日程开始 ----------------');
      //获取计划日程
      for (let jhc of cs) {
        let pa: AgdPro = new AgdPro();

        pa.ai = jhc.si;//日程ID
        pa.at = jhc.sn;//主题
        pa.adt = jhc.sd + " " + jhc.st;//时间(YYYY/MM/DD HH:mm)
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
    return paList;
  }

  //分享计划
  sharePlan(plan: any): Promise<any> {

    return new Promise((resolve, reject) => {
      console.log('---------- PdService sharePlan 分享计划开始 ----------------');

      let shareData: ShareData = new ShareData();
      shareData.ompn = "";
      shareData.oai = "";
      plan.pn.pt = plan.pn.jn; // pt 计划分享使用
      shareData.d.p.pn = plan.pn;
      shareData.d.p.pa = plan.pa;

      //restful上传计划
      this.shareRestful.share(shareData).then(data => {
        console.log('---------- PdService sharePlan 分享计划结束 ----------------');
        // 返出参
        resolve(data);
      })

    })

  }

  //删除系统计划
  async delete(jh: PagePDPro) {
    if (jh.jt == "2") {
      console.log('---------- PdService delete 删除计划开始 ----------------');
      let sqls:Array<string> = new Array<string>();
      // 删除计划日程关联  获取计划管理日程
      let jhTbl: JhTbl = new JhTbl();
      jhTbl.ji = jh.ji;

      // 本地计划日程关联
      //修改日程表 计划 ji 去除
      sqls.push('update gtd_c set ji = null where ji = "' + jhTbl.ji + '";');
      //修改日程表 计划 ji 去除
      sqls.push('update gtd_sp set ji = null where ji = "' + jhTbl.ji + '";');

      sqls.push(jhTbl.dT());

      await this.sqlExec.batExecSql(sqls);
      console.log('---------- PdService delete 删除计划结束 ----------------');
    }
  }
}
